document.addEventListener("DOMContentLoaded", () => {
    // Clear any existing user ID in local and session storage
    sessionStorage.removeItem('userId');
    localStorage.removeItem('userId');
});

// Get the form element
const registrationForm = document.getElementById('registration-form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

// Define the submit handler function
async function handleRegistrationSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const email = document.getElementById('email').value;
    const day = document.getElementById('day').value;
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const birthday = new Date(year, month - 1, day);
    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value || '';
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Prepare the payload for registration
    const payload = {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
        birthday: birthday.toISOString(),
        user_type: 1
    };

    try {
        // Send the registration data to the server
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // Check the response from the server
        if (response.ok) {
            // Registration successful, get user data and store userId
            const result = await response.json();
            sessionStorage.setItem('userId', result.id); // Save user ID for later
            localStorage.setItem('userId', result.id);  // Store in localStorage as backup


            // Registration successful, redirect to profile setup page
            window.location.href = '../profile/profile_setup.html';
        } else {
            // Get the error message from the server response
            const error = await response.json();
            console.error('Error registering user:', error);

            // Check if error message is related to duplicate email
            if (error.message.includes('already exists')) {
                alert('This email is already registered. Please log in or use a different email.');
            } else {
                alert('Registration failed: ' + error.message);
            }
        }
    } catch (err) {
        console.error('Network error:', err);
        alert('Network error. Please try again later.');
    }
}

// Remove any existing 'submit' listener to prevent duplicates
registrationForm.removeEventListener('submit', handleRegistrationSubmit);

// Attach the 'submit' event listener to the form
registrationForm.addEventListener('submit', handleRegistrationSubmit);



// Real-time password matching feedback
confirmPasswordInput.addEventListener('input', () => {
    const matchMessage = document.getElementById('match-message') || createMatchMessage();

    if (passwordInput.value === confirmPasswordInput.value) {
        matchMessage.textContent = 'Passwords match';
        matchMessage.style.color = 'green';
    } else {
        matchMessage.textContent = 'Passwords do not match';
        matchMessage.style.color = 'red';
    }
});
// Helper to create a match message element if not already present
function createMatchMessage() {
    const matchMessage = document.createElement('p');
    matchMessage.id = 'match-message';
    confirmPasswordInput.parentNode.insertBefore(matchMessage, confirmPasswordInput.nextSibling);
    return matchMessage;
}
