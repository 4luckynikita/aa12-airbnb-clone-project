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
        address: '1688 Rockspring Pl',
        city: 'Walnut Creek',
        state: 'California',
        country: 'USA',
        lat: 37.88980053324249,
        lng: -122.02262033480356,
        name: 'Nice Vineyard Estate',
        description: 'This is an Estate setting in Joaquin Ranch for the next lucky owner of this massive home that shows the love and care throughout the years of current owners.',
        price: 800
      },
      {
        ownerId: 2,
        address: '49 Westgate Dr',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        lat: 35.125715,
        lng: -106.5368328,
        name: 'Walter White Residence',
        description: 'Filming place for Breaking Bad',
        price: 400.00
      },
      {
        ownerId: 3,
        address: '7129 Silver Ridge Peak St',
        city: 'Las Vegas',
        state: 'California',
        country: 'USA',
        lat: 36.29135774763068,
        lng: -115.3178767,
        name: 'Beautiful and spacious 1 story home',
        description: 'Large living room, dining room in front and great room and kitchen in back. Great room has custom cabinets with surround sound.',
        price: 84.99
      },
      {
        ownerId: 3,
        address: '1214 Shoreline Dr',
        city: 'Santa Barbara',
        state: 'California',
        country: 'USA',
        lat: 37.75777,
        lng: -122.25904,
        name: 'Beachside Santa Barbara Apartment',
        description: 'Welcome to your Oceanside Home on the Mesa, and embrace everyday living with Stunning Close-Up Panoramic Ocean Views, picturesque sights of the Channel Islands & the lush Shoreline Park.',
        price: 320.95
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
