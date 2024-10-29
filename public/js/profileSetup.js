// Submit handler for profile setup form
async function handleProfileSetupSubmit(event) {
    event.preventDefault();

    // Gather form data
    const gender = document.getElementById('gender').value;
    const role = document.querySelector('input[name="role"]:checked')?.value;
    const skillLevel = document.querySelector('input[name="skill_level"]:checked')?.value;
    const preferredGender = document.getElementById('preferred_gender').value;
    const profileImage = document.getElementById('profile_image').files[0];

    // Convert selected instruments and genres to arrays
    const instruments = Array.from(selectedInstruments);
    const genres = Array.from(selectedGenres);

    // If the user selected "Groupie," ensure skill level and at least one instrument are not gathered for 


    // Validate required selections
    if (!gender || !role || !preferredGender || genres.length === 0) {
        alert('Please complete all required selections: gender, role, preferred gender, and genres.');
        return;
    }

    // If the user selected "Musician," ensure skill level and at least one instrument are selected
    if (role === 'Musician' && (!skillLevel || instruments.length === 0)) {
        alert('Please select your skill level and at least one instrument.');
        return;
    }

    // Prepare FormData for submission
    const formData = new FormData();
    formData.append('gender', gender);
    formData.append('role', role);
    formData.append('preferred_gender', preferredGender);
    formData.append('genres', JSON.stringify(genres));

    // Only add skill level and instruments if the user is a musician
    if (role === 'Musician') {
        formData.append('skill_level', skillLevel);
        formData.append('instruments', JSON.stringify(instruments));
    }

    // Add profile image if available
    if (profileImage) {
        formData.append('profile_image', profileImage);
    }

    try {
        const response = await fetch('/api/profile/setup', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert('Profile setup completed successfully!');
            window.location.href = '../home.html';
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Submission failed:', error);
        alert('An error occurred. Please try again.');
    }
}

// Attach the form submission listener
document.getElementById('profile-setup-form').addEventListener('submit', handleProfileSetupSubmit);


// TODO: Make a getAllInstruments and getAllGenres in backend

// document.addEventListener('DOMContentLoaded', async () => {
//     // Fetch instruments from the backend
//     const response = await fetch('/api/instruments');
//     const instruments = await response.json();
//     displayInstruments(instruments);
// });
document.addEventListener('DOMContentLoaded', async () => {
    // Mock data for testing
    const mockInstruments = [
        { id: 1, name: 'Guitar' },
        { id: 2, name: 'Drums' },
        { id: 3, name: 'Piano' },
        { id: 4, name: 'Flute' },
        { id: 5, name: 'Violin' },
        { id: 6, name: 'Saxophone' },
        { id: 7, name: 'Bass' },
        { id: 8, name: 'Trumpet' },
        { id: 9, name: 'Cello' },
        { id: 10, name: 'Harp' }
    ];

    displayInstruments(mockInstruments);
});
// Function to display instruments
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



// document.addEventListener('DOMContentLoaded', async () => {
//     // Fetch genres from the backend
//     const response = await fetch('/api/genres');
//     const genres = await response.json();
//     displayGenres(genres);
// });
document.addEventListener('DOMContentLoaded', () => {
    // Dummy genres for testing
    const dummyGenres = [
        { id: 1, name: 'Rock' },
        { id: 2, name: 'Jazz' },
        { id: 3, name: 'Classical' },
        { id: 4, name: 'Pop' },
        { id: 5, name: 'Hip-Hop' },
        { id: 6, name: 'Electronic' },
        { id: 7, name: 'Country' },
        { id: 8, name: 'Blues' },
        { id: 9, name: 'Reggae' },
        { id: 10, name: 'Latin' }
    ];
    
    displayGenres(dummyGenres);
});
// Function to display genres
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
        
        // Find the closest .info-text element within the same section
        const section = event.currentTarget.closest('.form-step');
        const infoParagraph = section.querySelector('.info-text');
        
        if (infoParagraph) {
            infoParagraph.textContent = infoText;
            infoParagraph.style.display = 'block'; // Show the info text
        }
    });
    
    icon.addEventListener('mouseleave', (event) => {
        // Hide the info text on mouse leave
        const section = event.currentTarget.closest('.form-step');
        const infoParagraph = section.querySelector('.info-text');
        
        if (infoParagraph) {
            infoParagraph.style.display = 'none';
        }
    });
});




// Preview Images 
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


