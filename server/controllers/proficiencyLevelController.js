const ProficiencyLevel = require('../models/proficiencyLevel');



/**
 * Get the proficiency level by name.
 * @param {object} req - Express request object containing the proficiency level name in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a response with the proficiency level details or an error message.
 */

const getProficiencyLevelByName = async(req, res) => {
    try {
        const { name } = req.params;
        const proficiencyLevel = await ProficiencyLevel.get(name);

        if (!proficiencyLevel) {
            return res.status(404).json({ message: 'Proficiency level not found' });
        }

        return res.status(200).json(proficiencyLevel);
    } catch (error) {
        console.error('Error fetching proficiency level:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


/**
 * Get the proficiency level by id.
 * @param {object} req - Express request object containing the proficiency level id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a response with the proficiency level details or an error message.
 */

const getProficiencyLevelById = async(req, res) => {
    try {
        const { id } = req.params;
        const proficiencyLevel = await ProficiencyLevel.getProficiencyById(id);

        if (!proficiencyLevel) {
            return res.status(404).json({ message: 'Proficiency level not found' });
        }

        return res.status(200).json(proficiencyLevel);
    } catch (error) {
        console.error('Error fetching proficiency level:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Create a new proficiency level.
 * @param {object} req - Express request object containing the proficiency level name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const createProficiencyLevel = async (req, res) => {
    try {
        const { name } = req.body;

        // Ensure the proficiency level name is provided
        if (!name) {
            return res.status(400).json({ message: 'Proficiency level name is required' });
        }

        // Call the createProficiencyLevel method from the ProficiencyLevel model
        await ProficiencyLevel.createProficiencyLevel(name);

        return res.status(201).json({ message: 'Proficiency level created successfully' });
    } catch (error) {
        console.error('Error creating proficiency level:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Update a proficiency level by its name.
 * @param {object} req - Express request object containing the proficiency level name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const updateProficiencyLevel = async(req, res) => {
    try {
        const { currentName, newName } = req.body;

        if (!currentName || !newName) {
            return res.status(400).json({ message: 'Current name and new name are required' });
        }

        await ProficiencyLevel.updateProficiencyLevel(currentName, newName);
        return res.status(200).json({ message: `Proficiency level updated from ${currentName} to ${newName}` });
    } catch (error) {
        console.error('Error updating proficiency level:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Delete a proficiency level by its name.
 * @param {object} req - Express request object containing the proficiency level name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const deleteProficiencyLevel = async (req, res) => {
    try {
        const { name } = req.params;

        // Soft delete proficiency level
        const result = await ProficiencyLevel.deleteProficiencyLevel(name);

        if (!result) {
            return res.status(404).json({ message: 'Proficiency level not found' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error soft deleting proficiency level:', error.message, error.stack); // Add more detailed error logging
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getProficiencyLevelByName,
    getProficiencyLevelById,
    createProficiencyLevel,
    updateProficiencyLevel,
    deleteProficiencyLevel,
}
