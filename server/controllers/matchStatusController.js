const MatchStatus = require('../models/MatchStatus');

/**
 * Get the match status by name.
 * @param {object} req - Express request object containing the match status name in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a response with the match status details or an error message.
 */
const getMatchStatusByName = async (req, res) => {
    try {
        const { name } = req.params;
        const matchStatus = await MatchStatus.get(name);

        if (!matchStatus) {
            return res.status(404).json({ message: 'Match status not found' });
        }

        return res.status(200).json(matchStatus);
    } catch (error) {
        console.error('Error fetching match status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Get the match status by id.
 * @param {object} req - Express request object containing the match status id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a response with the match status details or an error message.
 */
const getMatchStatusById = async (req, res) => {
    try {
        const { id } = req.params;
        const matchStatus = await MatchStatus.getMatchStatusById(id);

        if (!matchStatus) {
            return res.status(404).json({ message: 'Match status not found' });
        }

        return res.status(200).json(matchStatus);
    } catch (error) {
        console.error('Error fetching match status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Create a new match status.
 * @param {object} req - Express request object containing the match status name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const createMatchStatus = async (req, res) => {
    try {
        const { name } = req.body;

        // Ensure the match status name is provided
        if (!name) {
            return res.status(400).json({ message: 'Match status name is required' });
        }

        // Call the createMatchStatus method from the MatchStatus model
        await MatchStatus.createMatchStatus(name);

        return res.status(201).json({ message: `Match status '${name}' created successfully` });
    } catch (error) {
        console.error('Error creating match status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Update a match status by its name.
 * @param {object} req - Express request object containing the match status name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const updateMatchStatus = async(req, res) => {
    try {
        const { currentName, newName } = req.body;

        if (!currentName || !newName) {
            return res.status(400).json({ message: 'Current name and new name are required' });
        }

        await MatchStatus.updateMatchStatus(currentName, newName);
        return res.status(200).json({ message: `Match status updated from ${currentName} to ${newName}` });
    } catch (error) {
        console.error('Error updating match status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Delete a match status by its name.
 * @param {object} req - Express request object containing the match status name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const deleteMatchStatus = async(req, res) => {
    try{
        const { name } = req.params;

        //Soft delete match status
        const result = await MatchStatus.deleteMatchStatus(name);

        return res.status(200).json(result);
    } catch (error){
        console.error('Error soft deleting match status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getMatchStatusByName,
    getMatchStatusById,
    createMatchStatus,
    updateMatchStatus,
    deleteMatchStatus,
};