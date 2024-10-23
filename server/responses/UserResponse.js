/**
 * UserResponse
 *
 * Formats the user object to return only the necessary information.
 *
 * @param {object} user - The user object from the database.
 * @param {object} profile - The associated profile of the user.
 * @returns {object} The formatted user response.
 */
const UserResponse = (user, profile = null) => {
    return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        birthday: user.birthday,
        user_type: user.user_type,
        created_at: user.created_at,
        updated_at: user.updated_at,
        //Ternary, incase we don't have profile data to return.
        profile: profile ? {
            id: profile.id,
            gender: profile.gender,
            instruments: profile.instruments,
            proficiency_level: profile.proficiency_level,
            genres: profile.genres,
        } : null
    };
};

module.exports = UserResponse;