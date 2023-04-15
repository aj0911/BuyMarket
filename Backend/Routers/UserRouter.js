const express = require('express');
const { register, login, logout, resetPassword, forgetPassword, getUser, changePassword, updateProfile, getAllUsers, updateUserRole, getUserAdmin,deleteUser } = require('../Controllers/UserController');
const { isAuthenticated,authorizeRoles } = require('../Middlewares/auth');

const router = express.Router();

router.post('/register',register).post('/login',login);
router.get('/logout',isAuthenticated,logout).post('/password/reset',resetPassword);
router.put('/password/reset/:token',forgetPassword);

router.get('/me',isAuthenticated,getUser).put('/me/changePassword',isAuthenticated,changePassword).put('/me',isAuthenticated,updateProfile);

// Admin Api Routes
router.get('/admin/users',isAuthenticated,authorizeRoles('admin'),getAllUsers);

router.route('/admin/users/:id').put(isAuthenticated,authorizeRoles('admin'), updateUserRole).get(isAuthenticated,isAuthenticated,getUserAdmin).delete(isAuthenticated,authorizeRoles('admin'),deleteUser)
module.exports = router;