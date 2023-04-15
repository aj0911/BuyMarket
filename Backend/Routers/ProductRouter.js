const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProduct, saveReview,getAllReviews, deleteReview } = require('../Controllers/ProductController.js');
const { isAuthenticated,authorizeRoles } = require('../Middlewares/auth.js');

const router = express.Router();

router.get('/products',getAllProducts);
router.post('/admin/products/new',isAuthenticated,authorizeRoles('admin'),createProduct)

router.route('/admin/products/:id').put(isAuthenticated,authorizeRoles('admin'),updateProduct).delete(isAuthenticated,authorizeRoles('admin'),deleteProduct).get(isAuthenticated,getProduct)

//review

router.route('/review').put(isAuthenticated,saveReview);
router.route('/admin/review').delete(isAuthenticated,authorizeRoles('admin'),deleteReview)
router.route('/admin/review/:productId').get(isAuthenticated,authorizeRoles('admin'),getAllReviews)
module.exports = router;