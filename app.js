const express = require('express');
const { connect: mongooseConnect, connection: mongooseConnection } = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/router');

const { PORT = 3000 } = process.env;
const app = express();

mongooseConnect('mongodb://localhost:27017/mestodb');
mongooseConnection.on('error', (err) => console.log(`Ошибка подключения к базе данных: ${err}`));
mongooseConnection.once('open', () => console.log('Подключение к базе данных установлено'));

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6486fbb7d9a4e3794867fab2',
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
