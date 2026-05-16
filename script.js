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

function setRole(role, element) {
    document.getElementById('roleInput').value = role;

    document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    const signupCard = document.querySelector('.signup-card');
    const trainerFields = document.getElementById('trainerFields');
    const trainerConsent = document.getElementById('trainerConsentText');

    if (role === 'Trainer') {
        signupCard.classList.add('trainer-expanded');
        trainerFields.style.display = 'block';
        trainerConsent.style.display = 'block';
    } else {
        signupCard.classList.remove('trainer-expanded');
        trainerFields.style.display = 'none';
        trainerConsent.style.display = 'none';
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

// HANDLES NAVBAR VISIBILITY STATES BASED ON REAL AUTHENTICATED SESSION VALUES - LYZETTE
function updateNavbarBasedOnRole(isLoggedIn, userRole) {
    const trainersLink = document.getElementById('nav-book-trainer');
    const myBookingsLink = document.getElementById('nav-my-bookings');
    const authControls = document.getElementById('auth-controls');
    const userProfileSection = document.getElementById('user-profile-section');

    if (isLoggedIn) {
        if (authControls) authControls.classList.add('d-none');
        if (userProfileSection) userProfileSection.classList.remove('d-none');

        if (userRole === 'Trainer') {
            trainersLink?.classList.remove('d-none');   
            myBookingsLink?.classList.remove('d-none'); 
        } else if (userRole === 'Tourist') {
            trainersLink?.classList.remove('d-none');   
            myBookingsLink?.classList.add('d-none');     
        } else if (userRole === 'Admin') {
            trainersLink?.classList.add('d-none');
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

// FETCH AND RENDER LIVE DATABASE LESSON BOOKINGS FOR THE TRAINER - LYZETTE
function renderBookings() {
    const statuses = ['upcoming', 'completed', 'cancelled'];
    
    if (!document.getElementById('upcoming-list')) return;

    fetch('get_trainer_bookings.php')
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                console.error("Failed to retrieve live trainer bookings from database.");
                return;
            }

            const activeBookings = data.bookings;

            statuses.forEach(status => {
                const listContainer = document.getElementById(`${status}-list`);
                if (!listContainer) return;

                const filtered = activeBookings.filter(b => b.status === status);
                listContainer.innerHTML = ''; 

                if (filtered.length === 0) {
                    listContainer.innerHTML = `
                        <div class="text-center py-5 bg-white border rounded shadow-sm">
                            <i class="bi bi-calendar-x fs-1 text-muted"></i>
                            <p class="text-muted mt-2 mb-0 small">No ${status} bookings scheduled yet.</p>
                        </div>`;
                    return;
                }

                listContainer.innerHTML = filtered.map(booking => `
                    <div class="booking-card d-flex align-items-center bg-white border rounded shadow-sm mb-3 p-0 overflow-hidden">
                        <div class="text-center py-3 px-4 border-end d-flex flex-column justify-content-center bg-light" style="min-width: 120px;">
                            <i class="bi bi-calendar3 text-primary fs-3 mb-1"></i>
                            <span class="fw-bold text-secondary" style="font-size:0.7rem;">RESERVATION</span>
                        </div>
                        
                        <div class="flex-grow-1 ps-4 py-3 text-start">
                            <h5 class="fw-bold mb-1 text-dark" style="font-size: 1.1rem;">${booking.tourist_name.toUpperCase()}</h5>
                            <p class="text-muted small mb-1"><i class="bi bi-calendar-event me-2 text-primary"></i>${booking.date_display}</p>
                            <p class="text-muted small mb-0"><i class="bi bi-clock me-2 text-success"></i><strong>Booked Hour:</strong> ${booking.selected_time}</p>
                        </div>

                        <div class="pe-4">
                            <button class="btn btn-outline-primary rounded-pill px-4 btn-sm fw-bold" 
                                    onclick="showDetails(${JSON.stringify(booking).replace(/"/g, '&quot;')})">
                                View Details
                            </button>
                        </div>
                    </div>
                `).join('');
            });
        })
        .catch(error => console.error("Error synchronizing trainer booking live cycles:", error));
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

// FETCH SHIFTS, GROUP BY TRAINER TO PREVENT DUPLICATES, AND RENDER ORIGINAL DOT UI - LYZETTE
function renderTrainers() {
    const listContainer = document.getElementById('trainers-list');
    if (!listContainer) {
        console.warn("Element 'trainers-list' not found on this page.");
        return; 
    }

    const placeholder = "https://placehold.co/400x500/00167A/FFFFFF?text=SurfSafe+Trainer";

    fetch('get_public_shifts.php')
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            if (!data.success || data.shifts.length === 0) {
                listContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-calendar-x text-muted" style="font-size: 3rem;"></i>
                        <h4 class="fw-bold mt-3 text-dark">No Shifts Available</h4>
                        <p class="text-muted small">No active coaching shifts allocated for this week yet.</p>
                    </div>`;
                return;
            }

            const trainersMap = {};
            
            data.shifts.forEach(shift => {
                const trainerId = shift.user_id;
                if (!trainersMap[trainerId]) {
                    trainersMap[trainerId] = {
                        trainer_name: shift.trainer_name,
                        image: shift.image,
                        specialization: shift.specialization,
                        all_shifts: []
                    };
                }
                trainersMap[trainerId].all_shifts.push(shift);
            });

            listContainer.innerHTML = Object.values(trainersMap).map(trainer => {
                const weekDays = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];
                const dayAbbrMap = { 'Monday': 'M', 'Tuesday': 'T', 'Wednesday': 'W', 'Thursday': 'TH', 'Friday': 'F', 'Saturday': 'S', 'Sunday': 'SU' };

                const activeDays = trainer.all_shifts.map(s => dayAbbrMap[s.day_name]);

                const dayDotsHTML = weekDays.map(day => {
                    const isAvailable = activeDays.includes(day);
                    return `<span class="day-dot ${isAvailable ? 'active' : 'inactive'}">${day}</span>`;
                }).join('');

                return `
                    <div class="col-12 col-md-4 mb-4">
                        <div class="trainer-card-fixed shadow-sm" onclick="openPublicBookingModal(${JSON.stringify(trainer).replace(/"/g, '&quot;')})" style="cursor: pointer;">
                            <div class="trainer-img-container">
                                <img src="${trainer.image || placeholder}" class="trainer-img-top" alt="${trainer.trainer_name}">
                            </div>
                            <div class="p-3 text-center">
                                <h5 class="trainer-name-text">${trainer.trainer_name}</h5>
                                
                                <div class="availability-row my-2">
                                    ${dayDotsHTML}
                                </div>
                                
                                <div class="d-flex justify-content-between align-items-center mt-3 px-2">
                                    <span class="trainer-rate">Php 1,300</span>
                                    <button class="btn-book-trainer" onclick="event.stopPropagation(); openPublicBookingModal(${JSON.stringify(trainer).replace(/"/g, '&quot;')})">Book</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(error => {
            console.error("Error executing dynamic grouped trainer render pipeline:", error);
            listContainer.innerHTML = `<div class="text-danger p-3 small text-center">Failed to load active database shifts.</div>`;
        });
}

