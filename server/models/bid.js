'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    static associate(models) {
   
      Bid.belongsTo(models.Product, {
        foreignKey: 'product_id'
      });

     
      Bid.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
    }
  }
  Bid.init({
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Bid',
  });
  return Bid;
};