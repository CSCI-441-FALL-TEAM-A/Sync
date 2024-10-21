// includes
const User = require('../models/User');
const { queryDB } = require('../config/database');

// Mock the result of the query database
jest.mock('../config/database', () => ({
    queryDB: jest.fn()
}));

describe('User', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // reset mock data before each test
    });

    // testing Read 
    describe('get', () => {
        // test should return User object if valid id is provided
        test('should return user object if valid id is provided', async () => {
            const mockQueryResult = [{ id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User' }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await User.get(1);
            expect(result).toEqual(mockQueryResult[0]);
        });

        // test for null if invalid user id is provided
        test('should return null if invalid user id is provided', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await User.get(9999);
            expect(result).toBeNull();
        });
    });

    // testing Create
    describe('create', () => {
        // test for creating a new user
        test('should create a new user', async () => {
            const userData = {
                email: 'newuser@example.com',
                password: 'hashedpassword',
                first_name: 'New',
                last_name: 'User',
                birthday: '1990-01-01',
                user_type: 1
            };

            const mockQueryResult = [{ id: 1, ...userData }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await User.create(userData);
            expect(result).toEqual(mockQueryResult[0]);
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO users'),
                expect.any(Array)
            );
        });

        // test to throw an error if email already exists
        test('should throw an error if email already exists', async () => {
            const userData = {
                email: 'duplicate@example.com',
                password: 'hashedpassword',
                first_name: 'Duplicate',
                last_name: 'User',
                birthday: '1990-01-01',
                user_type: 1
            };

            queryDB.mockRejectedValueOnce({ code: '23505' }); // Simulate duplicate email error

            await expect(User.create(userData)).rejects.toThrow('A user with this email already exists.');
        });
    });

    // testing Update
    describe('update', () => {
        // test to update an existing user
        test('should update an existing user', async () => {
            const updatedData = {
                email: 'updated@example.com',
                first_name: 'Updated',
                last_name: 'User'
            };

            const mockQueryResult = [{ id: 1, ...updatedData }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await User.update(1, updatedData);
            expect(result).toEqual(mockQueryResult[0]);
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE users'),
                expect.any(Array)
            );
        });

        // test to return null if user id does not exist during update
        test('should return null if the user id does not exist', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await User.update(9999, { email: 'noexist@example.com' });
            expect(result).toBeNull();
        });
    });

    // Testing Delete
    describe('deleteUser', () => {
        // test to soft delete an existing user
        test('should soft delete an existing user', async () => {
            queryDB.mockResolvedValueOnce([{ id: 1, email: 'test@example.com' }]); // existing user

            const result = await User.deleteUser(1);
            expect(result).toEqual({ message: "User id '1' successfully deleted." });
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE users SET deleted_at = NOW() WHERE id = $1'),
                [1]
            );
        });

        // test to throw error if user does not exist
        test('should throw an error if the user does not exist', async () => {
            queryDB.mockResolvedValueOnce([]); // no user found

            await expect(User.deleteUser(9999)).rejects.toThrow('Failed to delete user');
        });
    });
});
