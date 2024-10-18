//includes
const UserType = require('../models/UserType');
const { queryDB } = require('../config/database');

// mock the result of the query databse
jest.mock('../config/database', () => ({
    queryDB: jest.fn()
}));

describe('UserType', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // test data resetting before next test
    });

    // testing Read 
    describe('get', () => {
        // test should return UserType object if valid type is provided
        test('should return proficiency level object if valid type is provided', async () => {
            const mockQueryResult = [{ name: 'Groupie'}];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await UserType.get('Groupie');
            expect(result).toEqual({ name: 'Groupie' });
        });

        // test for null if invalid type provided
        test('should return null if invalid usertype is provided', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await UserType.get('InvalidType');
            expect(result).toBeNull();
        });
    });

    // testing Create
    describe('createUserType', () => {
        // test for making a new UserType?
        test('test to create a new UserType', async () => {
            queryDB.mockResolvedValueOnce([]); // There is no existing type yet

            await UserType.createUserType('ExMusician');

            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO user_types'),
                ['ExMusician']
            );
        });

        // test to throw an error if user type exists already
        test('should thrown an error if user type exists already', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, name: "Musician" }]); // already exists

            await expect(UserType.createUserType('Musician')).rejects.toThrow('User type already exists');
        });

        // test to throw error for invalid name(blank or numbers)
        test('should throw error for invalid User type', async () => {
            await expect(UserType.createUserType('')).rejects.toThrow('Invalid user type name. Only alphabetic characters are allowed.');
        });
    });

    // testing Update
    describe('updateUserType', () => {
        // test to update a pre-existing UserType
        test('should update an existing User type', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, name: 'Groupie'}]) // exisiting type

            await UserType.updateUserType('Groupie', 'Musician');

            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE user_types SET name ='),
                ['Musician', 'Groupie']
            );
        });

        // test to throw error if User type does not exist
        test('should throw an error if the user type does not exist', async () => {
            queryDB.mockResolvedValueOnce([]);  // none user types here

            await expect(UserType.updateUserType('thisTypeIsNotReal', 'Groupie')).rejects.toThrow('User type not found');
        });
    });

    // Testing Delete
    describe('deleteUserType', () => {
        // test to soft delete an existing User Type
        test('should soft delete an existing user type', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, name: 'Musician' }]); // pre-existing level

            const result = await UserType.deleteUserType('Musician');

            expect(result).toEqual({ message: "User type 'Musician' successfully deleted." });
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining("SELECT * FROM user_types WHERE name = $1 LIMIT 1",
              ["Musician"],
              'UPDATE user_types SET deleted_at NOW() WHERE name = $1'),
                ['Musician']
            );
        });

        // test to throw error if type non existent
        test('should thorw an error if the user type does not exist', async () => {
            queryDB.mockResolvedValueOnce([]); // nada here

            await expect(UserType.deleteUserType('nonExistentType')).rejects.toThrow('Failed to delete user type');
        });
    });
});