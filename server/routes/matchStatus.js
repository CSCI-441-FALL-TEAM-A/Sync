const express = require('express');
const {getMatchStatusByName, getMatchStatusById, createMatchStatus, updateMatchStatus, deleteMatchStatus} = require('../controllers/matchStatusController');
const router = express.Router();

//Route to get genre by name
router.get('/name/:name', getMatchStatusByName);
//Route to get match status by id
router.get('/id/:id', getMatchStatusById);
//Route to add match status by name
router.post('/', createMatchStatus);
//Route to update match status by name
router.put('/', updateMatchStatus);
//Route to soft delete match status by name
router.delete('/:name', deleteMatchStatus);

module.exports = router;