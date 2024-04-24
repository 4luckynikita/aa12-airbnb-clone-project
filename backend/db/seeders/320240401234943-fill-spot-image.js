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
        url: 'https://res.cloudinary.com/dkxfjbynk/image/upload/v1713742244/BNB4Me/Screenshot_2024-04-21_at_4.26.06_PM_oiairs.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://res.cloudinary.com/dkxfjbynk/image/upload/v1713742243/BNB4Me/Screenshot_2024-04-21_at_4.28.06_PM_fwute4.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://res.cloudinary.com/dkxfjbynk/image/upload/v1713742242/BNB4Me/Screenshot_2024-04-21_at_4.29.15_PM_rw5jkh.png',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://res.cloudinary.com/dkxfjbynk/image/upload/v1713743286/BNB4Me/Screenshot_2024-04-21_at_4.47.50_PM_sqqrqt.png',
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
