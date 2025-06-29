const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const authMiddleware = require('../middleware/authMiddleware');
router.get('/v1/category/search', CategoryController.buscar);
router.get('/v1/category/:id', CategoryController.buscarPorId);
router.post('/v1/category', authMiddleware, CategoryController.criar);
router.put('/v1/category/:id', authMiddleware, CategoryController.atualizar);
router.delete('/v1/category/:id', authMiddleware, CategoryController.deletar);

module.exports = router;
