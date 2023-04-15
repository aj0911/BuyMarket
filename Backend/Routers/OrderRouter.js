const express = require('express');
const { addOrder, getOrders, getOrder, getOrdersForAdmin, updateOrderStatus, deleteOrder, postRazorpay } = require('../Controllers/OrderController');
const {isAuthenticated, authorizeRoles} = require('../Middlewares/auth.js')
const router = express.Router();

router.post('/order/new',isAuthenticated,addOrder);

router.get('/order/me',isAuthenticated,getOrders);

router.route('/admin/orders/:id').get(isAuthenticated,getOrder).put(isAuthenticated,authorizeRoles('admin'),updateOrderStatus).delete(isAuthenticated,authorizeRoles('admin'),deleteOrder);
router.route('/admin/orders').get(isAuthenticated,authorizeRoles('admin'),getOrdersForAdmin);

router.route('/payment').post(isAuthenticated,postRazorpay);
module.exports = router;