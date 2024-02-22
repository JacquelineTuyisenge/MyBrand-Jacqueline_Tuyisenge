// register validation 

const fullName = document.getElementById('Fname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const form = document.getElementById('register-form');
const errorElement = document.getElementById('error');

form.addEventListener('submit', (e) => {
    //errors
    let messages = [];
    
    if (fullName.value.trim() === '' || fullName.value == null){
        messages.push('Full Name is required');
    }

    if (email.value.trim() === '') {
        messages.push('Email is required');
    } else {
        var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.value)) {
            messages.push('Invalid Email');
        }
    }

    if (password.value.trim() === '') {
        messages.push('Password is required');
    } else {
        // Password length between 6 and 8 characters
        if (password.value.length < 6 || password.value.length > 8) {
            messages.push('Password must be between 6 and 8 characters');
        }

        // At least one uppercase letter, one lowercase letter, and one digit
        var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,8}$/;
        if (!passwordRegex.test(password.value)) {
            messages.push('Password must contain at least one uppercase letter, one lowercase letter, and one digit');
        }
    }

    if (confirmPassword.value.trim() === '') {
        messages.push('Confirm Password is required');
    }

    if (password.value !== confirmPassword.value) {
        messages.push('Passwords do not match');
    }

    // Display error messages if any
    if (messages.length > 0) {
        e.preventDefault();
        errorElement.innerText = messages.join(', ');
    }
});
