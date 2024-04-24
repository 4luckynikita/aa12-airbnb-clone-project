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
        url: 'https://res.cloudinary.com/dkxfjbynk/image/upload/v1713776454/BNB4Me/reviews/Screenshot_2024-04-22_at_1.56.25_AM_g7kmi2.png'
      },
      {
        reviewId: 2,
        url: 'https://res.cloudinary.com/dkxfjbynk/image/upload/v1713776128/BNB4Me/reviews/Screenshot_2024-04-22_at_1.54.17_AM_y62rlt.png'
      },
      {
        reviewId: 3,
        url: 'https://res.cloudinary.com/dkxfjbynk/image/upload/v1713776593/BNB4Me/reviews/Screenshot_2024-04-22_at_2.02.31_AM_awnuv0.png'
      },
      {
        reviewId: 4,
        url: 'https://res.cloudinary.com/dkxfjbynk/image/upload/v1713776638/BNB4Me/reviews/Screenshot_2024-04-22_at_2.03.41_AM_rljlim.png'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
