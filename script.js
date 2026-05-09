/* BACKEND AND LEAD ARCHITECT INSTRUCTION:
        THROUGHOUT THE SCRIPT, I HAVE COMMENTS FOR YOU. PLEASE READ AND MAKE SURE THAT THAT'S THE ONLY THING THAT WILL BE CHANGE/ADDED
        BECAUSE MOST OF THE SCRIPTS ARE RELATED TO UI AND ITS FUNCTIONALITY.

        *IF DONE, PLEASE REMOVE THE COMMENT I MADE FOR YOU.

        *IN ANY CASE, THAT SOME NEEDS TO BE CHANGED BUT I DON'T HAVE COMMENT FOR IT, PLEASE INFORM ME.

        *DONT REMOVE COMMENTS THAT ARE NOT FOR YOU.

        *SCRIPT FOR ADMIN IS IN admin-script.js AND CSS FOR ADMIN is in admin.css
*/

// ROLE SELECTION - signup.html
let selectedRole = 'Tourist'; // BACKEND DEVELOPER: REPLACE THIS WITH USER STATE FROM DATABASE

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

// 7-DAY FORECAST - index.html and marine_data.html
function generateForecastCards() {

    /* LEAD ARCHITECT:  
            1. INTEGRATE API HERE
            2. SWELL, WIND, AND TIDE ARE CONNECTED TO IDs:  #wave-{day}, #wind-{day}, #tide-{day}
    */
   
    const container = document.getElementById('forecastContainer');
    const template = document.getElementById('forecastCardTemplate');
    
    if (!container || !template) return;

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THURS', 'FRI', 'SAT'];
    const today = new Date().getDay();

    container.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.forecast-card');
  
        const dayIndex = (i + 1) % 7; 
        
        card.setAttribute('data-day', dayIndex);
        card.querySelector('.day-name').innerText = days[dayIndex];
        
        const lowerDay = days[dayIndex].toLowerCase();
        card.querySelector('.wave-val').id = `wave-${lowerDay}`;
        card.querySelector('.wind-val').id = `wind-${lowerDay}`;
        card.querySelector('.tide-val').id = `tide-${lowerDay}`;

        if (dayIndex === today) {
            card.classList.add('active');
        }

        container.appendChild(clone);
    }
}

// HOURLY WAVE HEIGHT GRAPH - marine_data.html (NEEDS API)
let myWaveChart;

function setupWaveChart() {

    /* LEAD ARCHITECT: 
            1. INTEGRATE API HERE
            2. UPDATE "labels" WITH HOURLY TIMESTAMPS
            3. UPDATE "datasets" WITH WAVE_HEIGHT_MAX VALUES
    */
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

    /* LEAD ARCHITECT: 
            1. INTEGRATE API HERE
            2. MAP HIGH/LOW TIDE PREDICTIONS TO "datasets[0] and [1]"
    */

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
    if (!dateElement) return; 

    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    dateElement.innerText = now.toLocaleDateString('en-US', options);
}

// CREDITS - FOR PHOTOS
document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});

// FRONTEND LOGIC ONLY: HANDLES UI STATE FOR THE DEMO
// BACKEND DEVELOPER: REPLACE LOCALSTORAGE WITH BACKEND AUTHENTICATION

function updateNavbarBasedOnRole() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; 
    const userRole = localStorage.getItem('userRole'); 

    const trainersLink = document.getElementById('nav-book-trainer');
    const myBookingsLink = document.getElementById('nav-my-bookings');
    const authControls = document.getElementById('auth-controls');
    const userProfileSection = document.getElementById('user-profile-section');

    if (isLoggedIn) {
        authControls?.classList.add('d-none');
        userProfileSection?.classList.remove('d-none');

        if (userRole === 'Trainer') {
            trainersLink?.classList.remove('d-none');   
            myBookingsLink?.classList.remove('d-none');
        } else if (userRole === 'Tourist') {
            trainersLink?.classList.remove('d-none');
            myBookingsLink?.classList.add('d-none');    
        }
    } else {
        authControls?.classList.remove('d-none');
        userProfileSection?.classList.add('d-none');
        
        trainersLink?.classList.add('d-none'); 
        myBookingsLink?.classList.add('d-none');
    }
}
// END OF FRONTEND LOGIC FOR DEMO

