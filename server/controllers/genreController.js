const Genre = require('../models/genre');
const ProficiencyLevel = require("../models/ProficiencyLevel");

/**
 * Get the genre by name.
 * @param {object} req - Express request object containing the genre name in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a response with the genre details or an error message.
 */

const getGenreByName = async(req, res) => {
    try {
        const { name } = req.params;
        const genre = await Genre.get(name);

        if (!genre) {
            return res.status(404).json({ message: 'Genre not found' });
        }

        return res.status(200).json(genre);
    } catch (error) {
        console.error('Error fetching genre:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


//TODO: Ronnie, need to get by id as well, this is IMPORTANT

/**
 * Create a new genre.
 * @param {object} req - Express request object containing the genre name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const createGenre = async (req, res) => {
    try {
        const { name } = req.body;

        // Ensure the genre name is provided
        if (!name) {
            return res.status(400).json({ message: 'Genre name is required' });
        }

        // Call the createProficiencyLevel method from the ProficiencyLevel model
        await Genre.createGenre(name);

        return res.status(201).json({ message: 'Genre created successfully' });
    } catch (error) {
        console.error('Error creating genre:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Update a genre by its name.
 * @param {object} req - Express request object containing the genre name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const updateGenre = async(req, res) => {
    try {
        const { currentName, newName } = req.body;

        if (!currentName || !newName) {
            return res.status(400).json({ message: 'Current name and new name are required' });
        }

        await Genre.updateGenre(currentName, newName);
        return res.status(200).json({ message: `Genre updated from ${currentName} to ${newName}` });
    } catch (error) {
        console.error('Error updating genre:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Delete a genre by its name.
 * @param {object} req - Express request object containing the genre name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const deleteGenre = async (req, res) => {
    try {
        const { name } = req.params;

        // Soft delete genre
        const result = await Genre.deleteGenre(name);

        if (!result) {
            return res.status(404).json({ message: 'Genre not found' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error soft deleting genre:', error.message, error.stack); // Add more detailed error logging
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getGenreByName,
    createGenre,
    updateGenre,
    deleteGenre
}