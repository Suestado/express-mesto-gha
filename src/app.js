const express = require('express');
const bodyParser = require('body-parser');
const { PORT = 3000 } = process.env;
const { connect: mongooseConnect, connection } = require('mongoose');
const router = require('./routes/router.js');

const app = express();

//Подключение к БД
mongooseConnect('mongodb://localhost:27017/mestodb');
connection.on('error', err => console.log(`Ошибка подключения к базе данных: ${err}`));
connection.once('open', () => console.log('Подключение к базе данных установлено'));

app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

