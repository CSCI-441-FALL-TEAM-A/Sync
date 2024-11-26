const express = require('express');
const { getMatchById, createMatch, updateMatch, deleteMatch, getAllMatches } = require('../controllers/matchController');

const router = express.Router();

// Route to get all matches
router.get('/', getAllMatches);

//Route to get match by id
router.get('/:id',  getMatchById);

//Route to add match
router.post('/create', createMatch);

//Route to update match by id.
router.put('/:id', updateMatch);

//Route to soft delete match by id.
router.delete('/:id', deleteMatch);

module.exports = router;