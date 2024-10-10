const Location = require('../models/Location');

/**
 * Get the location by id.
 * @param {object} req - Express request object containing the location id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a response with the location details or an error message.
 */

const getLocationById = async(req, res) => {
    try{
        const { id } = req.params;
        const location = await Location.get(id);

        if(!location){
            return res.status(404).json({ message: 'Location not found'});
        }

        return res.status(200).json(location);
    }catch(error){
        console.log('Error fetch location:', error);
        return res.status(500).json({ message: 'Internal server error'});
    }
};

const createLocation = async(req, res) => {
    try {
        const { city, state } = req.body;

        // Check to see if city and state were provided.
        if(!city || !state){
            return res.status(400).json({ message: 'City and State are required'});
        }

        await Location.createLocation(city, state);

        return res.status(201).json({ message: 'Location created successfully'});
    }catch (error){
        console.error('Error creating location:', error);
        return res.status(500).json({ message: 'Internal server error'});
    }
}

module.exports = {
    getLocationById,
    createLocation,
}