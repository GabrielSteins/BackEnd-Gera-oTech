const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
const UserController = require('../controllers/UserController');
router.get('/v1/user/:id', UserController.buscarPorId);
router.post('/v1/user', UserController.criar);
router.put('/v1/user/:id', authMiddleware, UserController.atualizar);
router.delete('/v1/user/:id', authMiddleware, UserController.deletar);

module.exports = router;
