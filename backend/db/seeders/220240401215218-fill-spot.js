'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Bingobongo Court',
        city: 'Sacramento',
        state: 'California',
        country: 'USA',
        lat: 3.1415923,
        lng: 1.2345678,
        name: 'Silly Villa',
        description: 'A very silly villa for a night.',
        price: 120.99
      },
      {
        ownerId: 2,
        address: '308 Negra Arroyo Lane',
        city: 'Albuquerque',
        state: 'New Mexico',
        country: 'USA',
        lat: 35.125715,
        lng: -106.5368328,
        name: 'Walter White Residence',
        description: 'Filming place for Breaking Bad',
        price: 400.00
      },
      {
        ownerId: 3,
        address: '548 Market St. Suite 96590',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        lat: 37.7902461,
        lng: -122.4007921,
        name: 'App Academy HQ',
        description: 'No more in-person = rent out a classroom!',
        price: 20000.99
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
