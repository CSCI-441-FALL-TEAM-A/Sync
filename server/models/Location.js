const { queryDB } = require('../config/database');

/**
 * Class Location
 *
 * Location represents the users location or search preferences.
 *
 * @property {number} id - The unique identifier for the location.
 * @property {string} city - The city of the location.
 * @property {string} state - The state of the location.
 * @property {Date} created_at - Timestamp when the user type was created.
 * @property {Date} updated_at - Timestamp when the user type was last updated.
 * @property {Date|null} deleted_at - Timestamp when the user type was deleted, or null if active.
 */

const Location = {
    /**
     * Get the location by id.
     * @param {int} locationId - The id of the location.
     * @returns {object|null} The location record if found, else null.
     * @throws Will throw an error if an invalid user type is provided.
     */

    async get(locationId){
        try{
            const query = 'SELECT * FROM locations WHERE id = $1 LIMIT 1';
            const result = await queryDB(query, [locationId]);
            return result.length > 0 ? result[0] : null;
        }catch (error){
            console.error('Error fetching location by id:', locationId, error);
            throw error;
        }
    },
    /**
     * Create a new location.
     * @param {string} city - The name of the new user type.
     * @param {string} state - The name of the new user type.
     * @returns {void}
     * @throws Will throw an error if the user type already exists or if there is a database error.
     */
    async createLocation(city, state) {
        // Basic sanitization
        const sanitizedCity = city.trim();
        const sanitizedState = state.trim();

        if (!sanitizedCity || !sanitizedState || !sanitizedCity.match(/^[a-zA-Z]+$/) || !sanitizedState.match(/^[a-zA-Z]+$/)) {
            throw new Error('Invalid location. Only alphabetic characters are allowed.');
        }

        try {
            // Insert into the 'locations' table and return the newly created record
            const insertQuery = 'INSERT INTO locations (city, state, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id, city, state, created_at, updated_at';
            const result = await queryDB(insertQuery, [sanitizedCity, sanitizedState]);

            if (result && result.length > 0) {
                const createdLocation = result[0];
                console.log(`Location created with ID: ${createdLocation.id}, City: ${createdLocation.city}, State: ${createdLocation.state}`);
                return createdLocation;
            } else {
                throw new Error('Location creation failed, no data returned.');
            }
        } catch (error) {
            console.error('Error creating location:', error);
            throw error;
        }
    }
};

module.exports = Location;