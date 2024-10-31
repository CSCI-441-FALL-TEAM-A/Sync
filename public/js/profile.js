document.addEventListener("DOMContentLoaded", async () => {
    const userId = sessionStorage.getItem('userId');
    let savedGenres = JSON.parse(sessionStorage.getItem('selectedGenres'));

    if (userId) {
        await fetchUserData(userId);
    }

    // Load saved genres if available; initialize selectedGenres with this data
    selectedGenres = new Set(savedGenres || []);

    // Clear session storage to avoid issues with previous sessions
    sessionStorage.removeItem('selectedGenres');

    fetchGenres();
    toggleInstrumentPage();
});

// Function to fetch user data by ID
async function fetchUserData(userId) {
    try {
        // Fetch user information (includes user_type ID)
        const userResponse = await fetch(`/api/users/${userId}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        
        const user = await userResponse.json();
        const roleId = user.user_type; // Assuming this is the user_type ID

        // Fetch the role name using the role ID
        const roleName = await fetchRoleNameById(roleId);
        
        // Fetch profile information to get other profile-specific fields
        await fetchProfileData(userId, roleName);
        
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Function to fetch role name by ID
async function fetchRoleNameById(roleId) {
    try {
        const userTypeResponse = await fetch(`/api/user-types/id/${roleId}`);
        if (!userTypeResponse.ok) throw new Error('Failed to fetch user type by ID');
        
        const userType = await userTypeResponse.json();
        return userType.name; // Assuming the response contains the role name
    } catch (error) {
        console.error("Error fetching user type name:", error);
        return null;
    }
}

// Function to fetch profile data with ID
async function fetchProfileData(userId, roleName) {
    try {
        // Fetch profile information
        const profileResponse = await fetch(`/api/profiles/user/${userId}`);
        if (!profileResponse.ok) throw new Error('Failed to fetch profile data');
        
        const profile = await profileResponse.json();
        sessionStorage.setItem('profileId', profile.id);
        profile.roleName = roleName; // Add role name to profile data

        console.log(profile);

        populateProfileFields(profile); // Pass the profile with updated role name
    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
}


// Function to display current profile information
function populateProfileFields(profile) {
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    const profilePic = profile.picture || "../../images/default_avatar.jpg";
    const bio = profile.bio || '';
    const gender = profile.gender || '';
    const roleName = profile.roleName || '';  // Use the role name we fetched

    // Set the user info fields
    document.getElementById('user-name').textContent = `${firstName} ${lastName}`;
    document.getElementById('profile-picture').src = profilePic;
    document.getElementById('firstname').value = firstName;
    document.getElementById('lastname').value = lastName;
    document.getElementById('bio').value = bio;
    document.getElementById('gender').value = gender;

    // Set the role dropdown value using the role name
    const roleDropdown = document.getElementById('role');
    roleDropdown.value = roleName;

    // Update selected genres based on fetched profile data
    selectedGenres.clear();
    profile.genres.forEach(genre => {
        selectedGenres.add(genre.id);
        addSelectedGenreTag(genre);
    });

    updateGenresButton();  // Update the genres button with selected genres
    saveSelectedGenres(); // Save the fetched genres to sessionStorage
}


// Function to update the genres button text
function updateGenresButton() {
    const genreNames = Array.from(selectedGenres).map(id => {
        const genreOption = document.querySelector(`[data-genre-id="${id}"]`);
        return genreOption ? genreOption.textContent : '';
    }).filter(name => name !== '');

    // Set the button text to display selected genres
    const genresButtonText = document.getElementById('genres-button-text');
    genresButtonText.textContent = genreNames.length > 0 ? genreNames.join(', ') : "Select Genres";
}


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

// Update user profile data
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
    const roleName = document.getElementById('role').value; // Get role name from dropdown
    const genres = Array.from(selectedGenres);

    if (!firstName) {
        alert("First name is required.");
        return;
    }

    try {
        // Get role ID based on the role name
        const roleId = await getUserTypeIdByName(roleName);
        if (!roleId) {
            alert("Invalid role selected.");
            return;
        }

        // Prepare data to update in User model (first name, last name, and role ID)
        const userData = {
            first_name: firstName,
            last_name: lastName,
            user_type: roleId // Use role ID instead of role name
        };

        // Prepare data to update in Profile model (bio, gender, and genres)
        const profileData = {
            bio,
            gender,
            genres
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
            sessionStorage.removeItem('selectedGenres'); // Clear saved genres after successful update
            await fetchUserData(userId); // Refresh profile data after update
        } else {
            console.error("Failed to update profile:", profileResponse.statusText);
            alert("Failed to update profile");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}



// Fetch genres from the backend and display them
async function fetchGenres() {
    try {
        const response = await fetch('/api/genres');
        if (!response.ok) throw new Error('Failed to fetch genres');
        
        const genres = await response.json();
        displayGenres(genres);
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

// Display genres function with selected genres marked
function displayGenres(genres) {
    const genreOptionsContainer = document.getElementById('genre-options');
    genreOptionsContainer.innerHTML = ''; // Clear existing options

    genres.forEach(genre => {
        const option = document.createElement('div');
        option.classList.add('badge-option');
        option.textContent = genre.name;
        option.dataset.genreId = genre.id;

        // Mark as selected if in `selectedGenres`
        if (selectedGenres.has(genre.id)) {
            option.classList.add('selected');
            addSelectedGenreTag(genre);
        }

        // Toggle selection on click, respecting the limit
        option.addEventListener('click', () => toggleGenreSelection(option, genre));
        genreOptionsContainer.appendChild(option);
    });
}

// Save selected genres to sessionStorage immediately after each change
function saveSelectedGenres() {
    sessionStorage.setItem('selectedGenres', JSON.stringify(Array.from(selectedGenres)));
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

    updateGenresButton();  // Update the button text
    saveSelectedGenres();  // Save changes to sessionStorage
}


// Add selected genre tag
function addSelectedGenreTag(genre) {
    const tag = document.createElement('div');
    tag.classList.add('selected-badge');
    tag.textContent = genre.name;
    tag.dataset.genreId = genre.id;

    // Add "x" icon only for managing selected genres
    const removeIcon = document.createElement('span');
    removeIcon.textContent = '×';
    removeIcon.onclick = () => {
        selectedGenres.delete(genre.id);
        tag.remove();
        document.querySelector(`.badge-option[data-genre-id="${genre.id}"]`).classList.remove('selected');
        updateGenresButton();  // Update button text to reflect changes
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

// Additional utility functions
function toggleInstrumentPage() {
    const roleDropdown = document.getElementById('role');
    const instrumentSection = document.getElementById('instrument-section');
    instrumentSection.style.display = roleDropdown.value === "Musician" ? "block" : "none";
}

function showPage(pageId) {
    document.querySelectorAll('.form-step').forEach(section => section.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

// Logout of user profile
function logout() {
    sessionStorage.removeItem('userId'); // Clear session storage on logout
    localStorage.removeItem('userId');
    window.location.href = '../../index.html';
    alert("You have been logged out.");
}
