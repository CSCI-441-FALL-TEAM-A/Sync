// ------------------ Page Initialization ------------------

// Ensure userId is retrieved correctly on page load, and initialize profile setup
document.addEventListener("DOMContentLoaded", async () => {
    // Retrieve userId from storage
    let userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
    
    if (!userId) {
        console.error("Error: userId not found in sessionStorage or localStorage.");
        alert("User not logged in. Please log in to set up your profile.");
        window.location.href = "../login.html";
        return;
    } else {
        // Save userId in both session and local storage for persistence
        sessionStorage.setItem('userId', userId);
        localStorage.setItem('userId', userId);
        
        // Fetch and store the existing profile ID
        await fetchAndStoreProfileId(userId);
    }

    // Attach form submission listener to handle profile setup submissions
    document.getElementById('profile-setup-form').addEventListener('submit', handleProfileSetupSubmit);

    // Fetch and display instruments and genres available for selection
    fetchInstruments();
    fetchGenres();

    // Initialize skill level requirement handling for musicians
    const mainRoleSelection = document.querySelectorAll('input[name="role"]');
    const skillLevelRadios = document.querySelectorAll('input[name="skill_level"]');
    const skillLevelSection = document.getElementById('step-4');

    /**
     * Update skill level requirement based on selected role
     */
    function updateSkillLevelRequirement() {
        const musicianSelected = Array.from(mainRoleSelection).some(
            radio => radio.checked && radio.value === "Musician"
        );

        skillLevelRadios.forEach(radio => {
            if (musicianSelected) {
                radio.setAttribute('required', 'required');
            } else {
                radio.removeAttribute('required');
                skillLevelSection.style.display = 'none';
            }
        });
    }

    // Add event listeners to role selection to trigger skill level requirement update
    mainRoleSelection.forEach(radio => {
        radio.addEventListener("change", () => updateSkillLevelRequirement(mainRoleSelection, skillLevelRadios, skillLevelSection));
    });

    updateSkillLevelRequirement(mainRoleSelection, skillLevelRadios, skillLevelSection); // Initialize on page load
});

/**
 * Update skill level requirement based on selected role
 * @param {NodeList} mainRoleSelection - NodeList of role selection radio inputs
 * @param {NodeList} skillLevelRadios - NodeList of skill level radio inputs
 * @param {HTMLElement} skillLevelSection - The skill level section element to toggle
 */
function updateSkillLevelRequirement(mainRoleSelection, skillLevelRadios, skillLevelSection) {
    const musicianSelected = Array.from(mainRoleSelection).some(
        radio => radio.checked && radio.value === "Musician"
    );

    skillLevelRadios.forEach(radio => {
        if (musicianSelected) {
            radio.setAttribute('required', 'required');
            skillLevelSection.style.display = 'block';
        } else {
            radio.removeAttribute('required');
            skillLevelSection.style.display = 'none';
        }
    });
}

/**
 * Fetch and store the profile ID for a given user
 * @param {string} userId - ID of the user
 */
