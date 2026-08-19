'use strict';
const bcrypt = require('bcrypt');
const users = require('../userDB.json');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    await queryInterface.bulkInsert('Users', hashedUsers);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};