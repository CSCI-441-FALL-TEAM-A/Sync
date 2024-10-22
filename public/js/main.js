function nextStep(step) {
    let steps = document.getElementsByClassName('form-step');

    // Hide all steps
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.display = 'none';
    }

    // Show the selected next step
    document.getElementById('step-' + step).style.display = 'block';
}

function prevStep(step) {
    let steps = document.getElementsByClassName('form-step');

    // Hide all steps
    for (let i = 0; i < steps.length; i++) {
        steps[i].style.display = 'none';
    }

    // Show the selected previous step
    document.getElementById('step-' + step).style.display = 'block';
}

function goToTitle() {
    // Redirect to the title screen with login and create account options
    window.location.href = '../../index.html'; 
}
