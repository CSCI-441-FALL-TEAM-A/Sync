const express = require('express');
const { getLocationById, createLocation } = require('../controllers/locationController');
const router = express.Router();

//Route to get location by id
router.get('/:id',  getLocationById);
//Route to add location
router.post('/create', createLocation);

module.exports = router;