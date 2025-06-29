const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Products = require('./Products');

const ImageProducts = sequelize.define('ImageProducts', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Products,        
      key: 'id'               
    },
    onDelete: 'CASCADE',      
    allowNull: false
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false       
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = ImageProducts;
