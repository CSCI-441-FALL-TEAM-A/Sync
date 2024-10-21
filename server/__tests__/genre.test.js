// includes
const Genre = require('../models/Genre');
const { queryDB } = require('../config/database');

// Mock the result of the query database
jest.mock('../config/database', () => ({
    queryDB: jest.fn()
}));

describe('Genre', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // reset mock data before each test
    });

    // testing Read 
    describe('get', () => {
        // test should return Genre object if valid genre is provided
        test('should return genre object if valid name is provided', async () => {
            const mockQueryResult = [{ name: 'Rock' }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Genre.get('Rock');
            expect(result).toEqual({ name: 'Rock' });
        });

        // test for null if invalid genre provided
        test('should return null if invalid genre is provided', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await Genre.get('InvalidGenre');
            expect(result).toBeNull();
        });
    });

    // testing Create
    describe('createGenre', () => {
        // test for creating a new genre
        test('should create a new genre', async () => {
            queryDB.mockResolvedValueOnce([]); // No existing genre

            await Genre.createGenre('Jazz');

            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO genres'),
                ['Jazz']
            );
        });

        // test to throw an error if genre exists already
        test('should throw an error if genre already exists', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, name: 'Rock' }]); // already exists

            await expect(Genre.createGenre('Rock')).rejects.toThrow('Genre already exists');
        });

        // test to throw error for invalid name (blank or contains numbers)
        test('should throw error for invalid genre name', async () => {
            await expect(Genre.createGenre('')).rejects.toThrow('Invalid genre name. Only alphabetic characters are allowed.');
        });
    });

    // testing Update
    describe('updateGenre', () => {
        // test to update an existing genre
        test('should update an existing genre', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, name: 'Rock' }]); // existing genre

            await Genre.updateGenre('Rock', 'Classical');

            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE genres SET name ='),
                ['Classical', 'Rock']
            );
        });

        // test to throw error if genre does not exist
        test('should throw an error if the genre does not exist', async () => {
            queryDB.mockResolvedValueOnce([]); // no genre found

            await expect(Genre.updateGenre('UnknownGenre', 'NewName')).rejects.toThrow('Genre not found');
        });
    });

    // Testing Delete
    describe('deleteGenre', () => {
        // test to soft delete an existing genre
        test('should soft delete an existing genre', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, name: 'Blues' }]); // existing genre

            const result = await Genre.deleteGenre('Blues');

            expect(result).toEqual({ message: "Genre 'Blues' successfully deleted." });
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE genres SET deleted_at = NOW() WHERE name = $1'),
                ['Blues']
            );
        });

        // test to throw error if genre does not exist
        test('should throw an error if the genre does not exist', async () => {
            queryDB.mockResolvedValueOnce([]); // no genre found

            await expect(Genre.deleteGenre('NonExistentGenre')).rejects.toThrow('Failed to delete genre');
        });
    });
});
