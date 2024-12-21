// server.js

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { authenticateUser } from './src/api/login/login.js';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from './src/api/customers/customers.js';
import { getSellers, addSeller, updateSeller, deleteSeller } from './src/api/sellers/sellers.js';
import { getOrders, addOrder, updateOrder, deleteOrder } from './src/api/orders/orders.js';
import { getProducts, addProduct, updateProduct, deleteProduct } from './src/api/products/products.js';
import {  getProductsOnOrder, addProductOnOrder,   updateProductOnOrder, deleteProductOnOrder } from './src/api/productOnOrder/productOnOrder.js';

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await authenticateUser(username, password);
    res.status(200).json({ message: 'Login successful', token: 'your-auth-token', user });
  } catch (error) {
    res.status(401).json({ message: 'Login failed', error: error.message });
  }
});

app.get('/api/customers', getCustomers);
app.post('/api/customers', addCustomer);
app.put('/api/customers/:Sifra_kupca', updateCustomer);
app.delete('/api/customers/:Sifra_kupca', deleteCustomer);


app.get('/api/sellers', getSellers);
app.post('/api/sellers', addSeller);
app.put('/api/sellers/:Sifra_prodavaca', updateSeller);
app.delete('/api/sellers/:Sifra_prodavaca', deleteSeller);


app.get('/api/orders', getOrders);
app.post('/api/orders', addOrder);
app.put('/api/orders/:Sifra_narudzbe', updateOrder);
app.delete('/api/orders/:Sifra_narudzbe', deleteOrder);

app.get('/api/products', getProducts);
app.post('/api/products', addProduct);
app.put('/api/products/:Sifra_proizvoda', updateProduct);
app.delete('/api/products/:Sifra_proizvoda', deleteProduct);

app.get('/api/productsOnOrder', getProductsOnOrder);
app.post('/api/productsOnOrder', addProductOnOrder);
app.put('/api/productsOnOrder/:OrderId/:ProductId', updateProductOnOrder);
app.delete('/api/productsOnOrder/:OrderId/:ProductId', deleteProductOnOrder);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});