// document.addEventListener("DOMContentLoaded", () => {
//     const userId = sessionStorage.getItem('userId') || '1'; // Replace '1' with actual user ID or fetch dynamically if available
//     fetchProfileData(userId);
// });

// async function fetchProfileData(userId) {
//     try {
//         const response = await fetch(`/api/profile/${userId}`);
//         if (!response.ok) {
//             throw new Error('Failed to fetch profile data');
//         }
//         const profile = await response.json();
//         populateProfileFields(profile);
//     } catch (error) {
//         console.error("Error fetching profile data:", error);
//     }
// }


document.addEventListener("DOMContentLoaded", () => {
    // Dummy data to simulate a user profile response
    const dummyProfile = {
        id: 1,
        first_name: "Johnathan",
        last_name: "Stone",
        bio: "Adventurous soul with a passion for exploring new places and trying exotic cuisines.",
        gender: "Male",
        role: "Musician",
        genres: ["Rock", "Hip-Hop", "Classical"],
        picture: "../../images/test-user-img.jpeg", 
    };

    // Populate fields with dummy data
    populateProfileFields(dummyProfile);
});


function populateProfileFields(profile) {
    // Populate profile fields on the main profile page
    document.getElementById('user-name').textContent = `${profile.first_name} ${profile.last_name}`;
    document.getElementById('profile-picture').src = profile.picture || "../../images/default_avatar.jpg"; // Default image if none provided

    // Populate fields on the edit profile page
    document.getElementById('full-name').value = `${profile.first_name} ${profile.last_name}`;
    document.getElementById('bio').value = profile.bio || '';
    document.getElementById('gender').value = profile.gender || '';
    document.getElementById('role').value = profile.role || '';

    // Populate genres
    const genresButton = document.querySelector('.edit-genres-button');
    genresButton.textContent = profile.genres ? profile.genres.join(', ') : "No genres selected";
}

async function updateProfile() {
    const userId = sessionStorage.getItem('userId') || '1';
    const fullName = document.getElementById('full-name').value.split(' ');
    const updatedData = {
        first_name: fullName[0],
        last_name: fullName[1] || '',
        bio: document.getElementById('bio').value,
        gender: document.getElementById('gender').value,
        role: document.getElementById('role').value,
    };

    try {
        const response = await fetch(`/api/profile/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        
        if (response.ok) {
            alert("Profile updated successfully!");
        } else {
            alert("Failed to update profile");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}


function updateSettings() {
    alert("Settings have been updated successfully!");
}

function showPage(pageId) {
    // Hide all sections
    document.querySelectorAll('.form-step').forEach(section => section.style.display = 'none');
    // Show the selected section
    document.getElementById(pageId).style.display = 'block';
}

function logout() {
    window.location.href = '../../index.html';
    alert("You have been logged out.");
}

function toggleInstrumentPage() {
    const roleDropdown = document.getElementById('role');
    const instrumentSection = document.getElementById('instrument-section');

    // Show the instrument section only if "Musician" is selected
    if (roleDropdown.value === "Musician") {
        instrumentSection.style.display = "block";
    } else {
        instrumentSection.style.display = "none";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    toggleInstrumentPage();
});
