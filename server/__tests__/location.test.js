// necessary includes 
const Location = require('../models/Location');
const {queryDB} = require('../config/database');

// Mock the result of queryDB
jest.mock('../config/database', () => ({
    queryDB: jest.fn(),
}));

describe('Location', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // reset test usage data
    });
    describe('get', () => {
        // this test should return true with the valid id 
        test('should return location level object if valid ID is provided', async () => {
            const mockQueryResult = [{ id: 1, city: 'New York', state: 'NY' }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Location.get(1);
            expect(result).toEqual({ id: 1, city: 'New York', state: 'NY' });
        });

        // there is no location with the id of 999, should be null
        test('test should return null if invalid iD provided', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await Location.get(999);
            expect(result).toBeNull();
        });
    });

    describe('createLocation', () => {
        // this test creates a new city with correct alphabetic symbols and spaces
        test('this test should createa new location', async () => {
            const mockQueryResult = [{ id: 1, city: 'Los Angeles', state: 'CA' }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Location.createLocation('Los Angeles', 'CA');
            expect(result).toEqual(mockQueryResult[0]);
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO locations'), 
                ['Los Angeles', 'CA']
            );
        });

        // this test includes invalid city name (has numbers)
        test('should throw error if location data invalid', async () => {
            await expect(Location.createLocation('999fakeCity', 'CL')).rejects.toThrow('Invalid location. Only alphabetic characters and spaces are allowed.');
        });
    });

    describe('updateLocation', () => {
        // test that changes the name of the city
        test('should update the location', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, city: 'San Diego', state: 'CA' }])

            await Location.updateLocation(1, 'Dayton', 'OH');

            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE locations SET city = '),
                ['Dayton', 'OH', 1]
            );
        });

        // test involving a non-existing location
        test('this should throw error if loaction does not exist', async () => {
            // here is no existing location
            queryDB.mockResolvedValueOnce([]); 

            await expect(Location.updateLocation(999, 'Dayton', 'OH')).rejects.toThrow('Location not found');
        });
    });

    describe('deleteLocation', () => {
        // this test performs a soft delete 
        test('should soft delete', async () => {
            // here is the preexisting location 
            queryDB.mockResolvedValueOnce([{ id: 1, city: 'Cinncinnati', state: 'OH' }]);

            const result = await Location.deleteLocation(1);

            expect(result).toEqual({ message: "Location id '1' successfully deleted." });
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE locations SET deleted_at = NOW() WHERE id = $1'),
                [1]
            );
        });

        // test for location that does not exist
        test('should throw error if location nonexistent', async () => {
            queryDB.mockResolvedValueOnce([]);

            await expect(Location.deleteLocation(999)).rejects.toThrow('Failed to delete location');
        });
    });
});