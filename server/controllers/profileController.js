const Profile = require('../models/profile');

const getProfileById = async(req, res) => {
    try{
        const { id } = req.params;
        const profile = await Profile.get(id);

        if(!profile){
            return res.status(404).json({ message: 'Profile not found'});
        }

        return res.status(200).json(profile);
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