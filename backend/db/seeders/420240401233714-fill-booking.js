'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: '2024-04-01',
        endDate: '2024-04-02'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2024-05-21',
        endDate: '2024-06-03'
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2024-05-09',
        endDate: '2024-05-20'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
