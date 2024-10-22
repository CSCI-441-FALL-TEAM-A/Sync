const { queryDB } = require('../config/database');

/**
 * Class Instrument
 *
 * Instrument represents the musical instrument user enjoys (e.g. 'Trombone', 'Guitar', 'Violin').
 *
 * @property {number} id - The unique identifier for the instrument.
 * @property {string} name - The name of the instrument.
 * @property {Date} created_at - Timestamp when the instrument was created.
 * @property {Date} updated_at - Timestamp when the instrument was last updated.
 * @property {Date|null} deleted_at - Timestamp when the instrument was deleted, or null if active.
 */


const Instrument = {
    /**
     * Get the instrument by id.
     * @param {int} instrumentId - The id of the location.
     * @returns {object|null} The instrument record if found, otherwise null.
     * @throws Will throw an error if an invalid user type is provided.
     */
    async get(instrumentId){
        try {
            const query = 'SELECT * FROM instruments WHERE id = $1 LIMIT 1';
            const result = await queryDB(query, [instrumentId]);
            return result.length > 0 ? result[0] : null;
        } catch (error){
            console.error('Error fetching instrument by id:', instrumentId);
            throw error;
        }
    },

    async getInstrumentsByIds(instrumentIds) {
        const query = `
        SELECT id, name
        FROM instruments
        WHERE id = ANY($1::int[]);
        `;

        try {
            const rows = await queryDB(query, [instrumentIds]);
            // Convert the result into an object: {1: 'Guitar', 2: 'Piano'}
            return rows.reduce((acc, instrument) => {
                acc[instrument.id] = instrument.name;
                return acc;
            }, {});
        } catch (error) {
            console.error('Error fetching instruments:', error);
            throw error;
        }
    },
    /**
     * Create a new instrument.
     * @param {string} name - The name of the instrument.
     * @returns {object} The newly created instrument record.
     * @throws Will throw an error if the creation fails.
     */
    async createInstrument(name) {
        try {
            const query = `
                INSERT INTO instruments (name, created_at, updated_at)
                VALUES ($1, NOW(), NOW())
                RETURNING *;
            `;
            const result = await queryDB(query, [name]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('Error creating instrument:', name, error);
            throw error;
        }
    },

    /**
     * Update an existing instrument.
     * @param {number} instrumentId - The ID of the instrument to update.
     * @param {string} name - The new name of the instrument.
     * @returns {object|null} The updated instrument record or null if not found.
     * @throws Will throw an error if the update fails.
     */
    async updateInstrument(instrumentId, name) {
        try {
            const query = `
                UPDATE instruments
                SET name = $1, updated_at = NOW()
                WHERE id = $2
                RETURNING *;
            `;
            const result = await queryDB(query, [name, instrumentId]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('Error updating instrument:', instrumentId, error);
            throw error;
        }
    },

    /**
     * Soft delete an existing instrument by setting the deleted_at timestamp to the current time.
     * @param {number} instrumentId - The ID of the instrument to soft delete.
     * @returns {object|null} The deleted instrument record or null if not found.
     * @throws Will throw an error if the deletion fails.
     */
    async deleteInstrument(instrumentId) {
        try {
            const query = `
                UPDATE instruments
                SET deleted_at = NOW(), updated_at = NOW()
                WHERE id = $1
                AND deleted_at IS NULL
                RETURNING *;
            `;
            const result = await queryDB(query, [instrumentId]);

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('Error soft deleting instrument:', instrumentId, error);
            throw error;
        }
    }
};

module.exports = Instrument;