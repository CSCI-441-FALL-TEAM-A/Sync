// ------------------ Page Initialization ------------------

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await loadGenresAndInstruments();
        await loadProfiles();
        displayProfile(currentProfileIndex);
    } catch (error) {
        console.error("Error loading profiles:", error);
    }

    // Add event listeners after DOMContentLoaded
    document.querySelector(".btn.like").addEventListener("click", swipeLike);
    document.querySelector(".btn.dislike").addEventListener("click", swipeDislike);
    document.getElementById("user-card").addEventListener("click", showUserDetails);
});

// ------------------ Variables ------------------

let profiles = [];
let currentProfileIndex = 0;
let allGenres = [];
let allInstruments = [];

// ------------------ Load Data Functions ------------------

/**
 * Load all genres and instruments from the backend.
 */
async function loadGenresAndInstruments() {
    try {
        const [genresResponse, instrumentsResponse] = await Promise.all([
            fetch('/api/genres'),
            fetch('/api/instruments')
        ]);

        if (!genresResponse.ok || !instrumentsResponse.ok) {
            throw new Error('Failed to fetch genres or instruments');
        }

        allGenres = await genresResponse.json();
        allInstruments = await instrumentsResponse.json();
    } catch (error) {
        console.error("Error loading genres and instruments:", error);
    }
}

/**
 * Fetch all profiles by individually calling `getProfileById` to ensure complete data.
 */
async function loadProfiles() {
    try {
        const allProfilesResponse = await fetch('/api/profiles');
        if (!allProfilesResponse.ok) throw new Error('Failed to fetch profiles');

        const basicProfiles = await allProfilesResponse.json();

        // Fetch detailed user and profile data
        profiles = await Promise.all(basicProfiles.map(async basicProfile => {
            const userResponse = await fetch(`/api/users/${basicProfile.user_id}`);
            if (!userResponse.ok) throw new Error(`Failed to fetch user with id ${basicProfile.user_id}`);
            
            const user = await userResponse.json();
            const roleName = await fetchRoleNameById(user.user_type);

            // Fetch profile details
            const profileResponse = await fetch(`/api/profiles/${basicProfile.id}`);
            if (!profileResponse.ok) throw new Error(`Failed to fetch profile with id ${basicProfile.id}`);
            
            const detailedProfile = await profileResponse.json();

            return {
                ...detailedProfile,
                roleName
            };
        }));

        console.log("Detailed Profiles loaded:", profiles);
    } catch (error) {
        console.error("Error loading profiles:", error);
    }
}

/**
 * Fetch role name by role ID.
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


// ------------------ Display Profile Functions ------------------

function displayProfile(index) {
    if (profiles.length === 0) return;

    const profile = profiles[index];

    // Set profile information in HTML
    document.getElementById("user-name").textContent = `${profile.first_name} ${profile.last_name}`;
    document.getElementById("user-role").textContent = profile.roleName || 'Unknown Role';
    document.getElementById("user-bio").textContent = profile.bio || 'No bio available';

    // Display genres
    const genresContainer = document.getElementById("user-genres");
    genresContainer.innerHTML = ""; // Clear previous genres
    profile.genres.forEach(genre => {
        const genreBadge = document.createElement("span");
        genreBadge.classList.add("badge-option", "home");
        genreBadge.textContent = genre.name;
        genresContainer.appendChild(genreBadge);
    });

    // Display profile details in the overlay
    document.getElementById("details-user-name").textContent = `${profile.first_name} ${profile.last_name}`;
    document.getElementById("details-user-role").textContent = profile.roleName || 'Unknown Role';

    // Display genres in the overlay
    const detailsGenresContainer = document.getElementById("details-user-genres");
    detailsGenresContainer.innerHTML = ""; // Clear previous genres
    profile.genres.forEach(genre => {
        if (genre) {
            const genreBadge = document.createElement("span");
            genreBadge.classList.add("badge-option", "home");
            genreBadge.textContent = genre.name;
            detailsGenresContainer.appendChild(genreBadge);
        }
    });

    // Display instruments
    const instrumentsContainer = document.getElementById("user-instruments");
    instrumentsContainer.innerHTML = ""; // Clear previous instruments
    profile.instruments.forEach(instrument => {
        const instrumentBadge = document.createElement("span");
        instrumentBadge.classList.add("badge-option", "home");
        instrumentBadge.textContent = instrument.name;
        instrumentsContainer.appendChild(instrumentBadge);
    });

    // Display proficiency level if available
    document.getElementById("user-proficiency").textContent = profile.proficiency_level || 'None';
}


// ------------------ Swipe Functionality ------------------

/**
 * Handle the "like" action and then navigate to the next profile.
 */
function swipeLike() {
    if (!profiles.length) return;  // Ensure profiles array exists

    disableButtons();  // Temporarily disable buttons
    displayActionMessage("Liked"); // Display the like message for the current profile

    // Increment index with bounds check
    currentProfileIndex = (currentProfileIndex + 1) % profiles.length;

    setTimeout(() => {
        displayProfile(currentProfileIndex);  // Display the next profile after delay
        enableButtons();  // Re-enable buttons
    }, 500);
}

/**
 * Handle the "dislike" action and then navigate to the next profile.
 */
function swipeDislike() {
    if (!profiles.length) return;  // Ensure profiles array exists

    disableButtons();  // Temporarily disable buttons
    displayActionMessage("Disliked"); // Display the dislike message for the current profile

    // Increment index with bounds check
    currentProfileIndex = (currentProfileIndex + 1) % profiles.length;

    setTimeout(() => {
        displayProfile(currentProfileIndex);  // Display the next profile after delay
        enableButtons();  // Re-enable buttons
    }, 500);
}

/**
 * Display a message for the current profile.
 * @param {string} action - The action performed (like or dislike).
 */
function displayActionMessage(action) {
    const profile = profiles[currentProfileIndex];
    const message = `${action} profile: ${profile.first_name} ${profile.last_name}`;

    document.getElementById('action-message').style.display = 'flex';
    const actionMessageElement = document.getElementById("action-message");
    actionMessageElement.textContent = message;
    
    // Clear message after a delay matching profile transition
    setTimeout(() => {
        actionMessageElement.textContent = ""; 
        document.getElementById('action-message').style.display = 'none';
    }, 500); 
}

/**
 * Disable the like/dislike buttons to prevent rapid consecutive clicks.
 */
function disableButtons() {
    document.querySelector(".btn.like").disabled = true;
    document.querySelector(".btn.dislike").disabled = true;
}

/**
 * Enable the like/dislike buttons after profile transition completes.
 */
function enableButtons() {
    document.querySelector(".btn.like").disabled = false;
    document.querySelector(".btn.dislike").disabled = false;
}


// ------------------ Event Listeners ------------------

document.querySelector(".btn.like").addEventListener("click", swipeLike);
document.querySelector(".btn.dislike").addEventListener("click", swipeDislike);
document.getElementById("user-card").addEventListener("click", showUserDetails);

// Function to show the detailed user view
function showUserDetails() {
    document.getElementById('user-details-overlay').style.display = 'flex';
}

function hideUserDetails() {
    document.getElementById('user-details-overlay').style.display = 'none';
}

document.querySelector(".btn.prev").addEventListener("click", hideUserDetails);
