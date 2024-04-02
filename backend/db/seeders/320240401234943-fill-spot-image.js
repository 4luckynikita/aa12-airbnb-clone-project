'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'www.blahblah.com/img.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'www.walterwhite.com/img.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'www.open.appacademy.com/img.jpg',
        preview: true
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
