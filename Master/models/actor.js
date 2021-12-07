'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Actor extends Model {
    static associate({ Movies }) {
      Actor.belongsToMany(Movies, {
        through: 'ActorsInMovies',
        as: 'movies',
        foreignKey: 'actorsId',
      });
    }
    // hiding the through table
    toJSON() {
      return { ...this.get(), ActorsInMovies: undefined };
    }
  }
  Actor.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'actors',
      modelName: 'Actor',
    }
  );
  return Actor;
};
