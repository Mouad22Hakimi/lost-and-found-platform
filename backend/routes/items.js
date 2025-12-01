const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Item, User } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   GET /api/items
// @desc    Get all items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    let where = {};

    if (type) where.type = type;
    if (category && category !== 'all') where.category = category;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const items = await Item.findAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'studentId']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/items/:id
// @desc    Get item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'studentId']
      }]
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/items
// @desc    Create a new item
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      body('title', 'Title is required').notEmpty(),
      body('type', 'Type must be either lost or found').isIn(['lost', 'found']),
      body('category', 'Category is required').notEmpty(),
      body('location', 'Location is required').notEmpty(),
      body('date', 'Date is required').isISO8601(),
      body('description', 'Description is required').notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, type, category, location, date, description, image } = req.body;

    try {
      const item = await Item.create({
        title,
        type,
        category,
        location,
        date,
        description,
        image,
        userId: req.user.id
      });

      // Fetch item with user details
      const itemWithUser = await Item.findByPk(item.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'studentId']
        }]
      });

      res.json(itemWithUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/items/:id
// @desc    Update an item
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, type, category, location, date, description, status, image } = req.body;

  try {
    let item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns the item
    if (item.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update item
    await item.update({
      title: title || item.title,
      type: type || item.type,
      category: category || item.category,
      location: location || item.location,
      date: date || item.date,
      description: description || item.description,
      status: status || item.status,
      image: image !== undefined ? image : item.image
    });

    // Fetch updated item with user details
    const updatedItem = await Item.findByPk(item.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'studentId']
      }]
    });

    res.json(updatedItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete an item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user owns the item
    if (item.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await item.destroy();

    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/items/user/my-items
// @desc    Get current user's items
// @access  Private
router.get('/user/my-items', auth, async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { userId: req.user.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'studentId']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
