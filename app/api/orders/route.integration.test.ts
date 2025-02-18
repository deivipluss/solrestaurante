import request from 'supertest';
import app from '../app';

test('crea y recupera una orden', async () => {
  // Crear una nueva orden
  const newOrder = {
    name: 'Juan Pérez',
    phone: '123456789',
    cartItems: JSON.stringify([
      { name: 'Pizza', quantity: 1, price: 20 },
      { name: 'Lomo Saltado', quantity: 2, price: 30 },
    ]),
    receipt: new File(['dummy content'], 'receipt.jpg', { type: 'image/jpeg' }),
  };

  const formData = new FormData();
  formData.append('name', newOrder.name);
  formData.append('phone', newOrder.phone);
  formData.append('cartItems', newOrder.cartItems);
  formData.append('receipt', newOrder.receipt);

  const createResponse = await request(app)
    .post('/orders')
    .send(formData);
  expect(createResponse.status).toBe(201);
  const createdOrder = createResponse.body;

  // Recuperar la orden creada
  const getResponse = await request(app).get(`/orders/${createdOrder.id}`);
  expect(getResponse.status).toBe(200);
  expect(getResponse.body).toEqual(createdOrder);
});