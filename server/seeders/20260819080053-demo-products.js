'use strict';
const products = require('../productDB.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = products.map((product) => ({
      ...product,
      current_price: product.starting_price, // karena bulkInsert gak trigger hook
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Products', data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};