// MODIFIED TO HANDLE MULTIPLE SHIFTS FOR A SINGLE GROUPED TRAINER CARD - LYZETTE
function openPublicBookingModal(trainer) {
    const detailsContainer = document.getElementById('modal-trainer-details'); 
    if (!detailsContainer) return;

    const dateOptionsHTML = trainer.all_shifts.map((shift, index) => {
        return `<option value="${index}">${shift.date_display} (${shift.day_name})</option>`;
    }).join('');

    detailsContainer.innerHTML = `
        <div class="p-4">
            <div class="text-center mb-4">
                <img src="${trainer.image}" class="rounded-circle border mb-2 shadow-sm" style="width: 90px; height: 90px; object-fit: cover;">
                <h4 class="fw-bold text-dark mb-0">${trainer.trainer_name}</h4>
                <small class="text-primary fw-semibold">${trainer.specialization}</small>
            </div>

            <div class="mb-3">
                <label class="form-label small fw-bold text-secondary">Choose Available Date</label>
                <select class="form-select" id="bookingShiftSelector" required>
                    ${dateOptionsHTML}
                </select>
            </div>

            <div id="selectedShiftInfoBox"></div>

            <form id="publicBookingSubmissionForm">
                
                <div class="row g-3 mb-3">
                    <div class="col-6">
                        <label class="form-label small fw-bold text-secondary">Your Start Time</label>
                        <input type="time" class="form-control" id="bookingStartTime" required>
                    </div>
                    <div class="col-6">
                        <label class="form-label small fw-bold text-secondary">Your End Time</label>
                        <input type="time" class="form-control" id="bookingEndTime" required>
                    </div>
                    <div class="col-12">
                        <span class="text-muted" style="font-size: 0.75rem; display: block; mt-1;" id="overlapValidationMessage">
                            Select a date above to display allowed hours.
                        </span>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label small fw-bold text-secondary">Select Meet-up Location</label>
                    <select class="form-select" id="bookingMeetupLocation" required>
                        <option value="" selected disabled>Choose meeting area...</option>
                        <option value="Bagasbas Lighthouse">Bagasbas Lighthouse</option>
                        <option value="SurfSafe HQ Office">SurfSafe HQ Office</option>
                        <option value="Main Lifeguard Station Tower 1">Main Lifeguard Station Tower 1</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label class="form-label small fw-bold text-secondary">Additional Notes / Requests (Optional)</label>
                    <textarea class="form-control" id="bookingNotes" rows="2" placeholder="e.g., I want to book 1pm to 2pm only..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary w-100 py-2.5 fw-bold rounded-pill shadow" id="bookingSubmitBtn">Confirm and Pay Onsite</button>
            </form>
        </div>
    `;

    const shiftSelector = document.getElementById('bookingShiftSelector');
    const startInput = document.getElementById('bookingStartTime');
    const endInput = document.getElementById('bookingEndTime');
    const validationMsg = document.getElementById('overlapValidationMessage');
    const submitBtn = document.getElementById('bookingSubmitBtn');

    let globalReservedSlots = [];
    let currentAdminTimeRange = "";

    const toMins = (t) => {
        const [h, m] = t.split(':');
        return parseInt(h, 10) * 60 + parseInt(m, 10);
    };

    const parse12ToMins = (t12) => {
        const [time, modifier] = t12.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
        return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    };

    function checkLiveOverlap() {
        if (!startInput.value || !endInput.value) return;

        const currentStart = toMins(startInput.value);
        const currentEnd = toMins(endInput.value);
        
        const activeShift = trainer.all_shifts[shiftSelector.value];
        const adminStartMins = parse12ToMins(activeShift.start_time);
        const adminEndMins = parse12ToMins(activeShift.end_time);

        if (currentStart < adminStartMins || currentEnd > adminEndMins) {
            applyConflictStyles(`<strong><i class="bi bi-exclamation-triangle-fill"></i> Outside Availability! Allowed hours: ${currentAdminTimeRange}</strong>`);
            return;
        }

        if (currentStart >= currentEnd) {
            applyConflictStyles(`<strong><i class="bi bi-exclamation-triangle-fill"></i> End Time must be later than Start Time!</strong>`);
            return;
        }

        let conflictFound = false;
        for (let slot of globalReservedSlots) {
            const [sStr, eStr] = slot.split(' - ');
            const slotStart = parse12ToMins(sStr);
            const slotEnd = parse12ToMins(eStr);

            if (currentStart < slotEnd && currentEnd > slotStart) {
                conflictFound = true;
                break;
            }
        }

        if (conflictFound) {
            applyConflictStyles(`<strong><i class="bi bi-x-circle-fill"></i> Time range overlaps with an existing reservation!</strong>`);
        } else {
            clearConflictStyles();
        }
    }

    function applyConflictStyles(message) {
        startInput.style.borderColor = "#dc3545";
        endInput.style.borderColor = "#dc3545";
        startInput.style.backgroundColor = "#fff5f5";
        endInput.style.backgroundColor = "#fff5f5";
        validationMsg.className = "text-danger small d-block mt-1";
        validationMsg.innerHTML = message;
        submitBtn.disabled = true;
    }

    function clearConflictStyles() {
        startInput.style.borderColor = "";
        endInput.style.borderColor = "";
        startInput.style.backgroundColor = "";
        endInput.style.backgroundColor = "";
        validationMsg.className = "text-muted small d-block mt-1";
        validationMsg.innerHTML = `*The selected time must fall within the range of <strong>${currentAdminTimeRange}</strong>.`;
        submitBtn.disabled = false;
    }

    function updateModalWithSelectedShift() {
        const selectedIndex = shiftSelector.value;
        const activeShift = trainer.all_shifts[selectedIndex];
        currentAdminTimeRange = `${activeShift.start_time} - ${activeShift.end_time}`;

        startInput.value = "";
        endInput.value = "";
        clearConflictStyles();

        fetch(`get_booked_slots.php?shift_id=${activeShift.shift_id}`)
            .then(res => res.json())
            .then(data => {
                globalReservedSlots = data.success ? data.reserved : [];
                
                let takenSlotsHTML = "";
                if (globalReservedSlots.length > 0) {
                    takenSlotsHTML = `<div class="mt-2 text-danger small fw-bold">Already Reserved Slots: <br>` + 
                        globalReservedSlots.map(slot => `• ${slot}`).join('<br>') + `</div>`;
                } else {
                    takenSlotsHTML = `<div class="mt-2 text-success small"><i class="bi bi-check-circle"></i> No existing bookings for this shift yet!</div>`;
                }

                document.getElementById('selectedShiftInfoBox').innerHTML = `
                    <div class="alert alert-info border-0 p-3 mb-4" style="background-color: #f0f7ff; border-radius: 12px;">
                        <h6 class="fw-bold text-dark mb-2" style="font-size: 0.9rem;"><i class="bi bi-clock-history text-primary me-1"></i> Coach Schedule Availability:</h6>
                        <div class="row g-2 small text-secondary">
                            <div class="col-6"><strong>Date Available:</strong> ${activeShift.date_display} (${activeShift.day_name})</div>
                            <div class="col-6"><strong>Time Allowed:</strong> ${currentAdminTimeRange}</div>
                        </div>
                        ${takenSlotsHTML}
                    </div>
                `;

                validationMsg.innerHTML = `*The selected time must fall within the range of <strong>${currentAdminTimeRange}</strong>.`;

                const form = document.getElementById('publicBookingSubmissionForm');
                form.onsubmit = function(event) {
                    executeShiftBookingSubmit(event, activeShift.shift_id, activeShift.start_time, activeShift.end_time, globalReservedSlots);
                };
            });
    }

    startInput.addEventListener('input', checkLiveOverlap);
    endInput.addEventListener('input', checkLiveOverlap);
    shiftSelector.addEventListener('change', updateModalWithSelectedShift);
    
    updateModalWithSelectedShift();

    const trainerModalEl = document.getElementById('trainerModal');
    if (trainerModalEl) {
        bootstrap.Modal.getOrCreateInstance(trainerModalEl).show();
    }
}

