'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Produk yang dibuat admin ini
      User.hasMany(models.Product, {
        foreignKey: 'created_by'
      });

      // Semua bid yang pernah dilakukan user ini
      User.hasMany(models.Bid, {
        foreignKey: 'user_id'
      });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'bidder'),
      allowNull: false,
      defaultValue: 'bidder'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};