// REPORTS - report.html
function renderReports() {
    const container = document.getElementById('reports-list');
    if (!container) return; 
    
    if (typeof reportsData === 'undefined' || !reportsData || reportsData.length === 0) {
        container.innerHTML = `
            <div class="no-reports-container">
                <i class="bi bi-shield-check no-reports-icon"></i>
                <h4 style="color: var(--surf-navy); font-weight: 700;">All Clear!</h4>
                <p class="text-muted">There are no hazards reported at Bagasbas Beach today.</p>
            </div>
        `;
        return; 
    }
    
    container.innerHTML = reportsData.map(report => {
        const isDangerous = report.status.toLowerCase() === 'dangerous';
        const accentColor = isDangerous ? '#ff311f' : '#ffc107';
        const badgeClass = isDangerous ? 'bg-danger' : 'bg-warning text-dark';

        return `
            <div class="report-entry shadow-sm">
                <div class="status-indicator" style="background-color: ${accentColor}"></div>
                <div class="entry-body">
                    <div class="row g-0 align-items-start">
                        
                        <div class="col-md-8 pe-3">
                            <span class="badge rounded-pill status-badge ${badgeClass} d-inline-block">
                                ${report.status}
                            </span>
                            <p class="entry-description">${report.description}</p>
                            <div class="location-text">
                                <i class="bi bi-geo-alt-fill me-1"></i>${report.reported_at}
                            </div>
                        </div>

                        <div class="col-md-4 data-box mt-3 mt-md-0">
                            <div class="row g-2">
                                <div class="col-6 col-md-12 data-item">
                                    <label>Hazard Type</label>
                                    <span>${report.hazard_type}</span>
                                </div>
                                <div class="col-6 col-md-12 data-item">
                                    <label>Coordinates</label>
                                    <span>${report.latitude}, ${report.longitude}</span>
                                </div>
                                <div class="col-12 data-item">
                                    <label>Reported By</label>
                                    <span>${report.reporter}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;
    }).join('');
}


document.addEventListener('DOMContentLoaded', () => {
    
    if (document.getElementById('forecastContainer') || document.getElementById('waveChart')) {
        generateForecastCards();
        displayLiveDate();
        if (document.getElementById('waveChart')) setupWaveChart(); 
        if (document.getElementById('tideChart')) setupTideChart();
    }

    updateNavbarBasedOnRole();

    // DATA PRIVACY ACT AND TERM AND CONDITION TAB SWITCHING
    const termsModal = document.getElementById('termsModal');
    if (termsModal) {
        termsModal.addEventListener('shown.bs.modal', function (event) {
            const triggerElement = event.relatedTarget; 
            const targetTabId = (triggerElement && triggerElement.hasAttribute('data-privacy')) ? 'privacy-tab' : 'terms-tab';
            setTimeout(() => {
                const tabTrigger = document.getElementById(targetTabId);
                if (tabTrigger) bootstrap.Tab.getOrCreateInstance(tabTrigger).show();
            }, 10);
        });
    }

    // FOR THE SIGN UP REQUIRED POPUP
    const trainerButtons = document.querySelectorAll('.btn-trainer, .btn-see-trainers');
    
    // BACKEND DEVELOPER: REPLACE LOCALSTORAGE
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    trainerButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!isLoggedIn) {
                e.preventDefault(); 
                const authModalEl = document.getElementById('authNudgeModal');
                if (authModalEl) {
                    const authModal = new bootstrap.Modal(authModalEl);
                    authModal.show();
                }
            }
        });
    });

    // FRONTEND LOGIC ONLY: HANDLES UI STATE FOR THE DEMO
    // BACKEND/LEAD ARCHITECT: REPLACE LOCALSTORAGE 
    const signupForm = document.getElementById('signupForm'); 
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            localStorage.setItem('isLoggedIn', 'true');
            if (typeof selectedRole !== 'undefined') {
                localStorage.setItem('userRole', selectedRole); 
            }
            window.location.href = "index.html"; 
        });
    }

    // FOR REPORTS LIST
    if (document.getElementById('reports-list')) renderReports();

    // PROFILE PAGE LOGIC
    if (document.getElementById('trainerName')) {
        loadProfileData();
        setupProfileActions(); 
    }

    // LOGOUT LOGIC
    document.getElementById('navLogoutBtn')?.addEventListener('click', () => {
        localStorage.setItem('isLoggedIn', 'false');
        window.location.href = 'index.html';
    });
});

// DUMMY DATA FOR REPORTS - BACKEND: Replace this with data from your database/API
const reportsData = [
    {
        status: 'Dangerous',
        description: 'Strong rip currents detected near the main tower. Swimmers are advised to stay in the shallow areas.',
        reported_at: 'Central Bagasbas Beach',
        hazard_type: 'Rip Current',
        latitude: '14.1332° N',
        longitude: '122.9861° E',
        reporter: 'Admin_SurfSafe'
    },
    {
        status: 'Warning',
        description: 'Minor jellyfish sightings reported by local surfers near the north reef. Wear protective rash guards.',
        reported_at: 'North Surf Point',
        hazard_type: 'Marine Life',
        latitude: '14.1350° N',
        longitude: '122.9875° E',
        reporter: 'Trainer_Jhon'
    },
    {
        status: 'Warning',
        description: 'Floating debris and driftwood sighted after the heavy rain last night. Please be careful when paddling out.',
        reported_at: 'South Beach Area',
        hazard_type: 'Debris',
        latitude: '14.1315° N',
        longitude: '122.9850° E',
        reporter: 'Local_Patrol'
    }
];


const userData = {
    role: "Trainer", 
    details: {
        name: "Coach Jhon Bagasbas",
        email: "jhon.surf@example.com",
        phone: "+63 912 345 6789",
        location: "Bagasbas Beach, Daet",
        experience: "8 Years Training",
        specialization: "Shortboard, Longboard",
        certifications: "ISA Level 1 Certified",
        bio: "Local surf instructor in Bagasbas with a passion for teaching beginners.",
        profilePic: "https://via.placeholder.com/150",
        doc: "ID_Verification.pdf"
    }
};

function loadProfileData() {
    const d = userData.details;
    const nameEl = document.getElementById('trainerName');
    if (!nameEl) return; 

    nameEl.innerText = d.name;
    document.getElementById('trainerEmail').innerText = d.email;
    document.getElementById('trainerPhone').innerText = d.phone;
    document.getElementById('trainerExp').innerText = d.experience;
    
    document.getElementById('inputEmail').value = d.email;
    document.getElementById('inputPhone').value = d.phone;
    document.getElementById('inputExp').value = d.experience;
    document.getElementById('inputSpecialization').value = d.specialization;
    document.getElementById('inputCertifications').value = d.certifications;
    document.getElementById('inputBio').value = d.bio;
    
    document.getElementById('displayPic').src = d.profilePic;
    document.getElementById('docFileName').innerText = d.doc;
}

// BACKEND DEVELOPER: MAKE SURE THIS UPDATES/SAVES
function setupProfileActions() {
    const editBtn = document.getElementById('editToggleBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    if (!editBtn) return;

    editBtn.addEventListener('click', function() {
        const isEditing = this.innerText === "Cancel";
        const displayFields = document.querySelectorAll('.display-field');
        const editFields = document.querySelectorAll('.edit-field');
        const mainInputs = document.querySelectorAll('.main-input');

        if (isEditing) {
            this.innerText = "Edit Profile";
            this.classList.replace('btn-secondary', 'btn-outline-primary');
            saveBtn.classList.add('d-none');
            displayFields.forEach(f => f.classList.remove('d-none'));
            editFields.forEach(f => f.classList.add('d-none'));
            mainInputs.forEach(i => i.disabled = true);
        } else {
            this.innerText = "Cancel";
            this.classList.replace('btn-outline-primary', 'btn-secondary');
            saveBtn.classList.remove('d-none');
            displayFields.forEach(f => f.classList.add('d-none'));
            editFields.forEach(f => f.classList.remove('d-none'));
            mainInputs.forEach(i => i.disabled = false);
        }
    });

    saveBtn?.addEventListener('click', () => {
        alert("Changes saved!");
        location.reload();
    });
}