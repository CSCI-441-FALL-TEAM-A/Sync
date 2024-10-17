const express = require('express');
const {getGenreByName, createGenre, updateGenre, deleteGenre} = require('../controllers/genreController');
const router = express.Router();

//Route to get genre by name
router.get('/:name', getGenreByName);
//Route to add genre by name
router.post('/', createGenre);
//Route to update genre by name
router.put('/', updateGenre);
//Route to soft delete genre by name
router.delete('/:name', deleteGenre);

module.exports = router;