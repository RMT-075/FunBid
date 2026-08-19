'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    static associate(models) {
      // Bid ini punya 1 produk
      Bid.belongsTo(models.Product, {
        foreignKey: 'product_id'
      });

      // Bid ini punya 1 user (yang nge-bid)
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