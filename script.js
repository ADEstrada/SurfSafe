 // ROLE SELECTION - signup.html
let selectedRole = 'Tourist';
function setRole(role, btn) {
    selectedRole = role;
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}