// ------------------ Page Initialization ------------------

document.addEventListener("DOMContentLoaded", () => {
    // Clear any existing user ID in local and session storage
    sessionStorage.removeItem('userId');
    localStorage.removeItem('userId');
});

// ------------------ Element References ------------------

// Select the login form
const loginForm = document.getElementById('login-form');

// ------------------ Login Submission Handler ------------------

/**
 * Handle the login form submission event, authenticate the user, and manage login response.
 * @param {Event} event - The form submit event
 */
async function handleLoginFormSubmit(event) {
    event.preventDefault();

    // Gather login credentials from the form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Send login request to the server
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }), // Send email and password as JSON
        });

        if (response.ok) {
            const userData = await response.json();
            console.log('Login successful:', userData);

            if (userData.id) {
                // Store the userId in session storage for future reference
                sessionStorage.setItem('userId', userData.id);
                localStorage.setItem('userId', userData.id);  // Store in localStorage as backup
            } else {
                console.warn("User ID not found in response.");
            }

            // Redirect to the home page upon successful login
            window.location.href = '../home.html';
        } else {
            // If login fails, handle the error and notify the user
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('An error occurred. Please try again.');
    }
}

// ------------------ Event Listener Management ------------------

// Remove any existing 'submit' listener to prevent duplicates
loginForm.removeEventListener('submit', handleLoginFormSubmit);

// Attach the 'submit' event listener to form
loginForm.addEventListener('submit', handleLoginFormSubmit);
