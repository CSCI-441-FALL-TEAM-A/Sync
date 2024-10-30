const { queryDB } = require('../config/database');

/**
 * Class Profile
 *
 * Profile represents the profile of a user.
 *
 * @property {number} id - The unique identifier for the profile.
 * @property {number} user_id - The unique identifier of the user.
 * @property {string} gender - The gender of the user.
 * @property {array} instruments - An array of instruments the user plays or enjoys.
 * @property {number} proficiency_level -The proficiency level of the user.
 * @property {array} genres -An array of genres the user enjoys.
 * @property {Date} created_at - Timestamp when the user type was created.
 * @property {Date} updated_at - Timestamp when the user type was last updated.
 * @property {Date|null} deleted_at - Timestamp when the user type was deleted, or null if active.
 * @property {text} bio - Biographical information of the user.
 */

const Profile = {
    /**
     * Get the profile by id.
     *     * @param {int} profileId - The id of the profile.
     *      * @returns {object|null} The profile record if found, else null.
     *      * @throws Will throw an error if an invalid user type is provided.
     *      */
    async get(profileId){
        try{
            const query = `
        SELECT 
            profiles.*,
            users.first_name,
            users.last_name
        FROM profiles
        JOIN users ON profiles.user_id = users.id
        WHERE profiles.id = $1
        LIMIT 1;
        `;
            const result = await queryDB(query, [profileId]);
            return result.length > 0 ? result[0] : null;
        }catch (error){
            console.error('Error fetching profile by id:', profileId, error);
            throw error;
        }
    },

    async getProfileByUserId(user_id){
        try{
            const query = `
        SELECT 
            profiles.*,
            users.first_name,
            users.last_name
        FROM profiles
        JOIN users ON profiles.user_id = users.id
        WHERE profiles.user_id = $1
        LIMIT 1;
        `;
            const result = await queryDB(query, [user_id]);
            return result.length > 0 ? result[0] : null;
        }catch (error){
            console.error('Error fetching profile by id:', user_id, error);
            throw error;
        }
    },

    async getAll() {
        try {
            const query = `
                SELECT 
                    profiles.*, 
                    users.first_name, 
                    users.last_name 
                FROM profiles 
                JOIN users ON profiles.user_id = users.id
                WHERE profiles.deleted_at IS NULL;
            `;
            const result = await queryDB(query);
            return result;
        } catch (error) {
            console.error('Error fetching all profiles:', error);
            throw error;
        }
    },

    /**
     * Create a new profile.
     * @param {object} profileData - The profile data to insert.
     * @param {number} profileData.user_id - The ID of the user.
     * @param {string} profileData.gender - The gender of the user.
     * @param {array} profileData.instruments - An array of instrument IDs.
     * @param {number} profileData.proficiency_level - The proficiency level of the user.
     * @param {array} profileData.genres - An array of genre IDs.
     * @param {text} bio - Biographical information of the user.
     * @returns {object|null} The newly created profile record, or null if the insert failed.
     * @throws Will throw an error if the insertion fails.
     */
    async create(profileData) {
        const { user_id, gender, instruments, proficiency_level, genres, bio } = profileData;
        const query = `
        INSERT INTO profiles (user_id, gender, instruments, proficiency_level, genres, bio, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *;
        `;

        try {
            // Execute the query and insert the new profile
            const rows = await queryDB(query, [user_id, gender, instruments, proficiency_level, genres, bio]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error creating profile:', error);
            throw error;
        }
    },

    /**
     * Update an existing profile by id.
     * @param {number} profileId - The unique id of the profile to update.
     * @param {object} updatedData - The profile data to update.
     * @param {string} [updatedData.gender] - The updated gender of the user.
     * @param {array} [updatedData.instruments] - The updated array of instruments.
     * @param {number} [updatedData.proficiency_level] - The updated proficiency level.
     * @param {array} [updatedData.genres] - The updated array of genres.
     * @param {text} bio - Biographical information of the user.
     * @returns {object|null} The updated profile record if successful, or null if no profile was updated.
     * @throws Will throw an error if there is an issue updating the profile.
     */
    async update(profileId, updatedData) {
        const { gender, instruments, proficiency_level, genres, bio } = updatedData;
        const query = `
        UPDATE profiles
        SET gender = COALESCE($1, gender),
            instruments = COALESCE($2, instruments),
            proficiency_level = COALESCE($3, proficiency_level),
            genres = COALESCE($4, genres),
            bio = COALESCE($5, bio),
            updated_at = NOW()
        WHERE id = $6
        RETURNING *;
        `;

        try {
            const rows = await queryDB(query, [gender, instruments, proficiency_level, genres, bio, profileId]);
            return rows.length > 0 ? rows[0] : null;  // Return the updated profile or null
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    async deleteProfile(id) {
        try {
            // Check if the profile exists
            const existingProfile = await Profile.get(id);

            if (!existingProfile) {
                throw new Error('Profile not found');
            }

            // Perform the soft delete by setting deleted_at to the now
            const softDeleteQuery = 'UPDATE profiles SET deleted_at = NOW() WHERE id = $1';
            await queryDB(softDeleteQuery, [id]);

            console.log(`Profile id '${id}' has been soft deleted.`);
            return { message: `Profile id '${id}' successfully deleted.` };
        } catch (error) {
            // changed this console.error('Error soft deleting Profile:', error);
            throw new Error('Failed to delete profile');
        }
    },

    /**
     * Create a new profile using a specific client in a transaction.
     * @param {object} client - The database client to use for the transaction.
     * @param {object} profileData - The profile data to insert.
     * @param {number} profileData.user_id - The ID of the user.
     * @param {string} profileData.gender - The gender of the user.
     * @param {array} profileData.instruments - An array of instrument IDs.
     * @param {number} profileData.proficiency_level - The proficiency level of the user.
     * @param {array} profileData.genres - An array of genre IDs.
     * @param {text} profileData.bio - Biographical info of the creator.
     * @returns {object|null} The newly created profile record, or null if the insert failed.
     * @throws Will throw an error if the insertion fails.
     */
    async createProfileWithClient(client, profileData) {
        const { user_id, gender, instruments, proficiency_level, genres, bio } = profileData;
        const query = `
        INSERT INTO profiles (user_id, gender, instruments, proficiency_level, genres, bio, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6 NOW(), NOW())
        RETURNING *;
        `;

        try {
            const result = await client.query(query, [user_id, gender, instruments, proficiency_level, genres, bio]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error creating profile with client:', error);
            throw error;
        }
    },
};

module.exports = Profile;