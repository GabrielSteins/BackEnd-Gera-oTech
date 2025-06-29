const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Products = sequelize.define('Products', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 0,
  },
  use_in_name: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 0,
  },
  stock:{
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0,
  },
  description:{
    type: DataTypes.STRING,
    allowNull:true
  },
  price:{
    type: DataTypes.FLOAT,
    allowNull:false
  },
  price_with_discount:{
    type: DataTypes.FLOAT,
    allowNull:false
  }
}, {
  timestamps: true
});

module.exports = Products;
