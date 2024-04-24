'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Anabel',
        lastName: 'Jenkins',
        email: 'anjenkins43@yahoo.com',
        username: 'anjenkins43',
        hashedPassword: bcrypt.hashSync('anwashere')
      },
      {
        firstName: 'Mikey',
        lastName: 'Robertson',
        email: 'bigmikesmail@gmail.com',
        username: 'BigMikeBNB',
        hashedPassword: bcrypt.hashSync('secretpass101')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
