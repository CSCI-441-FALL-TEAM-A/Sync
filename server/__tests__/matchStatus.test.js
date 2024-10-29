// includes
const MatchStatus = require('../models/MatchStatus');
const { queryDB } = require('../config/database');

// Mock the result of the query database
jest.mock('../config/database', () => ({
    queryDB: jest.fn()
}));

describe('MatchStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // reset mock data before each test
    });

    // testing Read by name
    describe('get', () => {
        // test should return MatchStatus object if valid name is provided
        test('should return match status object if valid name is provided', async () => {
            const mockQueryResult = [{ name: 'Matched' }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await MatchStatus.get('Matched');
            expect(result).toEqual(mockQueryResult[0]);
        });

        // test for null if invalid match status name is provided
        test('should return null if invalid match status name is provided', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await MatchStatus.get('InvalidStatus');
            expect(result).toBeNull();
        });
    });

    // testing Read by ID
    describe('getMatchStatusById', () => {
        test('should return match status object if valid ID is provided', async () => {
            const mockQueryResult = [{ id: 1, name: 'Matched' }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await MatchStatus.getMatchStatusById(1);
            expect(result).toEqual(mockQueryResult[0]);
        });

        test('should return null if invalid match status ID is provided', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await MatchStatus.getMatchStatusById(9999);
            expect(result).toBeNull();
        });
    });

    // testing Create
    describe('createMatchStatus', () => {
        // test for creating a new match status
        test('should create a new match status', async () => {
            queryDB.mockResolvedValueOnce([]); // No existing match status

            await MatchStatus.createMatchStatus('Pending');
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO match_status'),
                ['Pending']
            );
        });

        // test to throw an error if match status already exists
        test('should throw an error if match status already exists', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, name: 'Matched' }]); // existing match status

            await expect(MatchStatus.createMatchStatus('Matched')).rejects.toThrow('Match status already exists');
        });

        // test to throw an error for invalid match status name
        test('should throw an error for invalid match status name', async () => {
            await expect(MatchStatus.createMatchStatus('123')).rejects.toThrow('Invalid match status name. Only alphabetic characters are allowed.');
        });
    });

    // testing Update
    describe('updateMatchStatus', () => {
        // test to update an existing match status
        test('should update an existing match status', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, name: 'Matched' }]); // existing match status

            await MatchStatus.updateMatchStatus('Matched', 'Confirmed');
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE match_status SET name ='),
                ['Confirmed', 'Matched']
            );
        });

        // test to throw an error if match status does not exist
        test('should throw an error if the match status does not exist', async () => {
            queryDB.mockResolvedValueOnce([]); // no match status found

            await expect(MatchStatus.updateMatchStatus('NonExistentStatus', 'Pending')).rejects.toThrow('Match status not found');
        });
    });

    // Testing Delete
    describe('deleteMatchStatus', () => {
        // test to soft delete an existing match status
        test('should soft delete an existing match status', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, name: 'Denied' }]); // existing match status

            const result = await MatchStatus.deleteMatchStatus('Denied');
            expect(result).toEqual({ message: "Match status 'Denied' successfully deleted." });
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE match_status SET deleted_at = NOW() WHERE name = $1'),
                ['Denied']
            );
        });

        // test to throw an error if the match status does not exist
        test('should throw an error if the match status does not exist', async () => {
            queryDB.mockResolvedValueOnce([]); // no match status found

            await expect(MatchStatus.deleteMatchStatus('InvalidStatus')).rejects.toThrow('Failed to delete match status');
        });
    });
});
