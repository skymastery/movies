'use strict';
const express = require('express');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let router = express.Router();

const app = express();

module.exports = router;

router.route('').post(async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const userExists = await User.findOne({
      where: { email },
    });

    if (userExists === null && password === confirmPassword) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        email: req.body.email,
        password: hashedPassword,
      });

      return res.status(201).send(user);
    } else if (
      req.body.confirmPassword == null ||
      password !== confirmPassword
    ) {
      res.send({
        msg: 'You must confirm your password by adding a "confirmPassword: YOURPASSWORD" line to in your request body',
      });
    } else if (userExists !== null) {
      res.send({ msg: 'User with this email is already registered' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Something went wrong' });
  }
});

router.route('/login').post(async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
    if (user == null) {
      return res.status(400).send({ message: 'Cannot find user' });
    } else if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).json({ accessToken: accessToken });
    } else {
      res.status(400).send({ error: 'Wrong password' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong' });
  }
});
