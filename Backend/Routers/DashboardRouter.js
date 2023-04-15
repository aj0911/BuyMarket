const express = require('express');
const { isAuthenticated, authorizeRoles } = require('../Middlewares/auth');
const { showOnDashboard, delivery, stats } = require('../Controllers/DashboardController');

const router = express.Router();

router.get('/admin',isAuthenticated,authorizeRoles('admin'),showOnDashboard);
router.get('/admin/delivery',isAuthenticated,authorizeRoles('admin'),delivery);
router.get('/admin/stats',isAuthenticated,authorizeRoles('admin'),stats);

module.exports = router;