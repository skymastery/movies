'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActorsInMovies extends Model {}
  ActorsInMovies.init(
    {
      actorsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      moviesId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'ActorsInMovies',
      modelName: 'ActorsInMovies',
    }
  );
  return ActorsInMovies;
};
