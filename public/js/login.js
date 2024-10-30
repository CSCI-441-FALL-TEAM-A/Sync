document.addEventListener("DOMContentLoaded", () => {
    // Clear any existing user ID in local and session storage
    sessionStorage.removeItem('userId');
    localStorage.removeItem('userId');
});

// Select the login form
const loginForm = document.getElementById('login-form');

// Define the submit handler function
async function handleLoginFormSubmit(event) {
    event.preventDefault();

    // Gather form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
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

            // Redirect the user to the home page
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

// Remove any existing 'submit' listener on the login form
loginForm.removeEventListener('submit', handleLoginFormSubmit);

// Add the 'submit' event listener with the handler
loginForm.addEventListener('submit', handleLoginFormSubmit);
