const express = require('express');
const {getUserById, createUser, updateUser, deleteUser, loginUser} = require('../controllers/userController');
const router = express.Router();

//Route to get user by id
router.get('/:id',  getUserById);
//Route to add user
router.post('/', createUser);
//Router to update user by id
router.put('/:id', updateUser);
//Route to soft delete user by id
router.delete('/:id', deleteUser);


router.post('/login', loginUser);

module.exports = router;