async function fetchAndStoreProfileId(userId) {
    try {
        const response = await fetch(`/api/profiles/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch profile ID');
        
        const profile = await response.json();
        sessionStorage.setItem('profileId', profile.id); // Store profile ID
    } catch (error) {
        console.error("Error fetching profile ID:", error);
    }
}

// ------------------ Submission Handling ------------------

/**
 * Submit user profile setup form
 * @param {Event} event - Submit event object
 */
async function handleProfileSetupSubmit(event) {
    event.preventDefault();

    const userId = sessionStorage.getItem('userId');
    const profileId = sessionStorage.getItem('profileId'); 
    if (!userId || !profileId) {
        console.error("Error: userId or profileId not found.");
        alert("User not logged in. Please log in to set up your profile.");
        window.location.href = "../login.html";
        return;
    }

    const roleName = document.querySelector('input[name="role"]:checked')?.value;
    const proficiencyLevelName = document.querySelector('input[name="skill_level"]:checked')?.value;

    const userData = { user_type: await getUserTypeIdByName(roleName) };

    const profileData = {
        gender: document.getElementById('gender').value || null,
        instruments: roleName === 'Musician' ? Array.from(selectedInstruments).map(id => parseInt(id, 10)) : [],
        proficiency_level: roleName === 'Musician' ? await getProficiencyLevelId(proficiencyLevelName) : 0,
        genres: Array.from(selectedGenres).map(id => parseInt(id, 10)),
        preferred_gender: document.getElementById('preferred_gender').value,
    };

    try {
        await updateUserProfile(userId, userData);
        await updateProfileData(profileId, profileData);
        alert('Profile setup completed successfully!');
        window.location.href = '../home.html';
    } catch (error) {
        console.error('Submission failed:', error);
        alert('An error occurred. Please try again.');
    }
}

// ------------------ Update Helper Functions ------------------

/**
 * Get user type ID by role name
 * @param {string} roleName - Name of the role
 * @returns {number|null} - ID of the role
 */
async function getUserTypeIdByName(roleName) {
    try {
        const response = await fetch(`/api/user-types/name/${roleName}`);
        const userType = await response.json();
        return userType.id;
    } catch (error) {
        console.error("Error fetching user type ID:", error);
        return null;
    }
}

/**
 * Get proficiency level ID by level name
 * @param {string} levelName - Name of the proficiency level
 * @returns {number|null} - ID of the proficiency level
 */
async function getProficiencyLevelId(levelName) {
    try {
        const response = await fetch(`/api/proficiency-levels/name/${levelName}`);
        const data = await response.json();
        return  parseInt(data.id, 10);
    } catch (error) {
        console.error("Error fetching proficiency level ID:", error);
        return null;
    }
}

/**
 * Update the user's main profile data
 * @param {string} userId - User ID
 * @param {Object} userData - User data to update
 */
async function updateUserProfile(userId, userData) {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error(`Failed to update user: ${await response.text()}`);
}

/**
 * Update the user's additional profile data
 * @param {string} profileId - Profile ID
 * @param {Object} profileData - Profile data to update
 */
async function updateProfileData(profileId, profileData) {
    const response = await fetch(`/api/profiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error(`Failed to update profile: ${await response.text()}`);
}


// ------------------ Instruments and Genres ------------------

/**
 * Fetch and display available instruments
 */
async function fetchInstruments() {
    try {
        const response = await fetch('/api/instruments');
        const instruments = await response.json();
        displayInstruments(instruments);
    } catch (error) {
        console.error('Error fetching instruments:', error);
    }
}

/**
 * Fetch and display available genres
 */
async function fetchGenres() {
    try {
        const response = await fetch('/api/genres');
        const genres = await response.json();
        displayGenres(genres);
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

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
        option.dataset.genreId = genre.id;

        // Toggle selection on click, respecting the limit
        option.addEventListener('click', () => toggleGenreSelection(option, genre));
        genreOptionsContainer.appendChild(option);
    });
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
        option.classList.remove('selected');
        removeSelectedInstrumentTag(instrument.id);
    } else {
        selectedInstruments.add(instrument.id);
        option.classList.add('selected');
        addSelectedInstrumentTag(instrument);
    }
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
    if (selectedGenres.has(genre.id)) {
        // Deselect genre
        selectedGenres.delete(genre.id);
        option.classList.remove('selected');
        removeSelectedGenreTag(genre.id);
    } else if (selectedGenres.size < 5) {
        // Select genre if under the limit
        selectedGenres.add(genre.id);
        option.classList.add('selected');
        addSelectedGenreTag(genre);
    } else {
        alert('You can select up to 5 genres only.');
    }
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
        selectedInstruments.delete(instrument.id);
        tag.remove();
        document.querySelector(`.badge-option[data-instrument-id="${instrument.id}"]`).classList.remove('selected');
    };
    tag.appendChild(removeIcon);
    selectedInstrumentsContainer.appendChild(tag);
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
        selectedGenres.delete(genre.id);
        tag.remove();
        document.querySelector(`.badge-option[data-genre-id="${genre.id}"]`).classList.remove('selected');
    };
    tag.appendChild(removeIcon);
    selectedGenresContainer.appendChild(tag);
}


/**
 * Remove selected instrument tag from the display
 * @param {number} instrumentId - ID of the instrument to remove
 */
function removeSelectedInstrumentTag(instrumentId) {
    const tag = selectedInstrumentsContainer.querySelector(`[data-instrument-id="${instrumentId}"]`);
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
 * Filter instrument list based on search input
 */
function filterInstruments() {
    const searchValue = document.getElementById('badge-search').value.toLowerCase();
    const instrumentOptions = document.querySelectorAll('.badge-option');

    instrumentOptions.forEach(option => {
        const instrumentName = option.textContent.toLowerCase();
        if (instrumentName.includes(searchValue)) {
            option.style.display = 'inline-block';
        } else {
            option.style.display = 'none';
        }
    });
}

/**
 * Filter genre list based on search input
 */
function filterGenres() {
    const searchValue = document.getElementById('badge-search').value.toLowerCase();
    const genreOptions = document.querySelectorAll('.badge-option');

    genreOptions.forEach(option => {
        const genreName = option.textContent.toLowerCase();
        option.style.display = genreName.includes(searchValue) ? 'inline-block' : 'none';
    });
}


// ------------------ Utility  --------------------

// Display information about terms on hover
document.querySelectorAll('.info-icon').forEach(icon => {
    icon.addEventListener('mouseenter', (event) => {
        const infoText = event.currentTarget.getAttribute('data-info');
        const section = event.currentTarget.closest('.form-step');
        const infoParagraph = section.querySelector('.info-text');
        if (infoParagraph) {
            infoParagraph.textContent = infoText;
            infoParagraph.style.display = 'block';
        }
    });
    
    icon.addEventListener('mouseleave', (event) => {
        const section = event.currentTarget.closest('.form-step');
        const infoParagraph = section.querySelector('.info-text');
        if (infoParagraph) {
            infoParagraph.style.display = 'none';
        }
    });
});

/**
 * Preview selected image file in the upload container
 * @param {Event} event - File input change event
 */
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.querySelector('.upload-container').style.backgroundImage = `url(${e.target.result})`;
            document.querySelector('.upload-container').style.backgroundSize = 'cover';
            document.querySelector('.upload-container').style.backgroundPosition = 'center';
            document.querySelector('.upload-icon').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

