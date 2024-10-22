const express = require('express');
const { getInstrumentById, createInstrument, updateInstrument, deleteInstrument } = require('../controllers/instrumentController');


const router = express.Router();

//Route to get instrument by id
router.get('/:id',  getInstrumentById);
//Route to add instrument
router.post('/create', createInstrument);
//Route to update instrument by id.
router.put('/:id', updateInstrument);
//Route to soft delete instrument by id.
router.delete('/:id', deleteInstrument);

module.exports = router;