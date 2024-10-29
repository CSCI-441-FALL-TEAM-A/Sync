const Instrument = require('../models/Instrument');

/**
 * Get the instrument by id.
 * @param {object} req - Express request object containing the instrument ID in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a response with the instrument details or an error message.
 */

const getInstrumentById = async(req, res) => {
    try{
        const { id } = req.params;
        const instrument = await Instrument.get(id);

        if(!instrument){
            return res.status(404).json({ message: 'Instrument not found'});
        }

        return res.status(200).json(instrument);
    }catch(error){
        console.log('Error fetch instrument:', error);
        return res.status(500).json({ message: 'Internal server error'});
    }
};

const getAllInstruments = async (req, res) => {
    try {
        const instruments = await Instrument.getAllInstruments();
        res.status(200).json(instruments);
    } catch (error) {
        console.error('Error fetching all instruments:', error);
        res.status(500).json({ message: 'Server error, unable to fetch instruments' });
    }
};


/**
 * Create a new instrument.
 * @param {object} req - Express request object containing the instrument name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends the newly created instrument record or an error message.
 */
const createInstrument = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate that the instrument name is provided
        if (!name) {
            return res.status(400).json({ message: 'Instrument name is required' });
        }

        // Create the instrument using the Instrument model's create function
        const newInstrument = await Instrument.createInstrument(name);

        if (!newInstrument) {
            return res.status(500).json({ message: 'Error creating instrument' });
        }

        // Respond with the newly created instrument
        return res.status(201).json(newInstrument);
    } catch (error) {
        console.error('Error creating instrument:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Update an existing instrument's name.
 * @param {object} req - Express request object containing the instrument ID in params and the new name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends the updated instrument record or an error message.
 */
const updateInstrument = async (req, res) => {
    try {
        const { id } = req.params; // Get the instrument ID from the request parameters
        const { name } = req.body; // Get the new name from the request body

        // Validate that the new instrument name is provided
        if (!name) {
            return res.status(400).json({ message: 'Instrument name is required' });
        }

        // Update the instrument using the Instrument model's update function
        const updatedInstrument = await Instrument.updateInstrument(id, name);

        if (!updatedInstrument) {
            return res.status(404).json({ message: 'Instrument not found' });
        }

        // Respond with the updated instrument
        return res.status(200).json(updatedInstrument);
    } catch (error) {
        console.error('Error updating instrument:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Soft delete an instrument by setting the deleted_at timestamp.
 * @param {object} req - Express request object containing the instrument ID in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} Sends a success message or an error message.
 */
const deleteInstrument = async (req, res) => {
    try {
        const { id } = req.params; // Get the instrument ID from the request parameters

        // Soft delete the instrument using the Instrument model's delete function
        const deletedInstrument = await Instrument.deleteInstrument(id);

        if (!deletedInstrument) {
            return res.status(404).json({ message: 'Instrument not found or already deleted' });
        }

        // Respond with success message
        return res.status(200).json({ message: 'Instrument soft deleted successfully', deletedInstrument });
    } catch (error) {
        console.error('Error soft deleting instrument:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getInstrumentById,
    getAllInstruments,
    createInstrument,
    updateInstrument,
    deleteInstrument,
}