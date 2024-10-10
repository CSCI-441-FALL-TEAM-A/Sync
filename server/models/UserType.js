const { queryDB } = require('../config/database');

/**
 * Class UserType
 *
 * UserType represents the types of users in the system (e.g., 'Groupie', 'Musician', 'Admin').
 *
 * @property {number} id - The unique identifier for the user type.
 * @property {string} name - The name of the user type.
 * @property {Date} created_at - Timestamp when the user type was created.
 * @property {Date} updated_at - Timestamp when the user type was last updated.
 * @property {Date|null} deleted_at - Timestamp when the user type was deleted, or null if active.
 */

const UserType = {
    GROUPIE: 'Groupie',
    MUSICIAN: 'Musician',
    ADMIN: 'Admin',

    TYPES: ['Groupie', 'Musician', 'Admin'],

    /**
     * Get the user type by name.
     * @param {string} userTypeName - The name of the user type.
     * @returns {object|null} The user type record if found, otherwise null.
     * @throws Will throw an error if an invalid user type is provided.
     */
    async get(userTypeName) {
        try {
            const query = 'SELECT * FROM user_types WHERE name = $1 LIMIT 1';
            const result = await queryDB(query, [userTypeName]);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('Error fetching user type by name:', userTypeName);
            throw error;
        }
    },

    /**
     * Create a new user type.
     * @param {string} userTypeName - The name of the new user type.
     * @returns {void}
     * @throws Will throw an error if the user type already exists or if there is a database error.
     */
    async createUserType(userTypeName) {
        // Basic sanitization
        const sanitizedTypeName = userTypeName.trim();

        if (!sanitizedTypeName || !sanitizedTypeName.match(/^[a-zA-Z]+$/)) {
            throw new Error('Invalid user type name. Only alphabetic characters are allowed.');
        }

        try {
            // Check if the user type already exists
            const existingUserType = await this.get(sanitizedTypeName);

            if (existingUserType) {
                throw new Error('User type already exists');
            }

            // Parameterized query for insertion
            const insertQuery = 'INSERT INTO user_types (name, created_at, updated_at) VALUES ($1, NOW(), NOW())';
            await queryDB(insertQuery, [sanitizedTypeName]);

        } catch (error) {
            console.error('Error creating user type:', sanitizedTypeName);
            throw error;
        }
    },

    /**
     * Update an existing user type.
     * @param {string} currentName - The current name of the user type.
     * @param {string} newName - The new name of the user type.
     * @returns {void}
     * @throws Will throw an error if the uesr type does not exist or if there is a database error.
     */

    async updateUserType(currentName, newName){
        const sanitizedNewName = newName.trim();

        if (!sanitizedNewName || !sanitizedNewName.match(/^[a-zA-Z]+$/)) {
            throw new Error('Invalid user type name. Only alphabetic characters are allowed.');
        }

        try {
            const existingUserType = await UserType.get(currentName);

            if(!existingUserType){
                throw new Error('User type not found');
            }

            const updateQuery = 'UPDATE user_types SET name = $1, updated_at = NOW() WHERE name = $2';
            await queryDB(updateQuery, [sanitizedNewName, currentName]);

            console.log(`User type updated from ${currentName} to ${newName}`);
        } catch (error){
            console.error('Error updating user type:', error);
        }
    },

    async deleteUserType(name) {
        try {
            // Check if the user type exists
            const existingUserType = await UserType.get(name);

            if (!existingUserType) {
                throw new Error('User type not found');
            }

            // Perform the soft delete by setting deleted_at to the now
            const softDeleteQuery = 'UPDATE user_types SET deleted_at = NOW() WHERE name = $1';
            await queryDB(softDeleteQuery, [name]);

            console.log(`User type '${name}' has been soft deleted.`);
            return { message: `User type '${name}' successfully deleted.` };
        } catch (error) {
            console.error('Error soft deleting user type:', error);
            throw new Error('Failed to delete user type');
        }
    },
};

module.exports = UserType;