function executeShiftBookingSubmit(event, shiftId, adminStartStr, adminEndStr, reservedSlots) {
    event.preventDefault();
    
    const touristStart = document.getElementById('bookingStartTime').value;
    const touristEnd = document.getElementById('bookingEndTime').value;
    const location = document.getElementById('bookingMeetupLocation').value;
    const notes = document.getElementById('bookingNotes').value;

    const toMinutes = (timeStr) => {
        if (timeStr.includes('M')) {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':');
            if (hours === '12') hours = '00';
            if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
            return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
        }
        const [hours, minutes] = timeStr.split(':');
        return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    };

    const tStart = toMinutes(touristStart);
    const tEnd = toMinutes(touristEnd);
    const aStart = toMinutes(adminStartStr);
    const aEnd = toMinutes(adminEndStr);

    if (tStart >= tEnd) {
        alert("Invalid selection! The 'End Time' must be later than the 'Start Time'.");
        return;
    }
    if (tStart < aStart || tEnd > aEnd) {
        alert(`We're sorry! Your selected time falls outside the Coach's scheduled availability (${adminStartStr} - ${adminEndStr}).`);
        return;
    }

    const format12Hour = (timeStr) => {
        if (timeStr.includes('M')) return timeStr;
        let [hours, minutes] = timeStr.split(':');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    const finalCustomTimeRange = `${format12Hour(touristStart)} - ${format12Hour(touristEnd)}`;

    const payload = new FormData();
    payload.append('shift_id', shiftId);
    payload.append('meetup_location', location);
    payload.append('additional_notes', notes);
    payload.append('custom_time', finalCustomTimeRange);

    fetch('save_tourist_booking.php', {
        method: 'POST',
        body: payload
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            alert("Lesson booked successfully! Your selected time slot has been reserved.");
            bootstrap.Modal.getInstance(document.getElementById('trainerModal')).hide();
            if (typeof renderLiveTouristBookings === 'function') renderLiveTouristBookings();
        } else {
            alert(result.message);
        }
    })
    .catch(error => console.error("Booking transmission error:", error));
}

