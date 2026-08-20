'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
     
      Product.hasMany(models.Bid, {
        foreignKey: 'product_id'
      });

    
      Product.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });

      
      Product.belongsTo(models.User, {
        foreignKey: 'winner_id',
        as: 'winner'
      });
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    starting_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    current_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    bid_increment: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 1000
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'live', 'ended'),
      allowNull: false,
      defaultValue: 'upcoming'
    },
    winner_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Product',
    hooks: {
      beforeCreate: (product) => {
        product.current_price = product.starting_price;
      }
    }
  });
  return Product;
};