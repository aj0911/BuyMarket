const express = require('express');
const { isAuthenticated, authorizeRoles } = require('../Middlewares/auth');
const { addContact, getAllContacts, deleteContact, getContact, replyMessage } = require('../Controllers/ContactController');

const router = express.Router();

router.post('/contact/new',isAuthenticated,addContact);
router.get('/contacts',isAuthenticated,authorizeRoles('admin'),getAllContacts);
router.delete('/admin/contacts/:id',isAuthenticated,authorizeRoles('admin'),deleteContact);
router.get('/admin/contacts/:id',isAuthenticated,authorizeRoles('admin'),getContact);
router.post('/admin/contacts/mail',isAuthenticated,authorizeRoles('admin'),replyMessage);


module.exports = router;