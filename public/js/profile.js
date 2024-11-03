// ------------------ Page Initialization ------------------

document.addEventListener("DOMContentLoaded", async () => {
    const userId = sessionStorage.getItem('userId');

    if (userId) {
        await Promise.all([fetchGenres(), fetchInstruments(), fetchUserData(userId)]);
    }
    

    toggleMusicianPages(); // Show or hide instruments section based on role
});

// ------------------ Fetch and Populate Data ------------------

/** 
 * Fetch and populate profile data with role name
 * @param {string} userId - The user ID from session storage
 */
async function fetchUserData(userId) {
    try {
        // Fetch user information (includes user_type ID)
        const userResponse = await fetch(`/api/users/${userId}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        
        const user = await userResponse.json();
        const roleId = user.user_type; 

        // Fetch the role name using the role ID
        const roleName = await fetchRoleNameById(roleId);
        
        // Fetch profile information to get other profile-specific fields
        await fetchProfileData(userId, roleName);
        
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

/**
 * Fetch role name by role ID
 * @param {number} roleId - Role ID
 * @returns {string|null} - Name of the role or null if not found
 */
async function fetchRoleNameById(roleId) {
    try {
        const userTypeResponse = await fetch(`/api/user-types/id/${roleId}`);
        if (!userTypeResponse.ok) throw new Error('Failed to fetch user type by ID');
        
        const userType = await userTypeResponse.json();
        return userType.name; 
    } catch (error) {
        console.error("Error fetching user type name:", error);
        return null;
    }
}

/**
 * Fetch and populate profile data
 * @param {string} userId - User ID
 * @param {string} roleName - Role name associated with the user
 */
async function fetchProfileData(userId, roleName) {
    try {
        const profileResponse = await fetch(`/api/profiles/user/${userId}`);
        if (!profileResponse.ok) throw new Error('Failed to fetch profile data');
        
        const profile = await profileResponse.json();
        sessionStorage.setItem('profileId', profile.id);
        profile.roleName = roleName; // Add role name to profile data

        populateProfileFields(profile); // Pass the profile with updated role name
    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
}

// ------------------ Display Profile Fields ------------------

/**
 * Populate profile fields with user data
 * @param {Object} profile - Profile data object
 */
function populateProfileFields(profile) {
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    const profilePic = profile.picture || "../../images/default_avatar.jpg";
    const bio = profile.bio || '';
    const gender = profile.gender || '';
    const roleName = profile.roleName || ''; 
    const proficiencyLevel = profile.proficiency_level || '';

    // Set the user info fields
    document.getElementById('user-name').textContent = `${firstName} ${lastName}`;
    document.getElementById('profile-picture').src = profilePic;
    document.getElementById('firstname').value = firstName;
    document.getElementById('lastname').value = lastName;
    document.getElementById('bio').value = bio;
    document.getElementById('gender').value = gender;
    document.getElementById('role').value = roleName;
    document.getElementById('proficiency-level').value = proficiencyLevel;

    // Set the role dropdown value using the role name
    const roleDropdown = document.getElementById('role');
    roleDropdown.value = roleName;

    // Populate selected genres and instruments
    selectedGenres = new Set(profile.genres.map(g => g.id.toString()));
    selectedInstruments = new Set(profile.instruments.map(i => i.id));

    displaySelectedGenres();
    displaySelectedInstruments();
}

// ------------------ Fetch Instruments and Genres ------------------

let allGenres = [];
let allInstruments = [];

/**
 * Fetch all instruments from the backend
 */
async function fetchInstruments() {
    try {
        const response = await fetch('/api/instruments');
        allInstruments = await response.json(); // Store all instruments for easy lookup
        displayInstruments(allInstruments);
    } catch (error) {
        console.error('Error fetching instruments:', error);
    }
}

/**
 * Fetch all genres from the backend
 */
async function fetchGenres() {
    try {
        const response = await fetch('/api/genres');
        allGenres = await response.json(); // Store all genres for easy lookup
        displayGenres(allGenres);
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

// ------------------ Instruments and Genres ------------------

/**
 * Display instruments list and manage selection
 * @param {Array} instruments - List of instrument objects
 */
function displayInstruments(instruments) {
    const instrumentOptionsContainer = document.getElementById('instruments-options');
    instrumentOptionsContainer.innerHTML = ''; // Clear existing options

    instruments.forEach(instrument => {
        const option = document.createElement('div');
        option.classList.add('badge-option');
        option.textContent = instrument.name;
        option.dataset.instrumentId = instrument.id;

        // Toggle selection on click
        option.addEventListener('click', () => toggleInstrumentSelection(option, instrument));
        instrumentOptionsContainer.appendChild(option);
    });
}

/**
 * Display genres list and manage selection
 * @param {Array} genres - List of genre objects
 */
function displayGenres(genres) {
    const genreOptionsContainer = document.getElementById('genre-options');
    genreOptionsContainer.innerHTML = ''; // Clear existing options

    genres.forEach(genre => {
        const option = document.createElement('div');
        option.classList.add('badge-option');
        option.textContent = genre.name;
        option.dataset.genreId = genre.id.toString();

        // Add 'selected' class if genre is already selected
        if (selectedGenres.has(genre.id.toString())) {
            option.classList.add('selected');
        }

        // Toggle selection on click, respecting the limit
        option.addEventListener('click', () => toggleGenreSelection(option, genre));
        genreOptionsContainer.appendChild(option);
    });
}

/**
 * Get genre name by genre ID
 * @param {string} id - Genre ID as a string
 * @returns {string|null} - Genre name or null if not found
 */
function getGenreNameById(id) {
    const genreId = id.toString(); 
    const genre = allGenres.find(g => g.id === genreId);
    return genre ? genre.name : null;
}

/**
 * Get instrument name by instrument ID
 * @param {number} id - Instrument ID as a number
 * @returns {string|null} - Instrument name or null if not found
 */
function getInstrumentNameById(id) {
    const instrument = allInstruments.find(i => i.id === id);
    return instrument ? instrument.name : null;
}


/**
 * Display selected genres in the profile
 */
function displaySelectedGenres() {
    const selectedGenresContainer = document.getElementById('selected-genres'); 
    selectedGenresContainer.innerHTML = ''; // Clear previous genres

    selectedGenres.forEach(id => {
        const genreName = getGenreNameById(id);
        if (genreName) { // Only display valid genres
            const genre = { id: id, name: genreName };
            addSelectedGenreTag(genre);
        }
    });

    // Mark selected genres in the options list
    updateGenreSelectionState();
}

/**
 * Display selected instruments in the profile
 */
function displaySelectedInstruments() {
    const selectedInstrumentsContainer = document.getElementById('selected-instruments'); 
    selectedInstrumentsContainer.innerHTML = ''; // Clear previous instruments

    selectedInstruments.forEach(id => {
        const instrumentName = getInstrumentNameById(id);
        if (instrumentName) { // Only display valid instruments
            const instrument = { id: id, name: instrumentName };
            addSelectedInstrumentTag(instrument);
        }
    });

    // Mark selected instruments in the options list
    updateInstrumentSelectionState();
}

// Handle instrument selection
const selectedInstrumentsContainer = document.getElementById('selected-instruments');
let selectedInstruments = new Set();

/**
 * Toggle instrument selection and update display
 * @param {HTMLElement} option - Selected option element
 * @param {Object} instrument - Selected instrument object
 */
function toggleInstrumentSelection(option, instrument) {
    if (selectedInstruments.has(instrument.id)) {
        selectedInstruments.delete(instrument.id);
        removeSelectedInstrumentTag(instrument.id);
    } else {
        selectedInstruments.add(instrument.id);
        addSelectedInstrumentTag(instrument);
    }
    updateInstrumentSelectionState();
}

// Handle genre selection with limit
const selectedGenresContainer = document.getElementById('selected-genres');
let selectedGenres = new Set();

/**
 * Toggle genre selection with a limit of 5 genres
 * @param {HTMLElement} option - Selected option element
 * @param {Object} genre - Selected genre object
 */
function toggleGenreSelection(option, genre) {
    const genreIdStr = genre.id.toString(); // Ensure ID is a string
    if (selectedGenres.has(genreIdStr)) {
        selectedGenres.delete(genreIdStr);
        removeSelectedGenreTag(genreIdStr);
    } else if (selectedGenres.size < 5) {
        selectedGenres.add(genreIdStr);
        addSelectedGenreTag(genre);
    } else {
        alert('You can select up to 5 genres only.');
    }
    updateGenreSelectionState();
}

/**
 * Add selected instrument tag to the display
 * @param {Object} instrument - Instrument object with id and name
 */
function addSelectedInstrumentTag(instrument) {
    const tag = document.createElement('div');
    tag.classList.add('selected-badge');
    tag.textContent = instrument.name;
    tag.dataset.instrumentId = instrument.id;

    const removeIcon = document.createElement('span');
    removeIcon.textContent = '×';
    removeIcon.onclick = () => {
        selectedInstruments.delete(parseInt(instrument.id, 10));
        tag.remove();
        updateInstrumentSelectionState();
    };
    tag.appendChild(removeIcon);
    document.getElementById('selected-instruments').appendChild(tag);
}

/**
 * Add selected genre tag to the display
 * @param {Object} genre - Genre object with id and name
 */
function addSelectedGenreTag(genre) {
    const tag = document.createElement('div');
    tag.classList.add('selected-badge');
    tag.textContent = genre.name;
    tag.dataset.genreId = genre.id;

    const removeIcon = document.createElement('span');
    removeIcon.textContent = '×';
    removeIcon.onclick = () => {
        selectedGenres.delete(genre.id.toString());
        tag.remove();
        updateGenreSelectionState();
    };
    tag.appendChild(removeIcon);
    document.getElementById('selected-genres').appendChild(tag);
}

/**
 * Remove selected instrument tag from the display
 * @param {number} instrumentId - ID of the instrument to remove
 */
function removeSelectedInstrumentTag(instrumentId) {
    const tag = document.getElementById('selected-instruments').querySelector(`[data-instrument-id="${instrumentId}"]`);
    if (tag) tag.remove();
}

/**
 * Remove selected genre tag from the display
 * @param {string} genreId - ID of the genre to remove
 */
function removeSelectedGenreTag(genreId) {
    const tag = selectedGenresContainer.querySelector(`[data-genre-id="${genreId}"]`);
    if (tag) tag.remove();
}

/**
 * Update selection state in instrument options list
 */
function updateInstrumentSelectionState() {
    document.querySelectorAll('.badge-option[data-instrument-id]').forEach(option => {
        const instrumentId = parseInt(option.dataset.instrumentId, 10);
        option.classList.toggle('selected', selectedInstruments.has(instrumentId));
    });
}

/**
 * Update selection state in genre options list
 */
function updateGenreSelectionState() {
    document.querySelectorAll('.badge-option[data-genre-id]').forEach(option => {
        const genreId = option.dataset.genreId;
        option.classList.toggle('selected', selectedGenres.has(genreId));
    });
}

/**
 * Filter instrument list based on search input
 */
function filterInstruments() {
    const searchValue = document.getElementById('instrument-search').value.toLowerCase();
    const instrumentOptions = document.querySelectorAll('#instruments-options .badge-option');

    instrumentOptions.forEach(option => {
        const instrumentName = option.textContent.toLowerCase();
        option.style.display = instrumentName.includes(searchValue) ? 'inline-block' : 'none';
    });
}

/**
 * Filter genre list based on search input
 */
function filterGenres() {
    const searchValue = document.getElementById('genre-search').value.toLowerCase();
    const genreOptions = document.querySelectorAll('#genre-options .badge-option');

    genreOptions.forEach(option => {
        const genreName = option.textContent.toLowerCase();
        option.style.display = genreName.includes(searchValue) ? 'inline-block' : 'none';
    });
}

// ------------------ Profile Update ------------------

/**
 * Update user profile data with provided input values
 */
async function updateProfile() {
    const profileId = sessionStorage.getItem('profileId');
    const userId = sessionStorage.getItem('userId');

    if (!profileId || !userId) {
        alert("Unable to update profile: Missing profile or user ID.");
        return;
    }

    const firstName = document.getElementById('firstname').value.trim();
    const lastName = document.getElementById('lastname').value.trim();
    const bio = document.getElementById('bio').value;
    const gender = document.getElementById('gender').value;
    const roleName = document.getElementById('role').value;

    if (!firstName) {
        alert("First name is required.");
        return;
    }

    const proficiencyLevelName = document.getElementById('proficiency-level').value;
    let proficiencyLevelId = null;

    // Fetch proficiency level ID by name
    if (proficiencyLevelName) {
        try {
            const response = await fetch(`/api/proficiency-levels/name/${proficiencyLevelName}`);
            const proficiencyLevelData = await response.json();
            if (response.ok) {
                proficiencyLevelId = parseInt(proficiencyLevelData.id, 10);
            } else {
                console.error(`Error fetching proficiency level ID: ${proficiencyLevelData.message}`);
                alert("Error fetching proficiency level. Please try again.");
                return;
            }
        } catch (error) {
            console.error("Error fetching proficiency level:", error);
        }
    }

    try {
        // Get role ID based on the role name
        const roleId = await getUserTypeIdByName(roleName);
        if (!roleId) {
            alert("Invalid role selected.");
            return;
        }

        // Validate and filter genres and instruments
        const validGenres = Array.from(selectedGenres).filter(id => getGenreNameById(id) !== null);
        const validInstruments = Array.from(selectedInstruments).filter(id => getInstrumentNameById(id) !== null);

        // Prepare data to update in User model (first name, last name, and role ID)
        const userData = {
            first_name: firstName,
            last_name: lastName,
            user_type: roleId 
        };

        // Prepare data to update in Profile model (bio, gender, and genres)
        const profileData = {
            bio,
            gender,
            genres: validGenres,
            instruments: roleName === 'Musician' ? validInstruments : [],
            proficiency_level: roleName === 'Musician' ? proficiencyLevelId : 0
        };

        // Update User model (first name, last name, and role ID)
        const userResponse = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!userResponse.ok) {
            console.error("Failed to update user:", userResponse.statusText);
            alert("Failed to update user information");
            return;
        }

        // Update Profile model (bio, gender, and genres)
        const profileResponse = await fetch(`/api/profiles/${profileId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData),
        });
        if (profileResponse.ok) {
            alert("Profile updated successfully!");
            await fetchUserData(userId); // Refresh profile data after update
        } else {
            console.error("Failed to update profile:", profileResponse.statusText);
            alert("Failed to update profile");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}

/**
 * Helper function to fetch user type ID by role name
 * @param {string} roleName - Role name
 * @returns {number} - ID of the role
 */
async function getUserTypeIdByName(roleName) {
    try {
        const response = await fetch(`/api/user-types/name/${roleName}`);
        if (!response.ok) throw new Error(`Failed to fetch user type for role: ${roleName}`);
        
        const userType = await response.json();
        return userType.id; // Assuming the response contains the ID of the user type
    } catch (error) {
        console.error("Error fetching user type ID:", error);
        return null;
    }
}

// ------------------ Navigation and Logout ------------------

/**
 * Toggle instrument and proficiency sections based on role
 */
function toggleMusicianPages() {
    const roleDropdown = document.getElementById('role');
    const instrumentSection = document.getElementById('instrument-section');
    const proficiencySection = document.getElementById('proficiency-section');
    
    const isMusician = roleDropdown.value === "Musician";
    instrumentSection.style.display = isMusician ? "block" : "none";
    proficiencySection.style.display = isMusician ? "block" : "none";
}

/**
 * Show selected page and hide others
 * @param {string} pageId - ID of the page to display
 */
function showPage(pageId) {
    document.querySelectorAll('.form-step').forEach(section => section.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

/**
 * Logout of user profile and clear session
 */
function logout() {
    sessionStorage.removeItem('userId'); // Clear session storage on logout
    localStorage.removeItem('userId');
    window.location.href = '../../index.html';
    alert("You have been logged out.");
}
