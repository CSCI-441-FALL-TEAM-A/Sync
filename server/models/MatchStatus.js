const { queryDB } = require('../config/database');

/**
 * Class MatchStatus
 *
 * MatchStatus represents the types of matches in the system (e.g., 'Matched', 'Unmatched', 'Denied').
 *
 * @property {number} id - The unique identifier for the match status.
 * @property {string} name - The name of the match status.
 * @property {Date} created_at - Timestamp when the match status was created.
 * @property {Date} updated_at - Timestamp when the match status was last updated.
 * @property {Date|null} deleted_at - Timestamp when the match status was deleted, or null if active.
 */

const MatchStatus = {
    UNMATCHED: 'Unmatched',
    MATCHED: 'Matched',
    DENIED: 'Denied',

    TYPES: ['Unmatched', 'Matched',  'Denied'],

    /**
     * Get the match status by name.
     * @param {string} matchStatusName - The name of the match status.
     * @returns {object|null} The match status record if found, otherwise null.
     * @throws Will throw an error if an invalid match status is provided.
     */
    async get(matchStatusName) {
        try {
            const query = 'SELECT * FROM match_status WHERE name = $1 LIMIT 1';  //originally match_statuses
            const result = await queryDB(query, [matchStatusName]);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('Error fetching match status by name:', matchStatusName);
            throw error;
        }
    },

    /**
     * Get the match status by id.
     * @param {number} matchStatusId - The name of the match status.
     * @returns {object|null} The match status record if found, otherwise null.
     * @throws Will throw an error if an invalid match status is provided.
     */
    async getMatchStatusById(matchStatusId) {
        try {
            const query = 'SELECT * FROM match_status WHERE id = $1 LIMIT 1';
            const result = await queryDB(query, [matchStatusId]);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('Error fetching match status by id:', matchStatusId);
            throw error;
        }
    },

    /**
     * Create a new match status.
     * @param {string} matchStatus - The name of the new match status.
     * @returns {void}
     * @throws Will throw an error if the match status already exists or if there is a database error.
     */
    async createMatchStatus(matchStatusName) {
        // Basic sanitization
        const sanitizedMatchName = matchStatusName.trim();

        if (!sanitizedMatchName || !sanitizedMatchName.match(/^[a-zA-Z]+$/)) {
            throw new Error('Invalid match status name. Only alphabetic characters are allowed.');
        }

        try {
            // Check if the match status already exists
            const existingMatchStatus = await this.get(sanitizedMatchName);

            if (existingMatchStatus) {
                throw new Error('Match status already exists');
            }

            // Parameterized query for insertion
            const insertQuery = 'INSERT INTO match_status (name, created_at, updated_at) VALUES ($1, NOW(), NOW())';
            await queryDB(insertQuery, [sanitizedMatchName]);

        } catch (error) {
            // changed this console.error('Error creating user type:', sanitizedMatchName);
            throw error;
        }
    },

    /**
     * Update an existing match status.
     * @param {string} currentName - The current name of the match status.
     * @param {string} newName - The new name of the match status.
     * @returns {void}
     * @throws Will throw an error if the match status does not exist or if there is a database error.
     */

    async updateMatchStatus(currentName, newName){
        const sanitizedNewName = newName.trim();

        if (!sanitizedNewName || !sanitizedNewName.match(/^[a-zA-Z]+$/)) {
            throw new Error('Invalid match status name. Only alphabetic characters are allowed.');
        }

        try {
            const existingMatchstatus = await MatchStatus.get(currentName);

            if(!existingMatchstatus){
                throw new Error('Match status not found');
            }

            const updateQuery = 'UPDATE match_status SET name = $1, updated_at = NOW() WHERE name = $2';
            await queryDB(updateQuery, [sanitizedNewName, currentName]);

            console.log(`Match status updated from ${currentName} to ${newName}`);
        } catch (error){
            // changed this console.error('Error updating match status:', error);

            // added throw error
            throw error;
        }
    },

    async deleteMatchStatus(name) {
        try {
            // Check if the match status exists
            const existingMatchStatus = await MatchStatus.get(name);

            if (!existingMatchStatus) {
                throw new Error('Match status not found');
            }

            // Perform the soft delete by setting deleted_at to the now
            const softDeleteQuery = 'UPDATE match_status SET deleted_at = NOW() WHERE name = $1';
            await queryDB(softDeleteQuery, [name]);

            console.log(`Match status '${name}' has been soft deleted.`);
            return { message: `Match status '${name}' successfully deleted.` };
        } catch (error) {
            throw new Error('Failed to delete match status');
        }
    },
};

module.exports = MatchStatus;