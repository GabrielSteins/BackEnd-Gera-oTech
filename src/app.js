const express = require('express');
const app = express();
const userRoutes = require('./routes/UserRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const productRoutes = require('./routes/ProductRoutes');

app.use(express.json());

app.use(userRoutes);
app.use(categoryRoutes);
app.use(productRoutes);

module.exports = app;
