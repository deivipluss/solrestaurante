import express from 'express';
import ordersRouter from './orders/route';

const app = express();
app.use(express.json());
app.use('/orders', ordersRouter);

export default app;