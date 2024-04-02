'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: 'Pretty Good!',
        stars: 4,
      },
      {
        spotId: 2,
        userId: 3,
        review: 'The lights were out? Meh.',
        stars: 2,
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Walter this is great Walter',
        stars: 5,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
