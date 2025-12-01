const User = require('./User');
const Item = require('./Item');

// Define relationships
User.hasMany(Item, {
  foreignKey: 'userId',
  as: 'items',
  onDelete: 'CASCADE'
});

Item.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = { User, Item };
