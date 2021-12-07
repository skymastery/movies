'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Movies extends Model {
    static associate({ Actor }) {
      Movies.belongsToMany(Actor, {
        through: 'ActorsInMovies',
        as: 'actors',
        foreignKey: 'moviesId',
      });
    }
    // hiding the through table
    toJSON() {
      return { ...this.get(), ActorsInMovies: undefined };
    }
  }
  Movies.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      year: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
          len: [4, 4],
        },
      },
      format: {
        type: DataTypes.CHAR,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue('format');
          return rawValue.toUpperCase();
        },
      },
    },
    {
      sequelize,
      tableName: 'movies',
      modelName: 'Movies',
    }
  );
  return Movies;
};
