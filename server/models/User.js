const { queryDB } = require('../config/database');



/**
 * Class User
 *
 * User, represents the user.
 *
 * @property {number} id - The unique identifier for the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The hashed password of the user.
 * @property {string} first_name - The first name of the user.
 * @property {string} last_name - The last name of the user.
 * @property {Date} birthday - The date of birth of the user.
 * @property {int} user_type - The user_type of the user.
 * @property {Date} created_at - Timestamp when the user type was created.
 * @property {Date} updated_at - Timestamp when the user type was last updated.
 * @property {Date|null} deleted_at - Timestamp when the user type was deleted, or null if active.
 */
const User = {

    /**
     * Get the user by id.
     * @param {int} userId - The id of the user.
     * @returns {object|null} The user record if found, else null.
     * @throws Will throw an error if an invalid user type is provided.
     */

    async get(userId){
        try{
            const query = 'SELECT * FROM users WHERE id = $1 LIMIT 1';
            const result = await queryDB(query, [userId]);
            return result.length > 0 ? result[0] : null;
        }catch (error){
            console.error('Error fetching user by id:', userId, error);
            throw error;
        }
    },

    /**
     * Create a new user.
     * @param {object} userData - The user data in object form to insert.
     * @param {string} userData.email - The email of the user.
     * @param {string} userData.password - The hashed password of the user.
     * @param {string} userData.first_name - The first name of the user.
     * @param {string} userData.last_name - The last name of the user.
     * @param {Date} userData.birthday - The date of birth of the user.
     * @param {int} userData.user_type - The user_type of the user.
     * @returns {object|null} - If successful return the user record else null.
     * @throws Will throw an error if there is an issue creating the user.
     */

    async create(userData) {
        const { email, password, first_name, last_name, birthday, user_type } = userData;
        const query = `
        INSERT INTO users (email, password, first_name, last_name, birthdate, user_type, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *;
        `;

        try {
            const rows = await queryDB(query, [email, password, first_name, last_name, birthday, user_type]);
            console.log('Rows from queryDB:', rows);  // Log the rows directly

            // Now `rows` is the array directly, so we check its length and return the first item
            if (rows.length > 0) {
                return rows[0];  // Return the first created user
            } else {
                return null;  // No rows returned
            }
        } catch (error) {
            // Catch unique constraint violation (duplicate email)
            if (error.code === '23505') {
                throw new Error('A user with this email already exists.');
            }
            console.error('Error creating user:', error);
            throw error;  // Rethrow the error
        }
    },

    async updateProficiencyLevel(currentName, newName){
        const sanitizedNewName = newName.trim();

        if (!sanitizedNewName || !sanitizedNewName.match(/^[a-zA-Z]+$/)) {
            throw new Error('Invalid proficiency level name. Only alphabetic characters are allowed.');
        }

        try {
            const existingProficiencyLevel = await ProficiencyLevel.get(currentName);

            if(!existingProficiencyLevel){
                throw new Error('Proficiency Level not found');
            }

            const updateQuery = 'UPDATE proficiency_levels SET name = $1, updated_at = NOW() WHERE name = $2';
            await queryDB(updateQuery, [sanitizedNewName, currentName]);

            console.log(`Proficiency Level updated from ${currentName} to ${newName}`);
        } catch (error){
            // changed this console.error('Error updating proficiency level:', error);

            // added throw
            throw error;
        }
    },

    /**
     * Update a user record by id.
     * @param {number} id - The unique id of the user.
     * @param {object} updatedData - The user data to update.
     * @param {string} [updatedData.email] - The updated email of the user.
     * @param {string} [updatedData.password] - The updated password of the user.
     * @param {string} [updatedData.first_name] - The updated first name of the user.
     * @param {string} [updatedData.last_name] - The updated last name of the user.
     * @param {Date} [updatedData.birthday] - The updated birth date of the user.
     * @param {int} [updatedData.user_type] - The updated user_type of the user.
     * @returns {object|null} The updated user record if successful, or null if no update was made.
     * @throws Will throw an error if there is an issue updating the user.
     */
    async update(id, updatedData) {
        const { email, password, first_name, last_name, birthday, user_type } = updatedData;

        const query = `
        UPDATE users 
        SET email = COALESCE($1, email),
            password = COALESCE($2, password),
            first_name = COALESCE($3, first_name),
            last_name = COALESCE($4, last_name),
            birthdate = COALESCE($5, birthdate),
            user_type = COALESCE($6, user_type),
            updated_at = NOW()
        WHERE id = $7
        RETURNING *;
        `;

        try {
            const rows = await queryDB(query, [email, password, first_name, last_name, birthday, user_type, id]);
            console.log('Rows from queryDB (update):', rows);  // Log the rows

            if (rows.length > 0) {
                return rows[0];  // Return the updated user record
            } else {
                return null;  // No rows returned, indicating no update was made
            }
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;  // Rethrow error for controller to handle
        }
    },

    async deleteUser(id) {
        try {
            // Check if the user exists
            const existingUser = await User.get(id);

            if (!existingUser) {
                throw new Error('User not found');
            }

            // Perform the soft delete by setting deleted_at to the now
            const softDeleteQuery = 'UPDATE users SET deleted_at = NOW() WHERE id = $1';
            await queryDB(softDeleteQuery, [id]);

            console.log(`User id '${id}' has been soft deleted.`);
            return { message: `User id '${id}' successfully deleted.` };
        } catch (error) {
            // changed this console.error('Error soft deleting user:', error);
            throw new Error('Failed to delete user');
        }
    },

    /**
     * Create a new user using a specific client in a transaction.
     * @param {object} client - The database client to use for the transaction.
     * @param {object} userData - The user data to insert.
     * @param {string} userData.email - The email of the user.
     * @param {string} userData.password - The hashed password of the user.
     * @param {string} userData.first_name - The first name of the user.
     * @param {string} userData.last_name - The last name of the user.
     * @param {Date} userData.birthday - The date of birth of the user.
     * @param {int} userData.user_type - The user_type of the user.
     * @returns {object|null} The created user record if successful, else null.
     * @throws Will throw an error if there is an issue creating the user.
     */
    async createUserWithClient(client, userData) {
        const { email, password, first_name, last_name, birthday, user_type } = userData;
        const query = `
      INSERT INTO users (email, password, first_name, last_name, birthdate, user_type, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *;
    `;

        try {
            const result = await client.query(query, [email, password, first_name, last_name, birthday, user_type]);
            return result.rows[0]; // Return the first created user record
        } catch (error) {
            // Handle unique constraint violations (duplicate email)
            if (error.code === '23505') {
                throw new Error('A user with this email already exists.');
            }
            console.error('Error creating user with client:', error);
            throw error; // Rethrow the error for the caller to handle
        }
    },
};

module.exports = User;