const express = require('express');
const {getProficiencyLevelByName, createProficiencyLevel, updateProficiencyLevel, deleteProficiencyLevel} = require('../controllers/proficiencyLevelController');
const router = express.Router();

//Route to get proficiency level by name
router.get('/:name', getProficiencyLevelByName);
//Route to add proficiency level by name
router.post('/', createProficiencyLevel);
//Route to update proficiency level by name
router.put('/', updateProficiencyLevel);
//Route to soft delete proficiency level by name
router.delete('/:name', deleteProficiencyLevel);
module.exports = router;