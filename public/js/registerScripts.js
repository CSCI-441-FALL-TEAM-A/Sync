// Get the form element
const registrationForm = document.getElementById('registration-form');

// Add an event listener to handle form submission
registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const email = document.getElementById('email').value;
    const day = document.getElementById('day').value;
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const birthday = new Date(year, month - 1, day);
    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value || '';
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

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
        user_type: 1 // Assuming 1 is a default user type in your system
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
            const data = await response.json();
            console.log('Registration successful:', data);
        } else {
            const error = await response.json();
            console.error('Error registering user:', error);
        }
    } catch (err) {
        console.error('Network error:', err);
    }
});