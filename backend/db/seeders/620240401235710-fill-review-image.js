'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'www.airbnb.com/img1.jpg'
      },
      {
        reviewId: 2,
        url: 'www.airbnb.com/img2.jpg'
      },
      {
        reviewId: 3,
        url: 'www.airbnb.com/img3.jpg'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