/*
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
} */

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

// HANDLES THE SECURE ASYNCHRONOUS CANCELLATION REQUEST TRANSACTION LOOP - LYZETTE
function cancelBookingAction(bookingId) {
    const confirmCancel = confirm(`Are you sure you want to cancel booking session reference #${bookingId}?`);
    
    if (confirmCancel) {
        const payload = new FormData();
        payload.append('booking_id', bookingId);

        fetch('cancel_booking.php', {
            method: 'POST',
            body: payload
        })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert(result.message);
                renderLiveTouristBookings();
            } else {
                alert("Cancellation Failure: " + result.message);
            }
        })
        .catch(error => console.error("Network communication failure:", error));
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

// UPDATED THIS PART TO RENDER REAL REPORTS FROM THE DATABASE - LYZETTE
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfileData();

    if (document.getElementById('forecastContainer') || document.getElementById('waveChart')) {
        generateForecastCards();
        displayLiveDate();
        if (document.getElementById('waveChart')) setupWaveChart(); 
        if (document.getElementById('tideChart')) setupTideChart();
    }

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

    const reportForm = document.getElementById('hazardForm');
    if (reportForm) {
        reportForm.addEventListener('submit', submitReport);
    }


    // TARGETS ALL COHORT TRAINER REDIRECTION BUTTONS ON THE HOMEPAGE - LYZETTE
    const gatekeeperButtons = document.querySelectorAll('.btn-gatekeeper');

    gatekeeperButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); 

            const navProfileText = document.querySelector('#profileDropdown span');
            const hasUserFirstName = navProfileText && navProfileText.innerText.trim() !== "Profile";

            const authControls = document.getElementById('auth-controls');
            const authButtonsAreHidden = authControls && authControls.classList.contains('d-none');

            const userIsAuthenticated = hasUserFirstName || authButtonsAreHidden;

            if (!userIsAuthenticated) {
                const authModalEl = document.getElementById('authNudgeModal');
                if (authModalEl) {
                    const authModal = bootstrap.Modal.getOrCreateInstance(authModalEl);
                    authModal.show();
                }
            } else {
                window.location.href = 'trainers.php';
            }
        });
    });

    if (document.getElementById('reports-list')) renderReports();
    if (document.getElementById('upcoming-list')) renderBookings();

    const modalEl = document.getElementById('trainerModal');
    if (modalEl) {
        trainerModal = new bootstrap.Modal(modalEl);
    }

    renderTrainers();

    if (document.getElementById('sideCardTitle')) {
        setupProfileEditorActions();
    }
    const avatarInput = document.getElementById('inputAvatar');
    if (avatarInput) {
        avatarInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const avatarPreview = document.getElementById('profileAvatar');
                    if (avatarPreview) avatarPreview.src = e.target.result;
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
});

