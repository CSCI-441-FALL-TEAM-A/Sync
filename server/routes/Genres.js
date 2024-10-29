const express = require('express');
const {getGenreByName, getGenreById, createGenre, updateGenre, deleteGenre, getAllGenres} = require('../controllers/genreController');
const router = express.Router();

//Route to get genre by name
router.get('/name/:name', getGenreByName);
//Route to get genre by id
router.get('/id/:id', getGenreById);
// Route to get all genres
router.get('/', getAllGenres);
//Route to add genre by name
router.post('/', createGenre);
//Route to update genre by name
router.put('/', updateGenre);
//Route to soft delete genre by name
router.delete('/:name', deleteGenre);

module.exports = router;