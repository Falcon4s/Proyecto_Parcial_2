const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, processPurchase } = require('../controllers/productsControllers');

router.post('/create', protect, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.post('/purchase', protect, processPurchase); 

module.exports = router;