// FETCH AND BIND LIVE DATABASE DATA FOR ACTIVE USER PROFILE - LYZETTE
function loadUserProfileData() {
    const currentFile = window.location.pathname.split("/").pop();
    
    if (currentFile === "login.html" || currentFile === "signup.html") {
        return; 
    }

    fetch('get_profile_data.php')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                if (currentFile === "profile.php") {
                    window.location.href = 'login.html';
                } else {
                    updateNavbarBasedOnRole(false, '');
                }
                return;
            }

            updateNavbarBasedOnRole(true, data.role);

            // SAFE LOGOUT BINDING STABILIZATION - LYZETTE
            const logoutBtn = document.getElementById('logoutBtn');
            const navLogoutBtn = document.getElementById('navLogoutBtn');

            function executeLogoutSession() {
                fetch('logout.php')
                    .then(res => {
                        if (!res.ok) throw new Error("HTTP Error " + res.status);
                        return res.json();
                    })
                    .then(logoutRes => {
                        if (logoutRes.success) {
                            window.location.href = 'index.php'; 
                        } else {
                            alert("Logout failed: " + logoutRes.message);
                        }
                    })
                    .catch(error => console.error("Error executing safe session destroy:", error));
            }
            
            if (logoutBtn) logoutBtn.addEventListener('click', executeLogoutSession);
            if (navLogoutBtn) navLogoutBtn.addEventListener('click', executeLogoutSession);

            const avatarEl = document.getElementById('profileAvatar');
            if (avatarEl) {
                if (data.profile_pix) {
                    avatarEl.src = `uploads/${data.profile_pix}`;
                } else {
                    avatarEl.src = 'assets/default-avatar.png';
                }
            }

            const fullName = `${data.first_name} ${data.last_name}`;
            const nameHeader = document.getElementById('trainerName');
            if (nameHeader) nameHeader.innerText = fullName.toUpperCase();

            const navProfileText = document.querySelector('#profileDropdown span');
            if (navProfileText) {
                navProfileText.innerText = data.first_name;
            }
            
            const emailText = document.getElementById('trainerEmail');
            if (emailText) emailText.innerText = data.email;
            
            const phoneText = document.getElementById('trainerPhone');
            if (phoneText) phoneText.innerText = data.phone || 'Not Filled';

            const activePageFile = window.location.pathname.split("/").pop();
            const isViewingHomepage = activePageFile === "index.php" || activePageFile === "index.html" || activePageFile === "";

            if (isViewingHomepage) {
                const profileIsUncomplete = data.profile_completed == 0 || data.profile_completed === false;
                
                if (profileIsUncomplete) {
                    const nudgeModalElement = document.getElementById('touristFirstTimeModal');
                    if (nudgeModalElement) {
                        const touristPopup = new bootstrap.Modal(nudgeModalElement);
                        touristPopup.show();
                    }
                }
            }
            
            const inEmail = document.getElementById('inputEmail');
            if (inEmail) inEmail.value = data.email;
            
            const inPhone = document.getElementById('inputPhone');
            if (inPhone) inPhone.value = data.phone || '';

            if (data.role === 'Trainer') {
                const expEl = document.getElementById('trainerExp');
                if (expEl) expEl.innerText = data.experience ? `${data.experience} Years Training` : 'Not Filled';
                
                const inExp = document.getElementById('inputExp');
                if (inExp) inExp.value = data.experience || '';
                
                const inSpec = document.getElementById('inputSpecialization');
                if (inSpec) inSpec.value = data.specialization || '';
                
                const certInput = document.getElementById('inputCertifications');
                if (certInput) certInput.value = 'Verified Signup Certificates (See Below)';
                
                const inBio = document.getElementById('inputBio');
                if (inBio) inBio.value = data.bio || '';

                const docsContainer = document.getElementById('trainer-documents-container');
                if (docsContainer && data.documents) {
                    docsContainer.innerHTML = ''; 
                    const docLabels = {
                        dot_cert: 'DOT Accreditation Certificate',
                        training_cert: 'Professional Training Certificate',
                        water_safety: 'Water Safety & First Aid Card',
                        nbi_clearance: 'Valid NBI Clearance',
                        drug_test: 'Negative Drug Test Result'
                    };

                    Object.keys(data.documents).forEach(key => {
                        const fileName = data.documents[key];
                        if (fileName) {
                            docsContainer.innerHTML += `
                                <div class="document-item d-flex align-items-center p-2 border rounded bg-light mb-2 shadow-sm">
                                    <i class="bi bi-file-earmark-pdf-fill fs-4 me-2 text-danger"></i>
                                    <div class="text-truncate" style="max-width: 80%;">
                                        <div class="fw-bold small text-dark" style="font-size: 0.85rem; line-height: 1.2;">${docLabels[key]}</div>
                                        <span class="text-muted small text-truncate d-block" style="font-size: 0.75rem;">${fileName}</span>
                                    </div>
                                    <i class="bi bi-patch-check-fill text-success ms-auto fs-5" title="Verified by Admin"></i>
                                </div>`;
                        }
                    });
                }

                if (typeof renderBookings === 'function') {
                    renderBookings();
                }
                
            } else {
                if (typeof renderLiveTouristBookings === 'function') renderLiveTouristBookings();
                if (typeof renderLiveTouristReports === 'function') renderLiveTouristReports();
            }
        })
        .catch(error => {
            console.error('Error compiling profile data:', error);
        });
}

