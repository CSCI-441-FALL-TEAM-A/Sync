const express = require('express');
const {getProfileById, createProfile, updateProfile, deleteProfile, getProfileByUserId, getAllProfiles} = require('../controllers/profileController');
const router = express.Router();

//Route to get profile by id
router.get('/:id', getProfileById);
//Route to get profile by user_id
router.get('/user/:user_id', getProfileByUserId);
// Route to get all profiles
router.get('/', getAllProfiles);
//Route to add profile
router.post('/', createProfile);
//Route to update profile
router.put('/:id', updateProfile);
//Route to soft delete profile
router.delete('/:id', deleteProfile);

module.exports = router;