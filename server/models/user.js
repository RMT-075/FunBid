'use strict';
const {
  Model
} = require('sequelize');
const { hashPW } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      
      User.hasMany(models.Product, {
        foreignKey: 'created_by'
      });

     
      User.hasMany(models.Bid, {
        foreignKey: 'user_id'
      });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {msg : "this name has been taken by others"},
      validate: {
        notNull: { msg: 'name is required' },
        notEmpty: { msg: 'name is required' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {msg : "email has been registered"},
      validate: {
        notNull: { msg: 'email is required' },
        notEmpty: { msg: 'email is required' },
        isEmail: { msg: 'Invalid email format' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'password is required' },
        notEmpty: { msg: 'password is required' }
      }
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

  User.beforeCreate((x) => {
    x.password = hashPW(x.password)
  })
  return User;
};