// TOGGLE THE INPUT FORMS AND CAMERA ICON IN EDIT MODE - LYZETTE
function setupProfileEditorActions() {
    const editBtn = document.getElementById('editToggleBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    if (!editBtn) return;

    editBtn.addEventListener('click', function() {
        const isEditing = this.innerText === "Cancel";
        const displayFields = document.querySelectorAll('.display-field');
        const editFields = document.querySelectorAll('.edit-field');
        
        const mainInputs = document.querySelectorAll('.main-input, input.form-control, textarea.form-control, select.form-select');
        
        const cameraLabel = document.querySelector('label[for="inputAvatar"]');

        if (isEditing) {
            this.innerText = "Edit Profile";
            this.classList.replace('btn-secondary', 'btn-outline-primary');
            if (saveBtn) saveBtn.classList.add('d-none');
            
            displayFields.forEach(f => f.classList.remove('d-none'));
            editFields.forEach(f => f.classList.add('d-none'));
            mainInputs.forEach(i => i.disabled = true); 
            
            if (cameraLabel) cameraLabel.classList.add('d-none');
        } else {
            this.setAttribute('data-old-text', this.innerText);
            this.innerText = "Cancel";
            this.classList.replace('btn-outline-primary', 'btn-secondary');
            if (saveBtn) saveBtn.classList.remove('d-none');
            
            displayFields.forEach(f => f.classList.remove('d-none'));
            editFields.forEach(f => f.classList.remove('d-none'));
            mainInputs.forEach(i => i.disabled = false);
            
            if (cameraLabel) cameraLabel.classList.remove('d-none');
        }
    });

    saveBtn?.addEventListener('click', saveProfileChanges);
}

// VALIDATE MANDATORY FIELDS AND SEND UPDATES WITH PROFILE PICTURE - LYZETTE
function saveProfileChanges() {
    const updatedEmail = document.getElementById('inputEmail').value.trim();
    const updatedPhone = document.getElementById('inputPhone').value.trim();
    const updatedPassword = document.getElementById('inputPassword').value;
    
    const expInput = document.getElementById('inputExp');
    const specInput = document.getElementById('inputSpecialization');
    const bioInput = document.getElementById('inputBio');
    const avatarInput = document.getElementById('inputAvatar');

    if (!updatedPhone) { alert("Phone Number is mandatory!"); return; }
    if (expInput && !expInput.value.trim()) { alert("Experience Level is mandatory!"); return; }
    if (specInput && !specInput.value.trim()) { alert("Specialization is mandatory!"); return; }
    if (bioInput && !bioInput.value.trim()) { alert("Bio / About Me is mandatory!"); return; }

    const formData = new FormData();
    formData.append('email', updatedEmail);
    formData.append('phone', updatedPhone);
    
    if (updatedPassword.trim() !== '') {
        formData.append('password', updatedPassword);
    }
    
    if (expInput) formData.append('experience', expInput.value);
    if (specInput) formData.append('specialization', specInput.value);
    if (bioInput) formData.append('bio', bioInput.value);

    if (avatarInput && avatarInput.files[0]) {
        formData.append('profile_pix', avatarInput.files[0]);
    }

    fetch('update_profile.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Server returned HTTP status " + response.status);
        }
        return response.json();
    })
    .then(result => {
        if (result.success) {
            alert("Profile synchronized successfully!");
            location.reload();
        } else {
            alert("Database Error: " + result.message);
        }
    })
    .catch(error => {
        console.error('Submission Error:', error);
        alert("Server validation error or network failure. Check console elements.");
    });
}

