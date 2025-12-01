const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('lost', 'found'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'Electronics',
      'Clothing',
      'Books',
      'Keys',
      'IDs',
      'Bags',
      'Other'
    ),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  status: {
    type: DataTypes.ENUM('available', 'claimed', 'searching'),
    allowNull: false,
    defaultValue: 'searching'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'items',
  timestamps: true,
  hooks: {
    beforeCreate: (item) => {
      // Auto-set status based on type
      if (!item.status) {
        item.status = item.type === 'found' ? 'available' : 'searching';
      }
    }
  }
});

module.exports = Item;
