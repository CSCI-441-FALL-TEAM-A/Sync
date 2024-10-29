const Profile = require('../models/Profile');
const ProfileResponse = require("../responses/ProfileResponse");

const Genre = require("../models/genre");  
const ProficiencyLevel = require("../models/proficiencyLevel");
const Instrument = require("../models/Instrument");


const getProfileById = async(req, res) => {
    try{
        const { id } = req.params;
        const profile = await Profile.get(id);

        if(!profile){
            return res.status(404).json({ message: 'Profile not found'});
        }

        // Fetch the genre names based on the genre IDs in the profile
        const genreMapping = await Genre.getGenresByIds(profile.genres);

        // Map genre IDs to names in the profile
        profile.genres = profile.genres.map(genreId => ({
            id: genreId,
            name: genreMapping[genreId] || 'Unknown'
        }));

        // Fetch the instrument names based on the instrument IDs in the profile
        const instrumentMapping = await Instrument.getInstrumentsByIds(profile.instruments);
        profile.instruments = profile.instruments.map(instrumentId => ({
            id: instrumentId,
            name: instrumentMapping[instrumentId] || 'Unknown'
        }));

        // Fetch the proficiency level name based on the profile's proficiency_level
        profile.proficiency_level = await ProficiencyLevel.getProficiencyById(profile.proficiency_level);

        const user_type = req?.user?.user_type;
        const response = ProfileResponse(profile, user_type);
        return res.status(200).json(response);
    }catch(error){
        console.log('Error fetch profile:', error);
        return res.status(500).json({ message: 'Internal server error'});
    }
};

/**
 * Controller function to handle creating a profile.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const createProfile = async (req, res) => {
    try {
        const { user_id, gender, instruments, proficiency_level, genres } = req.body;

        // Call the Profile.create method to insert a new profile
        const newProfile = await Profile.create({
            user_id,
            gender,
            instruments,
            proficiency_level,
            genres
        });

        if (newProfile) {
            res.status(201).json(newProfile);  // Send the created profile as a response
        } else {
            res.status(400).json({ error: 'Failed to create profile' });
        }
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * Update an existing profile by id.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const updateProfile = async (req, res) => {
    try {
        const profileId = req.params.id;
        const updatedData = req.body;

        // Call the Profile.update method to update the profile
        const updatedProfile = await Profile.update(profileId, updatedData);

        if (updatedProfile) {
            res.status(200).json(updatedProfile);
        } else {
            res.status(404).json({ error: 'Profile not found or no changes made' });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteProfile = async(req, res) => {
    try{
        const { id } = req.params;

        //Soft delete profile
        const result = await Profile.deleteProfile(id);

        return res.status(200).json(result);
    } catch (error){
        console.error('Error soft deleting profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
}