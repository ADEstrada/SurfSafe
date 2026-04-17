 // ROLE SELECTION - signup.html
let selectedRole = 'Tourist';
function setRole(role, btn) {
    selectedRole = role;
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ACTIVE FORECAST CARD - index.html
const today = new Date().getDay();

document.querySelectorAll('.forecast-card').forEach(card => {
    card.classList.remove('active');
    
    if(parseInt(card.getAttribute('data-day')) === today) {
        card.classList.add('active');
    }
});