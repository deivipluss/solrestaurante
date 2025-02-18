const express = require('express');
const ordersRouter = require('./orders/route');

const app = express();
app.use(express.json());
app.use('/orders', ordersRouter);

module.exports = app;