const { queryDB } = require('../config/database');

/**
 * Class Match
 *
 * Match represents the users match or search preferences.
 *
 * @property {number} id - The unique identifier for the match.
 * @property {number} user_id_one - The unique identifier for the first user in the match.
 * @property {number} user_id_two - The unique identifier for the second user in the match.
 * @property {number} status - The status of the match.
 * @property {Date} created_at - Timestamp when the user type was created.
 * @property {Date} updated_at - Timestamp when the user type was last updated.
 * @property {Date|null} deleted_at - Timestamp when the user type was deleted, or null if active.
 */

const Match = {

    /**
     * Get the match by id.
     * @param {int} matchId - The id of the match.
     * @returns {object|null} The match record if found, else null.
     * @throws Will throw an error if an invalid match is provided.
     */
    async get(matchId){
        try{
            const query = 'SELECT * FROM matches WHERE id = $1 LIMIT 1';
            const result = await queryDB(query, [matchId]);
            return result.length > 0 ? result[0] : null;
        }catch (error){
            console.error('Error fetching match by id:', matchId, error);
            throw error;
        }
    },

    /**
     * Get all matches.
     * @returns {object|null} The matches record if found, else null.
     * @throws Will throw an error if an invalid match is provided.
     */
    async getAll(){
        try{
            const query = 'SELECT * FROM matches WHERE matches.deleted_at IS NULL';
            const result = await queryDB(query);
            return result.length > 0 ? result : null;
        }catch (error){
            console.error('Error fetching matches:', error);
            throw error;
        }
    },


    /**
     * Create a new match.
     * @param {number} user_id_one - The unique identifier for the first user.
     * @param {number} user_id_two - The unique identifier for the second user.
     * @param {number} status - The initial status of the match (default is 0 for "pending").
     * @returns {object|null} The newly created match record if successful, else null.
     * @throws Will throw an error if the match creation fails.
     */
    async createMatch(user_id_one, user_id_two, status = 0) {
        try {
            const created_at = new Date();
            const updated_at = new Date();
            const deleted_at = null;

            // SQL query to insert a new match into the database
            const query = `
                INSERT INTO matches (user_id_one, user_id_two, status, created_at, updated_at, deleted_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;

            // Execute the query and insert the match
            const result = await queryDB(query, [user_id_one, user_id_two, status, created_at, updated_at, deleted_at]);

            // Return the newly created match record
            return result.length > 0 ? result[0] : null;

        } catch (error) {
            console.error('Error creating match:', error);
            throw error;
        }
    },


    /**
     * Update an existing match.
     * @param {number} matchId - The unique identifier for the match to be updated.
     * @param {object} updates - An object containing the fields to update (user_id_one, user_id_two, status).
     * @returns {object|null} The updated match record if successful, else null.
     * @throws Will throw an error if the update fails.
     */
    async updateMatch(matchId, updates) {
        try {
            const { user_id_one, user_id_two, status } = updates;

            // Build the SQL query and parameters based on provided updates
            const setClause = [];
            const params = [];
            let paramIndex = 1;

            // Add fields to update
            if (user_id_one !== undefined) {
                setClause.push(`user_id_one = $${paramIndex++}`);
                params.push(user_id_one);
            }
            if (user_id_two !== undefined) {
                setClause.push(`user_id_two = $${paramIndex++}`);
                params.push(user_id_two);
            }
            if (status !== undefined) {
                setClause.push(`status = $${paramIndex++}`);
                params.push(status);
            }

            // If no updates are provided, return null
            if (setClause.length === 0) {
                console.log('No updates provided for match:', matchId);
                return null;
            }

            // Construct the final SQL query
            const query = `
                UPDATE matches
                SET ${setClause.join(', ')}, updated_at = $${paramIndex}
                WHERE id = $${paramIndex + 1}
                RETURNING *;
            `;
            params.push(new Date(), matchId); // Add the updated_at timestamp and matchId

            // Execute the update query
            const result = await queryDB(query, params);

            // Return the updated match record
            return result.length > 0 ? result[0] : null;

        } catch (error) {
            console.error('Error updating match:', matchId, error);
            throw error;
        }
    },


    /**
     * Soft delete a match by setting the deleted_at timestamp.
     * @param {number} id - The unique identifier of the match to be soft deleted.
     * @returns {object} An object with a success message if the match is soft deleted, or an error if it fails.
     * @throws Will throw an error if the match is not found or if the deletion fails.
     */
    async deleteMatch(id) {
        try {
            // Check if the match exists
            const existingMatch = await Match.get(id);

            if (!existingMatch) {
                throw new Error('Match not found');
            }

            // Perform the soft delete by setting deleted_at to the now
            const softDeleteQuery = 'UPDATE matches SET deleted_at = NOW() WHERE id = $1';
            await queryDB(softDeleteQuery, [id]);

            return { message: `Match id '${id}' successfully deleted.` };
        } catch (error) {
            console.error('Error deleting match:', error); 
            throw new Error('Failed to delete match');
        }
    },
};


module.exports = Match;