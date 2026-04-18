function switchAdminTab(tabName, element) {

    const sections = document.querySelectorAll('.admin-tab-content');
    sections.forEach(section => {
        section.classList.remove('show-section');
        section.style.display = 'none'; 
    });

    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    const targetSection = document.getElementById('tab-' + tabName);
    if (targetSection) {
        targetSection.classList.add('show-section');
        targetSection.style.display = 'block';
    }

    element.classList.add('active');
}
/* LEAD ARCHITECT: 
        1. FETCH TRAINER STATS AND UPDATE #stat-total-trainers.
        2. FETCH TRAINER SCHEDULES 
*/

let currentPivotDate = new Date(); 

function renderCalendar() {
    const calendarGrid = document.getElementById('trainer-calendar');
    const dateRangeEl = document.getElementById('calendar-date-range');
    if (!calendarGrid) return;

    calendarGrid.innerHTML = '';

    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    
    days.forEach(day => {
        const div = document.createElement('div');
        div.className = 'grid-header';
        div.innerText = day;
        calendarGrid.appendChild(div);
    });

    let startOfWeek = new Date(currentPivotDate);
    const dayNum = startOfWeek.getDay() || 7; 
    startOfWeek.setDate(startOfWeek.getDate() - (dayNum - 1));

    // UPDATES DATE RANGE DSPLAY
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    const options = { month: 'short', day: 'numeric' };
    dateRangeEl.innerText = `${startOfWeek.toLocaleDateString(undefined, options)} - ${endOfWeek.toLocaleDateString(undefined, options)}, ${endOfWeek.getFullYear()}`;

    // GENERATES DAY CARD
    for (let i = 0; i < 7; i++) {
        let date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        
        const card = document.createElement('div');
        const isToday = date.toDateString() === new Date().toDateString();
        card.className = `day-card ${isToday ? 'active-day' : ''}`;
        card.setAttribute('onclick', `openAssignModal('${date.toISOString().split('T')[0]}')`);
        
        card.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>${date.getDate()}</span>
                ${isToday ? '<i class="bi bi-circle-fill" style="font-size: 8px; color: var(--surf-navy);"></i>' : ''}
            </div>
            <div class="schedule-slots" id="slots-${date.toISOString().split('T')[0]}">
                <small class="text-muted d-block mt-2" style="font-size: 10px; font-weight: 400; opacity: 0.6;">Click to assign</small>
            </div>
        `;
        calendarGrid.appendChild(card);
    }
}

function changeWeek(direction) {
    currentPivotDate.setDate(currentPivotDate.getDate() + (direction * 7));
    renderCalendar();
}

function openAssignModal(dateString) {
    const modal = new bootstrap.Modal(document.getElementById('assignShiftModal'));
    modal.show();
}

// PENDING
function renderPendingApplications() {
    const container = document.getElementById('pending-applications-container');
    const badge = document.getElementById('pending-count-badge');
    
    badge.innerText = `${data.pending.length} New Applicants`;

    container.innerHTML = data.pending.map(app => `
        <div class="verification-card bg-white shadow-sm p-4 mb-3" id="app-${app.id}">
            <div class="row align-items-center">
                <div class="col-md-3">
                    <span class="applicant-name">${app.name}</span>
                    <small class="d-block text-muted">Applied: ${app.appliedDate}</small>
                </div>
                <div class="col-md-6 text-center">
                    <div class="doc-group">
                        <button class="btn-doc-pill" onclick="viewDoc('DOT', ${app.id})">DOT Cert</button>
                        <button class="btn-doc-pill" onclick="viewDoc('Training', ${app.id})">Training</button>
                        <button class="btn-doc-pill" onclick="viewDoc('Safety', ${app.id})">Safety</button>
                        <button class="btn-doc-pill" onclick="viewDoc('NBI', ${app.id})">NBI</button>
                        <button class="btn-doc-pill" onclick="viewDoc('Drug', ${app.id})">Drug Test</button>
                    </div>
                </div>
                <div class="col-md-3 text-end">
                    <button class="btn-approve" onclick="approveTrainer(${app.id})">Approve</button>
                    <button class="btn-reject" onclick="rejectTrainer(${app.id})">Reject</button>
                </div>
            </div>
        </div>
    `).join('');
}


document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
   // renderPendingApplications();
});
