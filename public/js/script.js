function handleLogout() {
    fetch('/logout', {
        method: 'GET',
    })
        .then(response => {
            // Redirect to login page after successful logout
            window.location.href = '/Login';
        })
        .catch(error => console.error('Error:', error));
}


const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmpassword');
const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const form = document.getElementById('registerForm');

// Toggle Password Visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

toggleConfirmPassword.addEventListener('click', () => {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    toggleConfirmPassword.classList.toggle('fa-eye');
    toggleConfirmPassword.classList.toggle('fa-eye-slash');
});

// Form Validation
form.addEventListener('submit', (e) => {
    let valid = true;

    // Username validation
    const username = document.getElementById('name').value;
    if (username === '') {
        document.getElementById('usernameError').classList.remove('hidden');
        valid = false;
    } else {
        document.getElementById('usernameError').classList.add('hidden');
    }

    // Password validation
    const password = passwordInput.value;
    if (password.length < 6) {
        document.getElementById('passwordError').classList.remove('hidden');
        valid = false;
    } else {
        document.getElementById('passwordError').classList.add('hidden');
    }

    // Confirm password validation
    const confirmPassword = confirmPasswordInput.value;
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').classList.remove('hidden');
        valid = false;
    } else {
        document.getElementById('confirmPasswordError').classList.add('hidden');
    }

    // If form is not valid, prevent submission
    if (!valid) {
        e.preventDefault();
    }
});