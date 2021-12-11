const express = require('express');
const { sequelize } = require('./models');
const movies1 = require('./routes/movies');
const actors1 = require('./routes/actors');
const users = require('./routes/users');

const app = express();

app.use(express.json());
app.use('/movies', movies1);
app.use('/actors', actors1);
app.use('/users', users);
app.use(function (req, res, next) {
  res.status(404).json({ error: '404 - wrong URL' });
});

app.listen({ port: 8000 }, async () => {
  console.log('Server up on http://localhost:5000');
  await sequelize.sync();
  console.log('Database connected');
});
