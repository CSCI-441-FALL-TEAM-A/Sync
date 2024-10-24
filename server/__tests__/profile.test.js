// includes
const Profile = require('../models/Profile');
const { queryDB } = require('../config/database');

// Mock the result of the query database
jest.mock('../config/database', () => ({
    queryDB: jest.fn()
}));

describe('Profile', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // reset mock data before each test
    });

    // testing Read 
    describe('get', () => {
        // test should return Profile object if valid id is provided
        test('should return profile object if valid id is provided', async () => {
            const mockQueryResult = [{ id: 1, user_id: 1, gender: 'Male', instruments: [1, 2], proficiency_level: 3, genres: [1, 3] }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Profile.get(1);
            expect(result).toEqual(mockQueryResult[0]);
        });

        // test for null if invalid profile id is provided
        test('should return null if invalid profile id is provided', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await Profile.get(9999);
            expect(result).toBeNull();
        });
    });

    // testing Create
    describe('create', () => {
        // test for creating a new profile
        test('should create a new profile', async () => {
            const profileData = {
                user_id: 1,
                gender: 'Female',
                instruments: [1, 2],
                proficiency_level: 3,
                genres: [2, 4]
            };
            const mockQueryResult = [{ id: 2, ...profileData }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Profile.create(profileData);
            expect(result).toEqual(mockQueryResult[0]);
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO profiles'),
                expect.any(Array)
            );
        });

        // test to throw an error if profile creation fails
        test('should throw an error if profile creation fails', async () => {
            queryDB.mockRejectedValueOnce(new Error('Database error'));

            const profileData = {
                user_id: 1,
                gender: 'Male',
                instruments: [1, 2],
                proficiency_level: 3,
                genres: [1, 3]
            };

            await expect(Profile.create(profileData)).rejects.toThrow('Database error');
        });
    });

    // testing Update
    describe('update', () => {
        // test to update an existing profile
        test('should update an existing profile', async () => {
            const updatedData = {
                gender: 'Non-binary',
                instruments: [1, 3],
                proficiency_level: 4,
                genres: [2]
            };
            const mockQueryResult = [{ id: 3, user_id: 2, ...updatedData }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Profile.update(3, updatedData);
            expect(result).toEqual(mockQueryResult[0]);
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE profiles'),
                expect.any(Array)
            );
        });

        // test to return null if the profile id does not exist during update
        test('should return null if the profile id does not exist', async () => {
            queryDB.mockResolvedValueOnce([]);

            const result = await Profile.update(9999, { gender: 'Other' });
            expect(result).toBeNull();
        });
    });

    // Testing Delete
    describe('deleteProfile', () => {
        // test to soft delete an existing profile
        test('should soft delete an existing profile', async () => {
            const mockQueryResult = [{ id: 4, user_id: 2, gender: 'Male' }];
            queryDB.mockResolvedValueOnce(mockQueryResult);

            const result = await Profile.deleteProfile(4);
            expect(result).toEqual({ message: "Profile id '4' successfully deleted." });
            expect(queryDB).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE profiles SET deleted_at = NOW() WHERE id = $1'),
                [4]
            );
        });

        // test to throw an error if the profile does not exist
        test('should throw an error if the profile does not exist', async () => {
            queryDB.mockResolvedValueOnce([]); // no profile found

            await expect(Profile.deleteProfile(9999)).rejects.toThrow('Failed to delete profile');
        });
    });
});
