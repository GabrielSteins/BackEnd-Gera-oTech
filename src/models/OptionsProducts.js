const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Products = require('./Products');

const OptionsProducts = sequelize.define('OptionsProducts', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shape:{
    type: DataTypes.ENUM('square', 'circle'),
    allowNull: true,
    defaultValue:'square'
  },
  radius:{
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  type:{
    type: DataTypes.ENUM('text','color'),
    allowNull: true,
    defaultValue:'text'
  },
  values:{
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = OptionsProducts;
