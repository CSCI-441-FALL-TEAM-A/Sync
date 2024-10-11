const express = require('express');
const { getLocationById, createLocation, updateLocation, deleteLocation } = require('../controllers/locationController');
const router = express.Router();

//Route to get location by id
router.get('/:id',  getLocationById);
//Route to add location
router.post('/create', createLocation);
//Route to update location by id.
router.put('/:id', updateLocation);
//Route to soft delete location by id.
router.delete('/:id', deleteLocation);

module.exports = router;