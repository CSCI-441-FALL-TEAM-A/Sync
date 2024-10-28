// includes
const Instrument = require('../models/Instrument');
const { queryDB } = require('../config/database');

// Mock the result of the query database
jest.mock('../config/database', () => ({
    queryDB: jest.fn()
}));

describe('Instrument', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // reset mock data before each test
    });

    // testing Read 
    describe('get', () => {
        // test should return Instrument object if valid id is provided
        test('should return instrument object if valid id is provided', async () => {
            const mockQueryResult = [{ id: 1, name: 'Guitar' }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Instrument.get(1);
            expect(result).toEqual(mockQueryResult[0]);
        });

        // test for null if invalid instrument id is provided
        test('should return null if invalid instrument id is provided', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await Instrument.get(9999);
            expect(result).toBeNull();
        });
    });

    // testing Create
    describe('createInstrument', () => {
        // test for creating a new instrument
        test('should create a new instrument', async () => {
            const mockQueryResult = [{ id: 2, name: 'Violin' }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Instrument.createInstrument('Violin');
            expect(result).toEqual(mockQueryResult[0]);
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO instruments'),
                ['Violin']
            );
        });

        // test to throw an error if creation fails
        test('should throw an error if creation fails', async () => {
            queryDB.mockRejectedValueOnce(new Error('Database error'));

            await expect(Instrument.createInstrument('Drums')).rejects.toThrow('Database error');
        });
    });

    // testing Update
    describe('updateInstrument', () => {
        // test to update an existing instrument
        test('should update an existing instrument', async () => {
            const mockQueryResult = [{ id: 3, name: 'Updated Piano' }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Instrument.updateInstrument(3, 'Updated Piano');
            expect(result).toEqual(mockQueryResult[0]);
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE instruments'),
                ['Updated Piano', 3]
            );
        });

        // test to return null if the instrument id does not exist during update
        test('should return null if the instrument id does not exist', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await Instrument.updateInstrument(9999, 'Nonexistent Instrument');
            expect(result).toBeNull();
        });
    });

    // Testing Delete
    describe('deleteInstrument', () => {
        // test to soft delete an existing instrument
        test('should soft delete an existing instrument', async () => {
            const mockQueryResult = [{ id: 4, name: 'Clarinet', deleted_at: new Date() }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Instrument.deleteInstrument(4);
            expect(result).toEqual(mockQueryResult[0]);
            expect.stringContaining(`
                UPDATE instruments
                SET deleted_at = NOW(), updated_at = NOW()
                WHERE id = $1
                AND deleted_at IS NULL
                RETURNING *;
            `),
            [4]
            
        });

        // test to return null if the instrument does not exist
        test('should return null if the instrument does not exist', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await Instrument.deleteInstrument(9999);
            expect(result).toBeNull();
        });
    });
});
