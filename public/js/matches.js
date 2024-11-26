// ------------------ Page Initialization ------------------

document.addEventListener("DOMContentLoaded", async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.error('User ID not found. Redirecting to login...');
        window.location.href = '/index.html'; // Redirect if necessary
    }

    try {
        await Promise.all([loadGenresAndInstruments(), loadProfiles(), loadUserMatches(userId)]);
        await loadProfiles(); 
        renderMatches(); 
    } catch (error) {
        console.error("Error during initialization:", error);
    }
});

// ------------------ Variables ------------------

let profiles = [];
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
 * Load all matches and filter those relevant to the current user.
 * @param {number} userId - ID of the current user.
 */
async function loadUserMatches(userId) {
    try {
        const response = await fetch('/api/matches');
        if (!response.ok) throw new Error('Failed to fetch matches');

        const allMatches = await response.json(); 
        
        // Filter matches where the user is involved and status is "Matched" (ID: 2)
        userMatches = allMatches.filter(
            match => (match.user_id_one === userId && match.status === 2) || (match.user_id_two === userId && match.status === 2)
        );
    } catch (error) {
        console.error("Error loading matches:", error);
    }
}

/**
 * Fetch profiles only for matched users.
 */
async function loadProfiles() {
    try {
        // Extract all matched user IDs from userMatches
        const matchedUserIds = userMatches.map(match =>
            match.user_id_one === sessionStorage.getItem('userId') ? match.user_id_two : match.user_id_one
        );

        // Fetch detailed user and profile data for each matched user
        profiles = await Promise.all(matchedUserIds.map(async userId => {
            const userResponse = await fetch(`/api/users/${userId}`);
            if (!userResponse.ok) throw new Error(`Failed to fetch user with id ${userId}`);
            
            const user = await userResponse.json(); 
            const roleName = await fetchRoleNameById(user.user_type);

            // Fetch profile details
            const profileResponse = await fetch(`/api/profiles/user/${userId}`);
            if (!profileResponse.ok) throw new Error(`Failed to fetch profile for user ID: ${userId}`);
            
            const detailedProfile = await profileResponse.json();

            return {
                ...detailedProfile,
                email: user.email,
                roleName
            };
        }));
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

/**
 * Render all matched user profiles as cards.
 */
function renderMatches() {
    const matchesContainer = document.querySelector("#matches-container .matches-grid");

    // Clear existing content
    matchesContainer.innerHTML = "";

    // Loop through each matched profile and create a card
    profiles.forEach(profile => {
        const card = document.createElement("div");
        card.classList.add("match-card");

        // Profile picture
        const matchPic = document.createElement("div");
        matchPic.classList.add("match-pic");
        const img = document.createElement("img");
        img.src = profile.profile_picture || "../../images/default_avatar.jpg"; // Default image if none
        img.alt = `${profile.first_name} ${profile.last_name}`;
        matchPic.appendChild(img);

        // Profile info
        const matchInfo = document.createElement("div");
        matchInfo.classList.add("match-info");
        matchInfo.addEventListener("click", () => showUserDetails(profile)); // Show user details on click
        const name = document.createElement("h3");
        name.textContent = `${profile.first_name} ${profile.last_name}`;
        const bio = document.createElement("p");
        bio.textContent = "Click to view profile";
        matchInfo.appendChild(name);
        matchInfo.appendChild(bio);

        // Chat button
        const btnChatContainer = document.createElement("div");
        btnChatContainer.classList.add("btn-chat-container");
        const btnChat = document.createElement("a"); // Use <a> instead of <button>
        btnChat.classList.add("btn", "chat");

        // Construct the mailto link with subject and body
        const subject = encodeURIComponent("Message from your Sync Match!");
        const body = encodeURIComponent(
            `Hi ${profile.first_name},\n\nI just matched with you on Sync and wanted to reach out! Looking forward to chatting more.\n\nBest regards,`
        );

        btnChat.href = `mailto:${profile.email}?subject=${subject}&body=${body}`; // Set the mailto link
        btnChat.innerHTML = '<span class="material-symbols-rounded">chat</span>';
        btnChatContainer.appendChild(btnChat);

        // Append all components to the card
        card.appendChild(matchPic);
        card.appendChild(matchInfo);
        card.appendChild(btnChatContainer);

        // Add card to the grid
        matchesContainer.appendChild(card);
    });
}

function showUserDetails(profile) {
    // Set user details in the overlay
    document.getElementById("details-user-name").textContent = `${profile.first_name} ${profile.last_name}`;
    document.getElementById("details-user-role").textContent = profile.roleName || "Unknown Role";
    document.getElementById("user-bio").textContent = profile.bio || "No bio available";

    // Set profile picture in overlay
    const detailedImage = document.querySelector(".detailed-image");
    detailedImage.style.backgroundImage = `url(${profile.profile_picture || "../../images/default_avatar.jpg"})`;

    // Display genres
    const genresContainer = document.getElementById("details-user-genres");
    genresContainer.innerHTML = ""; // Clear previous genres
    profile.genres.forEach(genre => {
        const genreBadge = document.createElement("span");
        genreBadge.classList.add("badge-option", "home");
        genreBadge.textContent = genre.name;
        genresContainer.appendChild(genreBadge);
    });

    // Instruments section
    const instrumentsSection = document.querySelector(".instruments-section");
    const proficiencyLevelSection = document.querySelector(".proficiency-level-section");

    if (profile.roleName === "Musician") {
        instrumentsSection.style.display = "block";
        proficiencyLevelSection.style.display = "block";

        const instrumentsContainer = document.getElementById("user-instruments");
        instrumentsContainer.innerHTML = ""; // Clear previous instruments
        profile.instruments.forEach(instrument => {
            const instrumentBadge = document.createElement("span");
            instrumentBadge.classList.add("badge-option", "home");
            instrumentBadge.textContent = instrument.name;
            instrumentsContainer.appendChild(instrumentBadge);
        });

        document.getElementById("user-proficiency").textContent = profile.proficiency_level || "None";
    } else {
        instrumentsSection.style.display = "none";
        proficiencyLevelSection.style.display = "none";
    }

    // Show the overlay
    document.getElementById("user-details-overlay").style.display = "flex";
}


// ------------------ Event Listeners ------------------

// Function to hide the detailed user view
function hideUserDetails() {
    document.getElementById('user-details-overlay').style.display = 'none';
}

document.querySelector(".btn.prev").addEventListener("click", hideUserDetails);