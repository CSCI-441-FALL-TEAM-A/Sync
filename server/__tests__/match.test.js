// includes
const Match = require('../models/Match');
const { queryDB } = require('../config/database');

// Mock the result of the query database
jest.mock('../config/database', () => ({
    queryDB: jest.fn()
}));

describe('Match', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // reset mock data before each test
    });

    // testing Read 
    describe('get', () => {
        // test should return Match object if valid id is provided
        test('should return match object if valid id is provided', async () => {
            const mockQueryResult = [{ id: 1, user_id_one: 1, user_id_two: 2, status: 0 }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Match.get(1);
            expect(result).toEqual(mockQueryResult[0]);
        });

        // test for null if invalid match id is provided
        test('should return null if invalid match id is provided', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await Match.get(9999);
            expect(result).toBeNull();
        });
    });

    // testing Create
    describe('createMatch', () => {
        // test for creating a new match
        test('should create a new match', async () => {
            const mockQueryResult = [{ id: 2, user_id_one: 1, user_id_two: 3, status: 0 }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Match.createMatch(1, 3);
            expect(result).toEqual(mockQueryResult[0]);
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO matches'),
                expect.any(Array)
            );
        });

        // test to throw an error if match creation fails
        test('should throw an error if match creation fails', async () => {
            queryDB.mockRejectedValueOnce(new Error('Database error'));

            await expect(Match.createMatch(1, 3)).rejects.toThrow('Database error');
        });
    });

    // testing Update
    describe('updateMatch', () => {
        // test to update an existing match
        test('should update an existing match', async () => {
            const mockQueryResult = [{ id: 3, user_id_one: 1, user_id_two: 2, status: 1 }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Match.updateMatch(3, { status: 1 });
            expect(result).toEqual(mockQueryResult[0]);
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE matches'),
                expect.any(Array)
            );
        });

        // test to return null if the match id does not exist during update
        test('should return null if the match id does not exist', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await Match.updateMatch(9999, { status: 1 });
            expect(result).toBeNull();
        });
    });

    // Testing Delete
    describe('deleteMatch', () => {
        // test to soft delete an existing match
        test('should soft delete an existing match', async () => {
            const mockQueryResult = [{ id: 4, user_id_one: 1, user_id_two: 2 }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Match.deleteMatch(4);
            expect(result).toEqual({ message: "Match id '4' successfully deleted." });
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE matches SET deleted_at = NOW() WHERE id = $1'),
                [4]
            );
        });

        // test to throw an error if the match does not exist
        test('should throw an error if the match does not exist', async () => {
            queryDB.mockResolvedValueOnce([]); // no match found

            await expect(Match.deleteMatch(9999)).rejects.toThrow('Failed to delete match');
        });
    });
});
