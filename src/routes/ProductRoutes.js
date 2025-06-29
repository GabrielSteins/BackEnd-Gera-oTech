const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const authMiddleware = require('../middleware/authMiddleware');
router.get('/v1/product/search', ProductController.buscar);
router.get('/v1/product/:id', ProductController.buscarPorId);
router.post('/v1/product', authMiddleware, ProductController.criar);
router.put('/v1/product/:id', authMiddleware, ProductController.atualizar);
router.delete('/v1/product/:id', authMiddleware, ProductController.deletar);

module.exports = router;
