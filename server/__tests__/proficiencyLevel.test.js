

const ProficiencyLevel = require('../models/ProficiencyLevel');
const { queryDB } = require('../config/database');

// Mock the result of queryDB
jest.mock('../config/database', () => ({
    queryDB: jest.fn(),
}));

describe('ProficiencyLevel', () => {
    beforeEach(() => {
        jest.clearAllMocks();  // resets the test usage data
    });

    // testing Read
    describe('get', () => {
        // testing for correct object returned
        test('should return proficiency level object if valid name is provided', async () => {
            const mockQueryResult = [{ name: 'Novice' }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await ProficiencyLevel.get('Novice');
            expect(result).toEqual({ name: 'Novice' });
        });

        // testing for null response
        test('should return null if invalid proficiency level name is provided', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await ProficiencyLevel.get('InvalidLevel');
            expect(result).toBeNull();
        });
    });

    //testing Create
    describe('createProficiencyLevel', () => {
        // test to make a new Proficiency level
        test('should create a new proficiency level', async () => {
            queryDB.mockResolvedValueOnce([]); // No existing level

            await ProficiencyLevel.createProficiencyLevel('Expert');

            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO proficiency_levels'),
                ['Expert']
            );
        });

        // test to throw error for already existing level
        test('should throw an error if proficiency level already exists', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, name: 'Expert' }]); // Existing level

            await expect(ProficiencyLevel.createProficiencyLevel('Expert')).rejects.toThrow('Proficiency Level already exists');
        });

        // test to throw error for invalid name(blank or numbers)
        test('should throw an error for invalid level name', async () => {
            await expect(ProficiencyLevel.createProficiencyLevel('')).rejects.toThrow('Invalid proficiency level name. Only alphabetic characters are allowed.');
        });
    });

    // testing Update 
    describe('updateProficiencyLevel', () => {
        test('should update an existing proficiency level', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, name: 'Expert' }]); // Existing level

            await ProficiencyLevel.updateProficiencyLevel('Expert', 'Advanced');

            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE proficiency_levels SET name ='),
                ['Advanced', 'Expert']
            );
        });

        // test to throw error if prof level does not exist
        test('should throw an error if the proficiency level does not exist', async () => {
            queryDB.mockResolvedValueOnce([]); // No existing level

            await expect(ProficiencyLevel.updateProficiencyLevel('NonExistentLevel', 'Advanced')).rejects.toThrow('Proficiency Level not found');
        });
    });

    // Testing Delete
    describe('deleteProficiencyLevel', () => {
        // test to soft delete proficiency level
        test('should soft delete an existing proficiency level', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, name: 'Expert' }]); // Existing level

            const result = await ProficiencyLevel.deleteProficiencyLevel('Expert');

            expect(result).toEqual({ message: "Proficiency level 'Expert' successfully deleted." });
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE proficiency_levels SET deleted_at = NOW()'),
                ['Expert']
            );
        });

        // test to throw error if level nonexistent
        test('should throw an error if the proficiency level does not exist', async () => {
            queryDB.mockResolvedValueOnce([]); // No existing level

            await expect(ProficiencyLevel.deleteProficiencyLevel('NonExistentLevel')).rejects.toThrow('Proficiency level not found');
        });
    });
});
