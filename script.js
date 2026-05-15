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

    const touristBookings = document.getElementById('tourist-bookings-link');
    const touristReports = document.getElementById('tourist-reports-link');

    if (isLoggedIn) {
        if (authControls) authControls.classList.add('d-none');
        if (userProfileSection) userProfileSection.classList.remove('d-none');

        if (userRole === 'Trainer') {
            trainersLink?.classList.remove('d-none');   
            myBookingsLink?.classList.remove('d-none');
            touristBookings?.classList.add('d-none');
            touristReports?.classList.add('d-none');
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

// MY BOOKINGS - bookings.html
function renderBookings() {
    const statuses = ['upcoming', 'completed', 'cancelled'];
    
    statuses.forEach(status => {
        const listContainer = document.getElementById(`${status}-list`);
        if (!listContainer) return;

        const filtered = myBookings.filter(b => b.status === status);
        listContainer.innerHTML = ''; 

        if (filtered.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-calendar-x fs-1 text-muted"></i>
                    <p class="text-muted mt-2">No ${status} bookings yet.</p>
                </div>`;
            return;
        }

        // GROUP BY MONTH
        let currentMonth = "";
        filtered.forEach(booking => {
            if (booking.month !== currentMonth) {
                currentMonth = booking.month;
                listContainer.innerHTML += `<h6 class="text-muted text-uppercase small fw-bold mb-3 mt-4">${currentMonth}</h6>`;
            }

            const card = `
                <div class="booking-card d-flex align-items-center bg-white border rounded shadow-sm mb-3 p-0 overflow-hidden">
                    <div class="date-badge text-center py-3 px-4 border-end d-flex flex-column justify-content-center" style="min-width: 110px; background-color: #f8fbff;">
                        <span class="text-uppercase fw-bold small text-muted">${booking.day}</span>
                        <span class="fs-2 fw-bold lh-1" style="color: #002266;">${booking.num}</span>
                    </div>
                    
                    <div class="flex-grow-1 ps-4">
                        <h5 class="fw-bold mb-1">${booking.tourist_name}</h5>
                        <p class="text-muted small mb-0"><i class="bi bi-clock me-2"></i>${booking.time}</p>
                    </div>

                    <div class="pe-4">
                        <button class="btn btn-view-details rounded-pill px-4" onclick="showDetails('${booking.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            `;
            listContainer.innerHTML += card;
        });
    });
}

function showDetails(id) {
    const booking = myBookings.find(b => b.id === id);
    if (booking) {
        document.getElementById('detail-name').innerText = booking.tourist_name;
        document.getElementById('detail-email').innerText = booking.email;
        document.getElementById('detail-datetime').innerText = `${booking.day}, May ${booking.num} | ${booking.time}`;
        document.getElementById('detail-location').innerText = booking.location;
        
        const btnContainer = document.getElementById('complete-btn-container');
        
        if (booking.status === 'upcoming') {
            btnContainer.innerHTML = `
                <button class="btn btn-success w-100 rounded-pill" onclick="completeBooking('${booking.id}')">
                    <i class="bi bi-check-circle me-2"></i>Mark as Completed
                </button>
            `;
        } else {
            btnContainer.innerHTML = '';
        }

        const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
        detailsModal.show();
    }
}

function completeBooking(id) {
    const bookingIndex = myBookings.findIndex(b => b.id === id);
    
    if (bookingIndex !== -1) {
        myBookings[bookingIndex].status = 'completed';
        
        const modalElement = document.getElementById('detailsModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        renderBookings();
        
        alert("Lesson marked as completed!");
    }
}

// FOR TRAINERS LIST - trainer.html

let currentTrainerIndex = 0;
let trainerModal;

// SHOWCASES THE WEEKLY AVAILABILITY
function getWeeklyStatus(dayAbbreviation, activeDays) {
    const daysMap = { 'SU': 0, 'M': 1, 'T': 2, 'W': 3, 'TH': 4, 'F': 5, 'S': 6 };
    const today = new Date().getDay(); 
    const targetDay = daysMap[dayAbbreviation];
    
    if (targetDay < today) return 'past'; 
    return activeDays.includes(dayAbbreviation) ? 'active' : 'inactive';
}

// BACKEND DEVELOPER: PLEASE MAKE SURE THAT IN THE IMG CONTAINER, REAL IMAGE WILL BE SHOWN
function renderTrainers() {
    const list = document.getElementById('trainers-list');

    if (!list) {
        console.warn("Element 'trainers-list' not found on this page.");
        return; 
    }
    
    const placeholder = "https://placehold.co/400x500/00167A/FFFFFF?text=SurfSafe+Trainer";

    list.innerHTML = trainersData.map((trainer, index) => `
        <div class="col-12 col-md-4 mb-4">
            <div class="trainer-card-fixed shadow-sm" onclick="openTrainerDetails(${index})" style="cursor: pointer;">
                <div class="trainer-img-container">
                    <img src="${trainer.image || placeholder}" class="trainer-img-top" alt="${trainer.name}">
                </div>
                <div class="p-3 text-center">
                    <h5 class="trainer-name-text">${trainer.name}</h5>
                    <div class="availability-row my-2">
                        ${['M', 'T', 'W', 'TH', 'F', 'S', 'SU'].map(day => {
                            const isActive = trainer.active_days.includes(day);
                            return `<span class="day-dot ${isActive ? 'active' : 'inactive'}">${day}</span>`;
                        }).join('')}
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3 px-2">
                        <span class="trainer-rate">Php ${trainer.rate.toLocaleString()}</span>
                        <button class="btn-book-trainer" onclick="event.stopPropagation(); startBooking(${index})">Book</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}


function openTrainerDetails(index) {
    currentTrainerIndex = index;
    const trainer = trainersData[index];
    const detailsContainer = document.getElementById('modal-trainer-details');

   document.querySelectorAll('.nav-arrow').forEach(btn => btn.classList.remove('d-none'));

    const expertiseChips = trainer.expertise.map(skill => 
        `<span class="expertise-chip">${skill}</span>`
    ).join('');

    detailsContainer.innerHTML = `
        <div class="row g-0">
            <div class="col-md-5">
                <img src="${trainer.image}" class="img-fluid h-100 object-fit-cover" style="border-radius: 20px 0 0 20px; min-height: 400px;">
            </div>
            <div class="col-md-7 p-4">
                <h2 class="fw-bold text-navy mb-3">${trainer.name.toUpperCase()}</h2>
                
                <div class="row mb-4">
                    <div class="col-6">
                        <small class="text-muted d-block fw-bold">EXPERIENCE</small>
                        <span class="fw-bold">5+ Years</span>
                    </div>
                    <div class="col-6">
                        <small class="text-muted d-block fw-bold">RATE</small>
                        <span class="text-navy fw-bold">${trainer.rate.toLocaleString()} Php</span>
                    </div>
                </div>

                <div class="mb-3">
                    <p class="small fw-bold mb-2"><i class="bi bi-info-circle-fill text-navy me-2"></i>About Trainer</p>
                    <p class="text-muted small">Certified local instructor with over 5 years of experience teaching tourists in Bagasbas. Specialized in building confidence for first-time surfers.</p>
                </div>

                <div class="mb-4">
                    <p class="small fw-bold mb-2">Areas of Expertise</p>
                    <div class="d-flex flex-wrap gap-2">
                        ${expertiseChips}
                    </div>
                </div>

                <div class="mb-4">
                    <p class="small fw-bold mb-2"><i class="bi bi-clock-fill text-navy me-2"></i>Weekly Availability</p>
                    <div class="d-flex gap-2">
                        ${['M', 'T', 'W', 'TH', 'F', 'S', 'SU'].map(day => {
                            const isActive = trainer.active_days.includes(day);
                            const statusClass = isActive ? 'text-success' : 'text-danger';
                            return `<span class="fw-bold ${statusClass}">${day}</span>`;
                        }).join('')}
                    </div>
                </div>
                
                <button class="btn btn-navy w-100 py-2 fw-bold mt-2" onclick="startBooking(${index})">Book</button>
            </div>
        </div>
    `;
    trainerModal.show();
}

// BACKEND DEVELOPER/LEAD: PLEASE MAKE SURE SURE THAT THE AVAILABLE DATES AND TIMES THAT WILL BE FETCH HERE IS THE SCHEDULES THAT WERE ASSIGNED BY THE ADMIN
function startBooking(index) {
    currentTrainerIndex = index;
    const trainer = trainersData[index];
    const detailsContainer = document.getElementById('modal-trainer-details');

    document.querySelectorAll('.nav-arrow').forEach(btn => btn.classList.add('d-none'));

    detailsContainer.innerHTML = `
        <div class="p-4">
            <div class="d-flex align-items-center mb-4">
                <button class="btn btn-sm btn-outline-secondary me-3" onclick="openTrainerDetails(${index})">
                    <i class="bi bi-arrow-left"></i> 
                </button>
                <h4 class="fw-bold text-navy mb-0">Booking for ${trainer.name}</h4>
            </div>
            <form id="bookingForm" onsubmit="confirmBooking(event, ${index})">
                <div class="mb-3">
                    <label class="form-label small fw-bold">Select Date</label>
                    <input type="date" class="form-control" id="bookDate" required>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Available Time Slot</label>
                    <select class="form-select" id="bookTime" disabled required>
                        <option value="" selected disabled>Select a date first...</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label class="form-label small fw-bold">Meet-up Location</label>
                    <select class="form-select" id="bookLocation" required>
                        <option value="" selected disabled>Select location...</option>
                        <option value="Bagasbas Lighthouse">Bagasbas Lighthouse</option>
                        <option value="SurfSafe HQ">SurfSafe HQ</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-navy w-100 py-2 fw-bold">Confirm Booking</button>
            </form>
        </div>
    `;

    const dateInput = document.getElementById('bookDate');
    const timeSelect = document.getElementById('bookTime');

    dateInput.addEventListener('change', (e) => {
        const selectedDate = e.target.value; 
        const slots = trainer.schedules ? trainer.schedules[selectedDate] : null;
        if (slots) {
            timeSelect.disabled = false;
            timeSelect.innerHTML = '<option value="" selected disabled>Choose a slot...</option>' + 
                slots.map(s => `<option value="${s}">${s}</option>`).join('');
        } else {
            timeSelect.disabled = true;
            timeSelect.innerHTML = '<option value="" selected disabled>No shifts for this date</option>';
        }
    });
    
    trainerModal.show();
}


function nextTrainer() {
    if (currentTrainerIndex < trainersData.length - 1) {
        openTrainerDetails(currentTrainerIndex + 1);
    }
}

function prevTrainer() {
    if (currentTrainerIndex > 0) {
        openTrainerDetails(currentTrainerIndex - 1);
    }
}

// BACKEND DEVELOPER: MAKE SURE THIS WORKS
function confirmBooking(event, index) {
    event.preventDefault();
    const trainer = trainersData[index];
    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;
    const location = document.getElementById('bookLocation').value;

    alert(`Success! You booked ${trainer.name} on ${date} at ${time}. Meet-up: ${location}`);
    trainerModal.hide();
}

// FOR TOURIST VIEW - profile.html
function renderTouristBookings() {
    const listContainer = document.getElementById('tourist-bookings-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    touristActivityData.forEach(booking => {
        const isUpcoming = booking.status === 'upcoming';
        
        let statusColor = 'text-muted'; 
        if (booking.status === 'completed') statusColor = 'text-success';
        if (booking.status === 'cancelled') statusColor = 'text-danger';

        const activityHTML = `
            <div class="booking-item p-3 mb-3 border rounded shadow-sm bg-white">
                <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                    
                    <div class="flex-grow-1 w-100">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h6 class="fw-bold mb-0">${booking.trainerName}</h6>
                            <div class="d-block d-sm-none">
                                ${isUpcoming ? '' : `<span class="fw-bold small text-uppercase ${statusColor}">${booking.status}</span>`}
                            </div>
                        </div>

                        <div class="mb-2">
                            <p class="text-muted mb-0 small text-break"><i class="bi bi-envelope me-2"></i>${booking.trainerEmail}</p>
                            <p class="text-muted mb-0 small"><i class="bi bi-telephone me-2"></i>${booking.trainerPhone}</p>
                        </div>
                       
                        <div class="row g-0">
                            <div class="col-12 mb-1">
                                <p class="text-muted mb-0 small">
                                    <i class="bi bi-calendar3 me-2"></i>${booking.date}
                                </p>
                            </div>
                            <div class="col-12 mb-1">
                                <p class="text-muted mb-0 small">
                                    <i class="bi bi-clock me-2"></i>${booking.time}
                                </p>
                            </div>
                            <div class="col-12">
                                <p class="text-muted mb-0 small">
                                    <i class="bi bi-geo-alt me-2"></i>${booking.location}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="booking-action-container mt-3 mt-sm-0 ms-sm-3 text-sm-end border-sm-0">
                        ${isUpcoming ? `
                            <button class="btn btn-sm btn-outline-danger px-4 rounded-pill btn-cancel-responsive" 
                                    onclick="cancelBookingAction('${booking.id}')">
                                <i class="bi bi-x-circle me-2"></i>Cancel
                            </button>
                        ` : `
                            <div class="d-none d-sm-block">
                                <span class="fw-bold small text-uppercase ${statusColor}">
                                    ${booking.status}
                                </span>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
        listContainer.innerHTML += activityHTML;
    });
}

function cancelBookingAction(bookingId) {
    const confirmCancel = confirm(`Are you sure you want to cancel booking ${bookingId}?`);
    
    if (confirmCancel) {
        const index = touristActivityData.findIndex(b => b.id === bookingId);
        if (index !== -1) {
            touristActivityData[index].status = 'cancelled';
            
            alert("Booking Cancelled!");
            renderTouristBookings(); 
        }
    }
}

let reportMap;
let reportMarker;

// FOR SUBMIT LIVE REPORTS - report.html
function handleReportSubmission() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        const reportModalEl = document.getElementById('reportFormModal');
        const reportModal = new bootstrap.Modal(reportModalEl);
        reportModal.show();

        reportModalEl.addEventListener('shown.bs.modal', function () {
            if (!reportMap) {
                reportMap = L.map('map-picker').setView([14.1332, 122.9861], 15);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap'
                }).addTo(reportMap);

                reportMap.on('click', function (e) {
                    const lat = e.latlng.lat;
                    const lng = e.latlng.lng;

                    if (reportMarker) {
                        reportMarker.setLatLng([lat, lng]);
                    } else {
                        reportMarker = L.marker([lat, lng], { draggable: true }).addTo(reportMap);
                        reportMarker.on('dragend', function (event) {
                            const position = reportMarker.getLatLng();
                            document.getElementById('lat').value = position.lat.toFixed(6);
                            document.getElementById('lng').value = position.lng.toFixed(6);
                        });
                    }
                    document.getElementById('lat').value = lat.toFixed(6);
                    document.getElementById('lng').value = lng.toFixed(6);
                });
            }
            reportMap.invalidateSize();
        }, { once: true });

    } else {
        const authModal = new bootstrap.Modal(document.getElementById('authNudgeModal'));
        authModal.show();
    }
}

function submitReport(event) {
    event.preventDefault();
    alert("Report submitted successfully! Thank you for helping the Bagasbas community.");
    bootstrap.Modal.getInstance(document.getElementById('reportFormModal')).hide();
}

function renderMyReports() {
    const container = document.getElementById('my-reports-list');
    if (!container) return;

    if (!myReportsData || myReportsData.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5 border rounded bg-light">
                <i class="bi bi-clipboard-x text-muted" style="font-size: 2.5rem;"></i>
                <p class="text-muted mt-2">No reports submitted yet.</p>
            </div>`;
        return;
    }

    container.innerHTML = myReportsData.map(report => {
        const isApproved = report.verification_status === 'Approved';
        const badgeClass = isApproved ? 'bg-success' : 'bg-warning text-dark';
        
        return `
            <div class="report-item p-3 mb-3 border rounded shadow-sm bg-white">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <span class="badge ${badgeClass} rounded-pill px-3 py-1 mb-2" style="font-size: 0.7rem;">
                            ${report.verification_status.toUpperCase()}
                        </span>
                        <h6 class="fw-bold mb-1">${report.hazard_type}</h6>
                    </div>
                    <small class="text-muted" style="font-size: 0.75rem;">${report.reported_at}</small>
                </div>

                <p class="text-muted mb-3 small">${report.description}</p>

                <div class="d-flex align-items-center justify-content-between border-top pt-2 mt-2">
                    <div class="small text-muted">
                        <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                        ${report.latitude}, ${report.longitude}
                    </div>
                    <button class="btn btn-sm text-danger p-0" onclick="deleteReport('${report.id}')">
                        <i class="bi bi-trash3"></i>
                    </button>
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

    // FOR REPORTS
    const reportForm = document.getElementById('hazardForm');
    if (reportForm) {
        reportForm.addEventListener('submit', submitReport);
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
            } else {
            window.location.href = "trainers.html";
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

    const userRole = localStorage.getItem('userRole');

    if (userRole === 'Tourist') {
        // HIDE THE ONES FOR TRAINERS ONLY
        document.getElementById('profile-header-section')?.classList.add('d-none');
        document.getElementById('experience-section')?.classList.add('d-none');
        document.getElementById('trainer-info-card')?.classList.add('d-none');

        // SHOW DASHBOARD FOR TOURIST 
        const touristCard = document.getElementById('tourist-activity-card');
        if (touristCard) {
            touristCard.classList.remove('d-none');
            renderTouristBookings(); 
        }

        const sideCardTitle = document.getElementById('sideCardTitle');
        if (sideCardTitle) sideCardTitle.innerText = "Manage Account";

        const editBtn = document.getElementById('editToggleBtn');
        if (editBtn) editBtn.innerText = "Update Info";

        if (typeof renderMyReports === "function") renderMyReports();

    } else {
        // FOR TRAINERS UI
        document.getElementById('profile-header-section')?.classList.remove('d-none');
        document.getElementById('trainer-info-card')?.classList.remove('d-none');
        document.getElementById('tourist-activity-card')?.classList.add('d-none');
        
        if (typeof renderMyReports === "function") renderMyReports();
    }
}
     // FOR MY BOOKINGS LIST
    if (document.getElementById('upcoming-list')) renderBookings();

    // FOR TRAINERS
    const modalEl = document.getElementById('trainerModal');
    if (modalEl) {
        trainerModal = new bootstrap.Modal(modalEl);
    }

    renderTrainers();

    // LOGOUT LOGIC
    document.getElementById('navLogoutBtn')?.addEventListener('click', () => {
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('userRole');
        window.location.href = 'index.html';
    });

});


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

// DUMMY DATA - BACKEND: Replace this with data from database/API
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

const myBookings = [
    {
        id: "BK-001",
        tourist_name: "Jasmine C. Raviz",
        email: "jasmine@example.com",
        month: "MAY",
        day: "WED",
        num: "28",
        time: "8:00 - 11:00 AM",
        location: "Front of SurfSafe Office",
        status: "upcoming"
    },
    {
        id: "BK-002",
        tourist_name: "Ann Dominique C. Estrada",
        email: "ann.estrada@example.com",
        month: "JUNE",
        day: "MON",
        num: "01",
        time: "8:00 - 11:00 AM",
        location: "Bagasbas Beach Marker",
        status: "upcoming"
    }
];

const trainersData = [
    {
        name: "Jennie Kim",
        image: "assets/jennie.jpg",
        rate: 1300,
        active_days: ["M", "W", "F", "S"],
        expertise: ["Beginner Surfing", "Breath Control", "Water Safety"], 
        hasProfile: true,
        schedules: {
            "2026-05-11": ["6:00 AM - 8:00 AM", "8:30 AM - 10:30 AM"],
            "2026-05-13": ["2:00 PM - 4:00 PM"],
            "2026-05-15": ["6:00 AM - 8:00 AM", "2:00 PM - 4:00 PM"]
        }
    },
    {
        name: "Kim Taehyung",
        image: "assets/v.jpg",
        rate: 1300,
        active_days: ["M", "T", "W", "TH", "F", "S", "SU"],
        expertise: ["Intermediate Surfing", "Longboarding"], 
        hasProfile: true,
        schedules: {
            "2026-05-11": ["8:00 AM - 10:00 AM"],
            "2026-05-12": ["1:00 PM - 3:00 PM"]
        }
    },
    {
        name: "Im Nayeon",
        image: "assets/nayeon.jpg",
        rate: 1300,
        active_days: ["M", "T", "W", "TH", "F", "S", "SU"],
        expertise: ["Kids Surfing", "First Aid"],
        hasProfile: true,
        schedules: {
            "2026-05-14": ["6:00 AM - 8:00 AM"]
        }
    }
];

const touristActivityData = [
    {
        id: 'BK-2026-001',
        trainerName: 'Kim Taehyung',
        trainerEmail: 'v@surfsafe.com',
        trainerPhone: '+63 912 345 6789',
        date: 'May 28, 2026',
        time: '8:00 - 11:00 AM',
        location: 'Bagasbas Lighthouse',
        status: 'upcoming'
    }
];


const myReportsData = [
    {
        id: "REP-001",
        hazard_type: "Strong Current",
        description: "Noticeable strong rip currents near the main lifeguard tower. Surfers are advised to stay cautious.",
        latitude: "14.1332",
        longitude: "122.9861",
        reported_at: "May 12, 2026 | 09:15 AM",
        verification_status: "Approved"
    },
    {
        id: "REP-002",
        hazard_type: "Debris / Floating Logs",
        description: "Large logs spotted drifting near the shoreline after the heavy rain last night.",
        latitude: "14.1345",
        longitude: "122.9870",
        reported_at: "May 14, 2026 | 02:30 PM",
        verification_status: "Pending"
    },
    {
        id: "REP-003",
        hazard_type: "Jellyfish Alert",
        description: "Small group of box jellyfish seen near the beginner's area.",
        latitude: "14.1320",
        longitude: "122.9855",
        reported_at: "May 15, 2026 | 08:00 AM",
        verification_status: "Pending"
    }
];