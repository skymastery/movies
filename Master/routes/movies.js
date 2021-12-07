'use strict';
const express = require('express');
const { Movies, Actor, ActorsInMovies } = require('../models');
const { Op } = require('sequelize');
const { authenticateToken } = require('../authentication');
let router = express.Router();
const txtParser = require('../parser/parser');

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'movies.txt');
  },
});

var upload = multer({ storage: storage });

module.exports = router;

router
  .route('')
  .get(authenticateToken, async (req, res) => {
    try {
      const {
        search,
        title,
        actor,
        sort,
        order,
        limit,
        offset = 0,
      } = req.query;

      const props = {};
      const actorProps = {};

      if (title) props.title = { [Op.like]: `%${title}%` };
      if (actor) actorProps.name = { [Op.like]: `%${actor}%` };

      const movies = await Movies.findAll({
        where: {
          ...props,
        },
        include: {
          model: Actor,
          as: 'actors',
          where: {
            ...actorProps,
          },
        },
        order: [[sort || 'id', order || 'ASC']],
        limit: +limit || 20,
        offset: +offset,
      });

      return res.status(200).json(movies);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  })
  .post(authenticateToken, async (req, res) => {
    try {
      const { title, format, year, actors } = req.body;
      const checkMovie = await Movies.findAll({
        where: {
          title: req.body.title,
          format: req.body.format,
          year: req.body.year,
        },
      });
      if (checkMovie.length != 0) {
        return res.status(400).send({ msg: 'This movie already exists' });
      }
      const movie = await Movies.create({ title, format, year });

      for (const actorName of actors) {
        let actor = null;
        actor = await Actor.findOne({
          where: {
            name: actorName,
          },
        });
        if (!actor) {
          actor = await Actor.create({ name: actorName });
        }

        await ActorsInMovies.create({ actorsId: actor.id, moviesId: movie.id });
      }

      return res.status(200).json('Info succesfully added to database.');
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  });

// movie by id
router
  .route('/:id')
  .get(authenticateToken, async (req, res) => {
    const id = req.params.id;
    try {
      const movie = await Movies.findAll({
        where: { id },
        include: { model: Actor, as: 'actors' },
      });
      if (movie.length === 0) {
        return res
          .status(404)
          .json({ error: 'Movie with this id does not exist' });
      } else {
        return res.status(200).json(movie);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  })
  .delete(authenticateToken, async (req, res) => {
    const id = req.params.id;
    try {
      const movie = await Movies.findOne({
        where: { id },
      });
      await movie.destroy();

      return res.status(200).json({ message: 'Movie deleted' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  })
  .patch(authenticateToken, async (req, res) => {
    const id = req.params.id;
    const { title, year, format } = req.body;
    const movie = await Movies.findAll({
      where: { id },
    });
    if (movie.length === 0) {
      return res
        .status(404)
        .json({ error: 'Movie with this id does not exist' });
    } else {
      try {
        const [updated] = await Movies.update(req.body, {
          where: { id },
        });
        if (updated) {
          const updatedPost = await Movies.findOne({
            where: { id },
            include: { model: Actor, as: 'actors' },
          });
          return res.status(200).json({ post: updatedPost });
        }
        throw new Error('Post not found');
      } catch (error) {
        return res.status(500).send(error.message);
      }
    }
  });

router
  .route('/import')
  .post(authenticateToken, upload.single('movies'), function (req, res, next) {
    txtParser(__dirname + '/../uploads/movies.txt').then(async (file) => {
      for (const movie of file) {
        const [year] = movie['Release Year'];
        const [title] = movie.Title;
        const [format] = movie.Format;
        const stars = movie.Stars;

        const isExistMovie = await Movies.findOne({
          where: {
            title,
            format,
            year,
          },
        });

        if (!isExistMovie) {
          const movie = await Movies.create({ title, format, year });

          for (const actorName of stars) {
            let actor = null;
            actor = await Actor.findOne({
              where: {
                name: actorName,
              },
            });
            if (!actor) {
              actor = await Actor.create({ name: actorName });
            }
            await ActorsInMovies.create({
              actorsId: actor.id,
              moviesId: movie.id,
            });
          }
        }
      }
      res.status(200).send({ msg: 'Movies added succesfully' });
    });
  });
