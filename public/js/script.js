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
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', () => {
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle the eye icon
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});