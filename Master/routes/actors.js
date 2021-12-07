'use strict';
const express = require('express');
const { Actor } = require('../models');
const { authenticateToken } = require('../authentication');
let router = express.Router();

module.exports = router;

router.route('/:id').patch(authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  const actor = await Actor.findAll({
    where: { id },
  });
  if (actor.length === 0) {
    return res.status(404).json({ error: 'Actor with this id does not exist' });
  } else {
    try {
      const [updated] = await Actor.update(req.body, {
        where: { id },
      });
      if (updated) {
        const updatedPost = await Actor.findOne({
          where: { id },
        });
        return res.status(201).json({ post: updatedPost });
      }
      throw new Error('Post not found');
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
});
