const { queryDB } = require('../config/database');

/**
 * Class ProficiencyLevel
 *
 * ProficiencyLevel represents the level of skill a user has (e.g. 'Novice', 'Intermediate', 'Advanced', 'Pro').
 *
 * @property {number} id - The unique identifier for the proficiency level.
 * @property {string} name - The name of the user type.
 * @property {Date} created_at - Timestamp when the user type was created.
 * @property {Date} updated_at - Timestamp when the user type was last updated.
 * @property {Date|null} deleted_at - Timestamp when the user type was deleted, or null if active.
 */

const ProficiencyLevel = {
    NOVICE: 'Novice',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
    PRO: 'Pro',

    TYPES: ['Novice', 'Intermediate', 'Advanced', 'Pro'],

    /**
     * Get the proficiency level by name.
     * @param {string} proficiencyLevelName - The name of the proficiency level.
     * @returns {object|null} The user type record if found, otherwise null.
     * @throws Will throw an error if an invalid user type is provided.
     */
    async get(proficiencyLevelName) {
        try {
            // Use correct table name: proficiency_levels
            const query = 'SELECT * FROM proficiency_levels WHERE name = $1 LIMIT 1';
            const result = await queryDB(query, [proficiencyLevelName]);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('Error fetching proficiency level by name:', proficiencyLevelName);
            throw error;
        }
    },

    //TODO: Ronnie, We need to be able to get by id as well.

    async createProficiencyLevel(proficiencyLevelName) {
        // Basic sanitization
        const sanitizedLevelName = proficiencyLevelName.trim();

        if (!sanitizedLevelName || !sanitizedLevelName.match(/^[a-zA-Z]+$/)) {
            throw new Error('Invalid proficiency level name. Only alphabetic characters are allowed.');
        }

        try {
            // Check if the user type already exists
            const existingProficiencyLevel = await this.get(sanitizedLevelName);

            if (existingProficiencyLevel) {
                throw new Error('Proficiency Level already exists');
            }

            // Parameterized query for insertion
            const insertQuery = 'INSERT INTO proficiency_levels (name, created_at, updated_at) VALUES ($1, NOW(), NOW())';
            await queryDB(insertQuery, [sanitizedLevelName]);

        } catch (error) {
            // changed this console.error('Error creating proficiency level:', sanitizedLevelName);
            throw error;
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

    async deleteProficiencyLevel(name) {
        try {
            // Check if the proficiency level exists
            const existingProficiencyLevel = await ProficiencyLevel.get(name);

            if (!existingProficiencyLevel) {
                throw new Error('Proficiency level not found');
            }

            // Perform the soft delete by setting deleted_at to the now
            const softDeleteQuery = 'UPDATE proficiency_levels SET deleted_at = NOW() WHERE name = $1';
            await queryDB(softDeleteQuery, [name]);

            console.log(`Proficiency level '${name}' has been soft deleted.`);
            return { message: `Proficiency level '${name}' successfully deleted.` };
        } catch (error) {
            console.error('Error soft deleting proficiency level:', error);
            throw new Error('Proficiency level not found');
        }
    },
};

module.exports = ProficiencyLevel;
