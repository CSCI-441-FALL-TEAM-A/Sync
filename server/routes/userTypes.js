const express = require('express');
const { getUserTypeByName, createUserType, updateUserType, deleteUserType} = require('../controllers/userTypeController');
const router = express.Router();

// Route to get user type by name
router.get('/:name', getUserTypeByName);
// Route to add user type by name
router.post('/', createUserType);
// Route to update user type by name
router.put('/', updateUserType);
// Route to soft delete user type by name
router.delete('/:name', deleteUserType);
module.exports = router;