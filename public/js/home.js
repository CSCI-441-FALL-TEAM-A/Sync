// ------------------ Page Initialization ------------------

document.addEventListener("DOMContentLoaded", async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.error('User ID not found. Redirecting to login...');
        window.location.href = '../index.html'; // Redirect if necessary
    }

    try {
        await Promise.all([loadGenresAndInstruments(), loadProfiles(), loadUserMatches(userId)]);
        displayProfile(currentProfileIndex);
    } catch (error) {
        console.error("Error during initialization:", error);
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
let userMatches = [];

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
        const userId = sessionStorage.getItem('userId');
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
                email: user.email,
                roleName
            };
        }));

        // Filter out the current user's profile
        profiles = profiles.filter(profile => profile.user_id !== userId);

        console.log(profiles);
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


/**
 * Load all matches and filter those relevant to the current user.
 * @param {number} userId - ID of the current user.
 */
async function loadUserMatches(userId) {
    try {
        const response = await fetch('/api/matches');
        if (!response.ok) throw new Error('Failed to fetch matches');

        const allMatches = await response.json(); 
        
        // Filter matches where the user is involved
        userMatches = allMatches.filter(
            match => match.user_id_one === userId || match.user_id_two === userId
        );
    } catch (error) {
        console.error("Error loading matches:", error);
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

     // Select instruments and proficiency level sections
     const instrumentsSection = document.querySelector(".instruments-section");
     const proficiencyLevelSection = document.querySelector(".proficiency-level-section");
 
     if (profile.roleName === "Musician") {
         instrumentsSection.style.display = "block";
         proficiencyLevelSection.style.display = "block";
 
         // Display instruments
         const instrumentsContainer = document.getElementById("user-instruments");
         instrumentsContainer.innerHTML = ""; // Clear previous instruments
         profile.instruments.forEach(instrument => {
             const instrumentBadge = document.createElement("span");
             instrumentBadge.classList.add("badge-option", "home");
             instrumentBadge.textContent = instrument.name;
             instrumentsContainer.appendChild(instrumentBadge);
         });
 
         // Display proficiency level
         document.getElementById("user-proficiency").textContent = profile.proficiency_level || 'None';
     } else {
         // Hide instruments and proficiency level sections if not a musician
         instrumentsSection.style.display = "none";
         proficiencyLevelSection.style.display = "none";
     }
}


// ------------------ Like/Dislike Match Functions ------------------

/**
 * Handle the "like" action for the current profile.
 */
async function swipeLike() {
    if (!profiles.length) return; // Ensure profiles array exists

    const currentUser = sessionStorage.getItem('userId');
    const targetUser = profiles[currentProfileIndex].user_id;

    try {
        const match = await getMatch(currentUser, targetUser);

        if (match) {
            const statusName = await getMatchStatusById(match.status); // Get status name by ID

            if (statusName === "Unmatched") {
                await updateMatchStatus(match.id, 2);
            } else if (statusName === "Denied") {
                console.log("Action ignored due to denied status");
            }
        } else {
            const newMatch = await createMatch(currentUser, targetUser, "Unmatched");
            userMatches.push(newMatch); // Add new match to the local array
        }
    } catch (error) {
        console.error("Error handling like action:", error);
    }

    moveToNextProfile();
}

/**
 * Handle the "dislike" action for the current profile.
 */
async function swipeDislike() {
    if (!profiles.length) return; // Ensure profiles array exists

    const currentUser = sessionStorage.getItem('userId');
    const targetUser = profiles[currentProfileIndex].user_id;

    try {
        const match = await getMatch(currentUser, targetUser);

        if (match) {
            const statusName = await getMatchStatusById(match.status); // Get status name by ID

            if (statusName === "Unmatched") {
                await updateMatchStatus(match.id, 3);
            } else if (statusName === "Denied") {
                console.log("Action ignored due to denied status");
            }
        } else {
            const newMatch = await createMatch(currentUser, targetUser, "Denied");
            userMatches.push(newMatch); // Add new match to the local array
        }
    } catch (error) {
        console.error("Error handling dislike action:", error);
    }

    moveToNextProfile();
}

/**
 * Move to the next profile in the list.
 */
function moveToNextProfile() {
    disableButtons();
    currentProfileIndex = (currentProfileIndex + 1) % profiles.length;
    setTimeout(() => {
        displayProfile(currentProfileIndex);
        enableButtons();
    }, 500);
}

// ------------------ API Helper Functions ------------------

/**
 * Fetch the current match between two users.
 * @param {number} userIdOne - ID of the first user (current user).
 * @param {number} userIdTwo - ID of the second user (target user).
 * @returns {object|null} Match object if exists, null otherwise.
 */
function getMatch(userIdOne, userIdTwo) {
    return userMatches.find(
        match =>
            (match.user_id_one === userIdOne && match.user_id_two === userIdTwo) ||
            (match.user_id_one === userIdTwo && match.user_id_two === userIdOne)
    ) || null;
}

/**
 * Update the status of an existing match.
 * @param {number} matchId - ID of the match to update.
 * @param {string} status - New status for the match.
 */
async function updateMatchStatus(matchId, status) {
    try {
        const response = await fetch(`/api/matches/${matchId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: status })
        });

        if (!response.ok) {
            throw new Error("Failed to update match status");
        }

        const updatedMatch = await response.json(); // Get the updated match from the response
        return updatedMatch;
    } catch (error) {
        console.error("Error updating match status:", error);
        throw error;
    }
}

/**
 * Create a new match between two users.
 * @param {number} userIdOne - ID of the first user (current user).
 * @param {number} userIdTwo - ID of the second user (target user).
 * @param {string} statusName - Name of the status (e.g., "Unmatched").
 */
async function createMatch(userIdOne, userIdTwo, statusName) {
    try {
        // Fetch the match status ID by name
        const statusResponse = await fetch(`/api/match-statuses/name/${statusName}`);
        if (!statusResponse.ok) {
            throw new Error(`Failed to fetch match status for: ${statusName}`);
        }

        const { id: statusId } = await statusResponse.json(); // Extract the numeric ID

        // Proceed to create the match with the numeric status ID
        const response = await fetch("/api/matches/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id_one: userIdOne,
                user_id_two: userIdTwo,
                status: statusId, // Use numeric status ID
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create match");
        }

        const newMatch = await response.json();
        return newMatch;
    } catch (error) {
        console.error("Error creating match:", error);
        throw error;
    }
}

async function getMatchStatusById(statusId) {
    try {
        const response = await fetch(`/api/match-statuses/id/${statusId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch match status for ID: ${statusId}`);
        }

        const matchStatus = await response.json();
        return matchStatus.name; // Return the name of the status (e.g., "Unmatched")
    } catch (error) {
        console.error("Error fetching match status by ID:", error);
        throw error;
    }
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
