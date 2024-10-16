const ProficiencyLevel = require('../models/ProficiencyLevel');

// Mock the queryDB function
jest.mock('../config/database', () => ({
    queryDB: jest.fn(),
}));

test('should return proficiency level object if valid name is provided', async () => {
    // Mock the result of queryDB
    const mockQueryResult = [{ name: 'Novice' }];
    require('../config/database').queryDB.mockResolvedValueOnce(mockQueryResult);

    const result = await ProficiencyLevel.get('Novice');
    expect(result).toEqual({ name: 'Novice' });
});

test('should return null if invalid proficiency level name is provided', async () => {
    // Mock the result of queryDB to return an empty array
    require('../config/database').queryDB.mockResolvedValueOnce([]);

    const result = await ProficiencyLevel.get('InvalidLevel');
    expect(result).toBeNull();
});