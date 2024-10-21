const UserType = require('../models/UserType');

/**
 * Get the user type by name.
 * @param {object} req - Express request object containing the user type name in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a response with the user type details or an error message.
 */
const getUserTypeByName = async (req, res) => {
    try {
        const { name } = req.params;
        const userType = await UserType.get(name);

        if (!userType) {
            return res.status(404).json({ message: 'User type not found' });
        }

        return res.status(200).json(userType);
    } catch (error) {
        console.error('Error fetching user type:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Get the user type by id.
 * @param {object} req - Express request object containing the user type id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a response with the user type details or an error message.
 */
const getUserTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const userType = await UserType.getUserTypeById(id);

        if (!userType) {
            return res.status(404).json({ message: 'User type not found' });
        }

        return res.status(200).json(userType);
    } catch (error) {
        console.error('Error fetching user type:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Create a new user type.
 * @param {object} req - Express request object containing the user type name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const createUserType = async (req, res) => {
    try {
        const { name } = req.body;

        // Ensure the user type name is provided
        if (!name) {
            return res.status(400).json({ message: 'User type name is required' });
        }

        // Call the createUserType method from the UserType model
        await UserType.createUserType(name);

        return res.status(201).json({ message: 'User type created successfully' });
    } catch (error) {
        console.error('Error creating user type:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Update a user type by its name.
 * @param {object} req - Express request object containing the user type name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const updateUserType = async(req, res) => {
    try {
        const { currentName, newName } = req.body;

        if (!currentName || !newName) {
            return res.status(400).json({ message: 'Current name and new name are required' });
        }

        await UserType.updateUserType(currentName, newName);
        return res.status(200).json({ message: `User type updated from ${currentName} to ${newName}` });
    } catch (error) {
        console.error('Error updating user type:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Delete a user type by its name.
 * @param {object} req - Express request object containing the user type name in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const deleteUserType = async(req, res) => {
  try{
      const { name } = req.params;

      //Soft delete user type
      const result = await UserType.deleteUserType(name);

      return res.status(200).json(result);
  } catch (error){
      console.error('Error soft deleting user type:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
    getUserTypeByName,
    getUserTypeById,
    createUserType,
    updateUserType,
    deleteUserType,
};