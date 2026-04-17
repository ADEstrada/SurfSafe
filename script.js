 // ROLE SELECTION - signup.html
function setRole(role, btn) {
    selectedRole = role; 

    const buttons = document.querySelectorAll('.type-btn');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const card = document.querySelector('.signup-card');
    const trainerFields = document.getElementById('trainerFields');
    const consentText = document.getElementById('trainerConsentText'); 
    const termsCheck = document.getElementById('termsCheck'); 
    const fileInputs = trainerFields.querySelectorAll('input[type="file"]');

    if (role === 'Trainer') {
        card.classList.add('trainer-expanded');
        consentText.style.display = 'block'; 
        fileInputs.forEach(input => input.required = true);
        termsCheck.required = true; 
    } else {
        card.classList.remove('trainer-expanded');
        consentText.style.display = 'none';
        fileInputs.forEach(input => input.required = false);
        termsCheck.required = false; 
        termsCheck.checked = false;  
    }
}

// ACTIVE FORECAST CARD - index.html
const today = new Date().getDay();

document.querySelectorAll('.forecast-card').forEach(card => {
    card.classList.remove('active');
    
    if(parseInt(card.getAttribute('data-day')) === today) {
        card.classList.add('active');
    }
});


// HOURLY WAVE HEIGHT GRAPH - marine_data.html (NEEDS API)
let myWaveChart;

function setupWaveChart() {
    const ctx = document.getElementById('waveChart').getContext('2d');
    
    myWaveChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [], 
            datasets: [{
                label: 'Wave Height (m)',
                data: [], 
                backgroundColor: '#0077b6', 
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f0f0f0' },
                    ticks: { callback: (value) => value + 'm' } 
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// TIDE CHART - marine_data.html (NEEDS API)
let myTideChart;

function setupTideChart() {
    const ctxTide = document.getElementById('tideChart').getContext('2d');
    
    myTideChart = new Chart(ctxTide, {
        type: 'line', 
        data: {
            labels: [], 
            datasets: [
                {
                    label: 'High Tide',
                    data: [], 
                    borderColor: '#ff0000',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    tension: 0.4, 
                    fill: false
                },
                {
                    label: 'Low Tide',
                    data: [],
                    borderColor: '#0000ff',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false, 
                    grid: { color: '#f0f0f0' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// LIVE DATE - marine_data.html
function displayLiveDate() {
    const dateElement = document.getElementById('live-date');
    const now = new Date();

    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    dateElement.innerText = now.toLocaleDateString('en-US', options);
}

// CREDITS
document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});

document.addEventListener('DOMContentLoaded', () => {
    displayLiveDate();
    // setupWaveChart(); 
    // setupTideChart();

    // DATA PRIVACY ACT AND TERM AND CONDITION TAB SWITCHING
    const termsModal = document.getElementById('termsModal');
    if (termsModal) {
        termsModal.addEventListener('shown.bs.modal', function (event) {
            const triggerElement = event.relatedTarget; 
            if (triggerElement && triggerElement.hasAttribute('data-privacy')) {
                setTimeout(() => {
                    const privacyTabTrigger = document.getElementById('privacy-tab');
                    if (privacyTabTrigger) bootstrap.Tab.getOrCreateInstance(privacyTabTrigger).show();
                }, 10);
            } else {
                setTimeout(() => {
                    const termsTabTrigger = document.getElementById('terms-tab');
                    if (termsTabTrigger) bootstrap.Tab.getOrCreateInstance(termsTabTrigger).show();
                }, 10);
            }
        });
    }
});