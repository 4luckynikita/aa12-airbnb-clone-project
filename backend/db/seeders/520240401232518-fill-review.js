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
        review: 'A good stay but the price was really high.',
        stars: 2,
      },
      {
        spotId: 3,
        userId: 1,
        review: 'Prime location to enjoy Vegas to its fullest!',
        stars: 5,
      },
      {
        spotId: 4,
        userId: 3,
        review: 'The front yard could have been cleaner but a respectable place',
        stars: 4
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {}, {});
  }
};