// FETCH AND BIND LIVE DATABASE DATA FOR TOURIST BOOKINGS VIEW FEED - LYZETTE
function renderLiveTouristBookings() {
    const listContainer = document.getElementById('tourist-bookings-list');
    if (!listContainer) return; 

    fetch('get_tourist_bookings.php')
        .then(res => res.json())
        .then(data => {
            if (!data.success || data.bookings.length === 0) {
                listContainer.innerHTML = `
                    <div class="text-center py-4 text-muted bg-white border rounded shadow-sm">
                        <i class="bi bi-calendar-x fs-2 text-secondary"></i>
                        <p class="small mb-0 mt-2">You haven't scheduled any surf lesson bookings yet.</p>
                    </div>`;
                return;
            }

            listContainer.innerHTML = data.bookings.map(booking => {
                const isUpcoming = booking.status.toLowerCase() === 'upcoming';
                
                let statusColor = 'text-muted'; 
                if (booking.status.toLowerCase() === 'completed') statusColor = 'text-success';
                if (booking.status.toLowerCase() === 'cancelled') statusColor = 'text-danger';

                return `
                    <div class="booking-item p-3 mb-3 border rounded shadow-sm bg-white">
                        <div class="d-flex justify-content-between align-items-center w-100 flex-wrap flex-sm-nowrap">
                            
                            <div class="pe-2 flex-grow-1">
                                <h6 class="fw-bold mb-1 text-dark" style="font-size: 1.05rem;">${booking.trainer_name}</h6>
                                
                                <div class="mb-2 info-contact-links">
                                    <p class="text-muted mb-0 small text-break"><i class="bi bi-envelope me-2"></i>${booking.trainer_email}</p>
                                    <p class="text-muted mb-0 small"><i class="bi bi-telephone me-2"></i>${booking.trainer_phone}</p>
                                </div>
                                
                                <div class="row g-0 small text-secondary">
                                    <div class="col-12 mb-1"><i class="bi bi-calendar3 me-2"></i>${booking.date}</div>
                                    <div class="col-12 mb-1"><i class="bi bi-clock me-2"></i>${booking.selected_time}</div>
                                    <div class="col-12"><i class="bi bi-geo-alt me-2"></i>${booking.location}</div>
                                </div>
                            </div>
                            
                            <div class="mt-2 mt-sm-0 text-end d-flex align-items-center justify-content-end text-nowrap" style="min-width: 120px;">
                                ${isUpcoming ? `
                                    <button class="btn btn-sm btn-outline-danger px-3 px-sm-4 rounded-pill d-flex align-items-center gap-1" 
                                            style="border-color: #e5b2b2; color: #cc3737; padding-top: 5px; padding-bottom: 5px; font-weight: 500; font-size: 0.85rem;"
                                            onclick="cancelBookingAction('${booking.id}')">
                                        <i class="bi bi-x-circle"></i> Cancel
                                    </button>
                                ` : `
                                    <span class="fw-bold small text-uppercase ${statusColor} pe-2" style="font-size: 0.85rem; letter-spacing: 0.8px;">
                                        ${booking.status}
                                    </span>
                                `}
                            </div>

                        </div>
                    </div>
                `;
            }).join('');
        })
        .catch(error => console.error("Error executing profile bookings loader sync:", error));
}

