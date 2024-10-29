const { queryDB } = require('../config/database');

/**
 * Class Genre
 *
 * Genre represents the musical genre a user enjoys (e.g. 'Blues', 'Rock', 'Country', 'Rap').
 *
 * @property {number} id - The unique identifier for the genre.
 * @property {string} name - The name of the genre.
 * @property {Date} created_at - Timestamp when the genre was created.
 * @property {Date} updated_at - Timestamp when the genre was last updated.
 * @property {Date|null} deleted_at - Timestamp when the genre was deleted, or null if active.
 */


const Genre = {
    /**
     * Get the genre by name.
     * @param {string} genreName - The name of the genre.
     * @returns {object|null} The genre record if found, otherwise null.
     * @throws Will throw an error if an invalid user type is provided.
     */
    async get(genreName) {
        try {
            const query = 'SELECT * FROM genres WHERE name = $1 LIMIT 1';
            const result = await queryDB(query, [genreName]);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('Error fetching genre by name:', genreName);
            throw error;
        }
    },

    async getGenreById(genreId){
        try {
            const query = 'SELECT * FROM genres WHERE id = $1 LIMIT 1';
            const result = await queryDB(query, [genreId]);
            return result.length > 0 ? result[0] : null;
        } catch (error){
            console.error('Error fetching genre by id:', genreId);
            throw error;
        }
    },

    /**
     * Get genre names based on an array of genre IDs.
     * @param {Array} genreIds - Array of genre IDs to fetch names for.
     * @returns {Object} An object mapping genre IDs to genre names.
     */
    async getGenresByIds(genreIds) {
        const query = `
        SELECT id, name
        FROM genres
        WHERE id = ANY($1::int[]);
        `;

        try {
            const rows = await queryDB(query, [genreIds]);
            // Convert the result into an object: {1: 'rock', 2: 'jazz'}
            return rows.reduce((acc, genre) => {
                acc[genre.id] = genre.name;
                return acc;
            }, {});
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error;
        }
    },

    async getAllGenres() {
        try {
            const query = `
                SELECT id, name, created_at, updated_at, deleted_at
                FROM genres
                WHERE deleted_at IS NULL;  -- Ensure only active instruments are returned
            `;
            const result = await queryDB(query);

            return result;
        } catch (error) {
            console.error('Error fetching all instruments:', error);
            throw error;
        }
    },

    async createGenre(genreName) {
        // Basic sanitization
        const sanitizedGenreName = genreName.trim();

        if (!sanitizedGenreName || !sanitizedGenreName.match(/^[a-zA-Z]+$/)) {
            throw new Error('Invalid genre name. Only alphabetic characters are allowed.');
        }

        try {
            // Check if the genre already exists
            const existingGenre = await this.get(sanitizedGenreName);

            if (existingGenre) {
                throw new Error('Genre already exists');
            }

            // Parameterized query for insertion
            const insertQuery = 'INSERT INTO genres (name, created_at, updated_at) VALUES ($1, NOW(), NOW())';
            await queryDB(insertQuery, [sanitizedGenreName]);

        } catch (error) {
            console.error('Error creating genre:', sanitizedGenreName);
            throw error;
        }
    },

    async updateGenre(currentName, newName){
        const sanitizedNewName = newName.trim();

        if (!sanitizedNewName || !sanitizedNewName.match(/^[a-zA-Z]+$/)) {
            throw new Error('Invalid genre name. Only alphabetic characters are allowed.');
        }

        try {
            const existingGenre = await Genre.get(currentName);

            if(!existingGenre){
                throw new Error('Genre not found');
            }

            const updateQuery = 'UPDATE genres SET name = $1, updated_at = NOW() WHERE name = $2';
            await queryDB(updateQuery, [sanitizedNewName, currentName]);

            console.log(`Genre updated from ${currentName} to ${newName}`);
        } catch (error){
            console.error('Error updating proficiency level:', error);
            throw error; // Make sure the error is thrown 
        }
    },

    async deleteGenre(name) {
        try {
            // Check if the genre exists
            const existingGenre = await Genre.get(name);

            if (!existingGenre) {
                throw new Error('Genre not found');
            }

            // Perform the soft delete by setting deleted_at to the now
            const softDeleteQuery = 'UPDATE genres SET deleted_at = NOW() WHERE name = $1';
            await queryDB(softDeleteQuery, [name]);

            console.log(`Genre '${name}' has been soft deleted.`);
            return { message: `Genre '${name}' successfully deleted.` };
        } catch (error) {
            console.error('Error soft deleting genre:', error);
            throw new Error('Failed to delete genre');
        }
    },
};

module.exports = Genre;