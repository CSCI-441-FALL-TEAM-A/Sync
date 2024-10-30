
const ProfileResponse = (profile, user_type = 'guest') => {
    //Standard profile fields
    const response = {
        id: profile.id,
        gender: profile.gender,
        instruments: profile.instruments,
        proficiency_level: profile.proficiency_level,
        genres: profile.genres,
        created_at: profile.created_at,
        user_id: profile.user_id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        bio: profile.bio,
    }

    return response;
};

ProfileResponse.collection = (profiles, user_type = 'guest') => {
    return profiles.map(profile => ProfileResponse(profile, user_type));
}

module.exports = ProfileResponse;