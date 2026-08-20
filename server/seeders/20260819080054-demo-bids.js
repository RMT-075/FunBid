'use strict';
const bids = require('../bidDB.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = bids.map((bid) => ({
      ...bid,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Bids', data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bids', null, {});
  }
};