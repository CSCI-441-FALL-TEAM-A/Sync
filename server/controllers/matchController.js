const Match = require('../models/Match');

/**
 * Get the match by id.
 * @param {object} req - Express request object containing the match id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a response with the match details or an error message.
 */

const getMatchById = async(req, res) => {
    try{
        const { id } = req.params;
        const match = await Match.get(id);

        if(!match){
            return res.status(404).json({ message: 'Match not found'});
        }

        return res.status(200).json(match);
    }catch(error){
        console.log('Error fetch match:', error);
        return res.status(500).json({ message: 'Internal server error'});
    }
};

/**
 * Create a new match.
 * @param {object} req - Express request object containing the match details in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends the newly created match record or an error message.
 */
const createMatch = async (req, res) => {
    try {
        const { user_id_one, user_id_two, status } = req.body;

        // Ensure required fields are provided
        if (!user_id_one || !user_id_two) {
            return res.status(400).json({ message: 'Missing required fields: user_id_one, user_id_two' });
        }

        // Create the match
        const newMatch = await Match.createMatch(user_id_one, user_id_two, status);

        // If creation failed, return an error
        if (!newMatch) {
            return res.status(500).json({ message: 'Failed to create match' });
        }

        // Return the newly created match
        return res.status(201).json(newMatch);
    } catch (error) {
        console.error('Error creating match:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Update an existing match.
 * @param {object} req - Express request object containing the match id in params and the updates in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends the updated match record or an error message.
 */
const updateMatch = async (req, res) => {
    try {
        const { id } = req.params; //Match ID from the URL
        const updates = req.body; //Updated fields from request body

        const updatedMatch = await Match.updateMatch(id, updates);

        if(!updatedMatch){
            return res.status(404).json({ message: 'Match not found or no updates provided' });
        }

        return res.status(200).json(updatedMatch);
    } catch (error) {
        console.error('Error updating match:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Soft delete a match by setting the deleted_at timestamp.
 * @param {object} req - Express request object containing the match id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends a success message or an error message.
 */
const deleteMatch = async(req, res) => {
    try{
        const { id } = req.params;

        //Soft delete location
        const result = await Match.deleteMatch(id);

        return res.status(200).json(result);
    } catch (error){
        console.error('Error soft deleting match:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllMatches = async (req, res) => {
    try {
        const matches = await Match.getAll();

        // If no matches found, return a 404
        if (!matches || matches.length === 0) {
            return res.status(404).json({ message: 'No matches found' });
        }

        return res.status(200).json(matches);
    }catch(error){
        console.log('Error fetch matches:', error);
        return res.status(500).json({ message: 'Internal server error'});
    }
};

module.exports = {
    getMatchById,
    getAllMatches,
    createMatch,
    updateMatch,
    deleteMatch,
}