function renderLiveTouristReports() {
    const list = document.getElementById('my-reports-list');
    if (!list) return;
    list.innerHTML = `
        <div class="text-center py-4 text-muted bg-light border rounded">
            <i class="bi bi-shield-check fs-2 text-success"></i>
            <p class="small mb-0 mt-2">All submitted safety hazard logs verified active on Bagasbas Beach Map.</p>
        </div>`;
}
/*
const myBookings = [
    { id: "BK-001", tourist_name: "Jasmine C. Raviz", email: "jasmine@example.com", month: "MAY", day: "WED", num: "28", time: "8:00 - 11:00 AM", location: "Front of SurfSafe Office", status: "upcoming" },
    { id: "BK-002", tourist_name: "Ann Dominique C. Estrada", email: "ann.estrada@example.com", month: "JUNE", day: "MON", num: "01", time: "8:00 - 11:00 AM", location: "Bagasbas Beach Marker", status: "upcoming" }
]; 

const trainersData = [
    { name: "Jennie Kim", image: "assets/jennie.jpg", rate: 1300, active_days: ["M", "W", "F", "S"], expertise: ["Beginner Surfing", "Breath Control", "Water Safety"], hasProfile: true, schedules: { "2026-05-11": ["6:00 AM - 8:00 AM", "8:30 AM - 10:30 AM"], "2026-05-13": ["2:00 PM - 4:00 PM"], "2026-05-15": ["6:00 AM - 8:00 AM", "2:00 PM - 4:00 PM"] } },
    { name: "Kim Taehyung", image: "assets/v.jpg", rate: 1300, active_days: ["M", "T", "W", "TH", "F", "S", "SU"], expertise: ["Intermediate Surfing", "Longboarding"], hasProfile: true, schedules: { "2026-05-11": ["8:00 AM - 10:00 AM"], "2026-05-12": ["1:00 PM - 3:00 PM"] } },
    { name: "Im Nayeon", image: "assets/nayeon.jpg", rate: 1300, active_days: ["M", "T", "W", "TH", "F", "S", "SU"], expertise: ["Kids Surfing", "First Aid"], hasProfile: true, schedules: { "2026-05-14": ["6:00 AM - 8:00 AM"] } }
];

const touristActivityData = [
    { id: 'BK-2026-001', trainerName: 'Kim Taehyung', trainerEmail: 'v@surfsafe.com', trainerPhone: '+63 912 345 6789', date: 'May 28, 2026', time: '8:00 - 11:00 AM', location: 'Bagasbas Lighthouse', status: 'upcoming' }
]; */

const myReportsData = [
    { id: "REP-001", hazard_type: "Strong Current", description: "Noticeable strong rip currents near the main lifeguard tower. Surfers are advised to stay cautious.", latitude: "14.1332", longitude: "122.9861", reported_at: "May 12, 2026 | 09:15 AM", verification_status: "Approved" },
    { id: "REP-002", hazard_type: "Debris / Floating Logs", description: "Large logs spotted drifting near the shoreline after the heavy rain last night.", latitude: "14.1345", longitude: "122.9870", reported_at: "May 14, 2026 | 02:30 PM", verification_status: "Pending" },
    { id: "REP-003", hazard_type: "Jellyfish Alert", description: "Small group of box jellyfish seen near the beginner's area.", latitude: "14.1320", longitude: "122.9855", reported_at: "May 15, 2026 | 08:00 AM", verification_status: "Pending" }
];

/*
// AUTOMATICALLY BIND PREVIEW HANDLER WHEN THE PAGE LOADS - LYZETTE
document.addEventListener('DOMContentLoaded', () => {
    const avatarInput = document.getElementById('inputAvatar');
    
    if (avatarInput) {
        avatarInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const avatarPreview = document.getElementById('profileAvatar');
                    if (avatarPreview) {
                        avatarPreview.src = e.target.result;
                    }
                }
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
}); */