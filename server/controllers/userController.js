const User = require('../models/User');
const bcrypt= require('bcrypt');
const UserResponse = require("../responses/UserResponse");


/**
 * Get the user by id.
 * @param {object} req - Express request object containing the user id in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a response with the user details or an error message.
 */

const getUserById = async(req, res) => {
    try{
        const { id } = req.params;
        const user = await User.get(id);

        if(!user){
            return res.status(404).json({ message: 'User not found'});
        }

        return res.status(200).json(user);
    }catch(error){
        console.log('Error fetch user:', error);
        return res.status(500).json({ message: 'Internal server error'});
    }
};

/**
 * Get the user by email.
 * @param {object} req - Express request object containing the user email in params.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a response with the user details or an error message.
 */

const getUserByEmail = async(req, res) => {
    try{
        const { email } = req.params;
        const user = await User.getUserByEmail(email);

        if(!user){
            return res.status(404).json({ message: 'User not found'});
        }

        return res.status(200).json(user);
    }catch(error){
        console.log('Error fetch user:', error);
        return res.status(500).json({ message: 'Internal server error'});
    }
};

/**
 * Create a new user.
 * @param {object} req - Express request object containing the user in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */

const createUser = async (req, res) => {
    try {
        const { email, password, first_name, last_name, birthday, user_type } = req.body;

        const newUser = await User.create({
            email,
            password,  //TODO: Ronnie, we have to actually hash this at some point.
            first_name,
            last_name,
            birthday,
            user_type
        });

        console.log('New user created:', newUser);

        if (newUser){
            res.status(201).json(newUser);
        } else{
            res.status(400).json({error: 'Failed to create user'});
        }
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
};

/**
 * Update an existing user by id.
 * @param {object} req - Express request object containing the user id and updated data in the body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} The function sends a success message or an error message.
 */
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;  // Extract user id from request params
        const updatedData = req.body;  // Extract updated user data from request body

        // Call the update method in the User model
        const updatedUser = await User.update(userId, updatedData);

        // If the update was successful, send the updated user data back
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            // If no user was found or no updates were made
            res.status(404).json({ error: 'User not found or no changes made' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteUser = async(req, res) => {
    try{
        const { id } = req.params;

        //Soft delete user
        const result = await User.deleteUser(id);

        return res.status(200).json(result);
    } catch (error){
        console.error('Error soft deleting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        //Make sure to check if the required fields are there.
        if (!email || !password){
            return res.status(400).json({message: 'Email AND password required'});
        }

        const user = await User.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        //Compare the user password to the stored password.
        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        //Send the user data back.
        const userResponse = UserResponse(user);

        //Send successful response back.
        res.status(201).json(userResponse);


    }catch (error){
        console.log('Error logging in user:', error);
        res.status(500).json({ message: 'Server error'});
    }
}

module.exports = {
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    getUserByEmail,
}