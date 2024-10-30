// Switch between form steps
function nextStep(step) {
    const form = document.getElementById('registration-form') || document.getElementById('profile-setup-form');

    // Specific logic for age validation in the registration flow only
    if (form.id === 'registration-form' && step === 3 && !validateAge()) {
        return; // Stop if age validation fails
    }

    // Validate visible inputs in the current step only
    const currentStep = document.getElementById('step-' + (step - 1));
    const inputs = currentStep.querySelectorAll('input[required]:not([type="hidden"]), select[required]');

    for (let input of inputs) {
        if (input.offsetParent !== null && !input.checkValidity()) {
            input.reportValidity();
            return;
        }
    }

    // Skip steps based on role selection in profile setup form
    if (form.id === 'profile-setup-form' && currentStep.id === 'step-3') {  
        const roleInput = document.querySelector('input[name="role"]:checked');
        const role = roleInput ? roleInput.value : null;

        if (role === "Groupie") {
            step = 6; // Skip musician-specific steps if Groupie is selected
        }
    }

    const steps = document.getElementsByClassName('form-step');
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.display = 'none';
    }
    document.getElementById('step-' + step).style.display = 'block';
}


function prevStep(step) {
    const form = document.getElementById('registration-form') || document.getElementById('profile-setup-form');
    const roleInput = document.querySelector('input[name="role"]:checked');
    const role = roleInput ? roleInput.value : null;

    // Handle going back correctly based on role selection in profile setup
    if (form.id === 'profile-setup-form') {
        if (step === 5 && role === "Groupie") {
            step = 3;
        }
    }

    // Hide all steps and display the specified previous step
    const steps = document.getElementsByClassName('form-step');
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.display = 'none';
    }
    document.getElementById('step-' + step).style.display = 'block';
}

// Redirect to the title screen with login and create account options
function goToTitle() {
    window.location.href = '../../index.html'; 
}




// Age validation function
function validateAge() {
    const day = parseInt(document.getElementById('day').value);
    const month = parseInt(document.getElementById('month').value) - 1;
    const year = parseInt(document.getElementById('year').value);
    const birthday = new Date(year, month, day);

    // Check if the user is 18 or older
    const ageLimit = 18;
    if (!isOldEnough(birthday, ageLimit)) {
        alert('You must be at least 18 years old to create an account.');
        return false;
    }
    return true;
}
// Helper function to check if the user is old enough (18+)
function isOldEnough(birthday, ageLimit) {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();
    const dayDiff = today.getDate() - birthday.getDate();

    // Adjust age if today's month/day is before the birth month/day
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    return age >= ageLimit;
}
