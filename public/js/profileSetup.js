// Ensure userId is retrieved correctly on page load
document.addEventListener("DOMContentLoaded", () => {
    let userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
    
    if (!userId) {
        console.error("Error: userId not found in sessionStorage or localStorage.");
        alert("User not logged in. Please log in to set up your profile.");
        window.location.href = "../login.html";
        return;
    } else {
        sessionStorage.setItem('userId', userId);
        localStorage.setItem('userId', userId);
    }

    // Attach form submission listener
    document.getElementById('profile-setup-form').addEventListener('submit', handleProfileSetupSubmit);

    // Fetch instruments and genres from the backend and display them
    fetchInstruments();
    fetchGenres();
});

// Helper function to fetch user type ID by role name
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


async function handleProfileSetupSubmit(event) {
    event.preventDefault();

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.error("Error: userId not found in sessionStorage.");
        alert("User not logged in. Please log in to set up your profile.");
        window.location.href = "../login.html";
        return;
    }

    const roleName = document.querySelector('input[name="role"]:checked')?.value;
    const proficiencyLevelName = document.querySelector('input[name="skill_level"]:checked')?.value;
    let proficiencyLevelId = null;
    let roleId = null;

    // Fetch role ID by role name
    if (roleName) {
        roleId = await getUserTypeIdByName(roleName);
        if (!roleId) {
            alert("Invalid role selected. Please try again.");
            return;
        }
    }

    // Fetch proficiency level ID by name
    if (proficiencyLevelName) {
        try {
            const response = await fetch(`/api/proficiency-levels/name/${proficiencyLevelName}`);
            const proficiencyLevelData = await response.json();
            if (response.ok) {
                proficiencyLevelId = proficiencyLevelData.id;
            } else {
                console.error(`Error fetching proficiency level ID: ${proficiencyLevelData.message}`);
                alert("Error fetching proficiency level. Please try again.");
                return;
            }
        } catch (error) {
            console.error("Error fetching proficiency level:", error);
            alert("Error fetching proficiency level. Please try again.");
            return;
        }
    }

    // Gather form data as JSON object
    const data = {
        user_id: userId,
        gender: document.getElementById('gender').value,
        user_type: roleId, // Use the role ID here
        preferred_gender: document.getElementById('preferred_gender').value,
        genres: Array.from(selectedGenres),
        proficiency_level: roleName === 'Musician' ? proficiencyLevelId : null, // Only add if user is a Musician
        instruments: roleName === 'Musician' ? Array.from(selectedInstruments) : null // Only add if user is a Musician
    };

    try {
        const response = await fetch('/api/profiles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Error: ${text}`);
        }

        const responseData = await response.json();
        alert('Profile setup completed successfully!');
        window.location.href = '../home.html';
    } catch (error) {
        console.error('Submission failed:', error);
        alert('An error occurred. Please try again.');
    }
}


// Fetch instruments from the backend and display them
async function fetchInstruments() {
    try {
        const response = await fetch('/api/instruments');
        const instruments = await response.json();
        displayInstruments(instruments);
    } catch (error) {
        console.error('Error fetching instruments:', error);
    }
}

// Display instruments function
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

// Handle instrument selection
const selectedInstrumentsContainer = document.getElementById('selected-instruments');
let selectedInstruments = new Set();

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

// Add selected instrument tag
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

// Remove instrument tag when deselected
function removeSelectedInstrumentTag(instrumentId) {
    const tag = selectedInstrumentsContainer.querySelector(`[data-instrument-id="${instrumentId}"]`);
    if (tag) tag.remove();
}

// Filter instruments based on search input
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

// Fetch genres from the backend and display them
async function fetchGenres() {
    try {
        const response = await fetch('/api/genres');
        const genres = await response.json();
        displayGenres(genres);
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

// Display genres function
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

// Handle genre selection with limit
const selectedGenresContainer = document.getElementById('selected-genres');
let selectedGenres = new Set();

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

// Add selected genre tag
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

// Remove genre tag when deselected
function removeSelectedGenreTag(genreId) {
    const tag = selectedGenresContainer.querySelector(`[data-genre-id="${genreId}"]`);
    if (tag) tag.remove();
}

// Filter genres based on search input
function filterGenres() {
    const searchValue = document.getElementById('badge-search').value.toLowerCase();
    const genreOptions = document.querySelectorAll('.badge-option');

    genreOptions.forEach(option => {
        const genreName = option.textContent.toLowerCase();
        option.style.display = genreName.includes(searchValue) ? 'inline-block' : 'none';
    });
}

// Display information about terms
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

// Preview Image Functionality
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

// Skill Level Requirement Handling for Musicians
document.addEventListener("DOMContentLoaded", () => {
    const mainRoleSelection = document.querySelectorAll('input[name="role"]');
    const skillLevelRadios = document.querySelectorAll('input[name="skill_level"]');
    const skillLevelSection = document.getElementById('step-4');

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

    mainRoleSelection.forEach(radio => {
        radio.addEventListener("change", updateSkillLevelRequirement);
    });

    updateSkillLevelRequirement();
});
