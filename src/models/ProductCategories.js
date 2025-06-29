const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Products = require('./Products');
const Categories = require('./Categories');

const ProductCategories = sequelize.define('ProductCategories', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Products,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categories,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  timestamps: true
});

module.exports = ProductCategories;
