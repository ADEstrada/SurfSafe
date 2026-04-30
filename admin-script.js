/* BACKEND AND LEAD ARCHITECT INSTRUCTION:
        SAME INSTRUCTIONS PO HEHE.

        *IF DONE, PLEASE REMOVE THE COMMENT I MADE FOR YOU.

        *IN ANY CASE, THAT SOME NEEDS TO BE CHANGED BUT I DON'T HAVE COMMENT FOR IT, PLEASE INFORM ME.

        *DONT REMOVE COMMENTS THAT ARE NOT FOR YOU.

        *SCRIPT FOR ADMIN IS IN admin-script.js AND CSS FOR ADMIN is in admin.css
*/

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

// FOR CALENDAR SCHEDULING
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

    const year = currentPivotDate.getFullYear();
    const month = currentPivotDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    let startDayIndex = firstDayOfMonth.getDay() - 1;
    if (startDayIndex === -1) startDayIndex = 6;

    const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });
    dateRangeEl.innerText = `${monthName} ${year}`;

    for (let i = 0; i < startDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day-card empty-slot';
        calendarGrid.appendChild(emptyDiv);
    }

    const totalDays = lastDayOfMonth.getDate();
    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(year, month, i);
        const dateISO = date.toISOString().split('T')[0];
        const isToday = date.toDateString() === new Date().toDateString();

        const card = document.createElement('div');
        card.className = `day-card ${isToday ? 'active-day' : ''}`;
        card.setAttribute('onclick', `openAssignModal('${dateISO}')`);
        
        card.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>${date.getDate()}</span>
                ${isToday ? '<i class="bi bi-circle-fill" style="font-size: 8px; color: var(--surf-navy);"></i>' : ''}
            </div>
            <div class="schedule-slots" id="slots-${dateISO}">
                <small class="text-muted d-block mt-2" style="font-size: 10px; font-weight: 400; opacity: 0.6;">Click to assign</small>
            </div>
        `;
        calendarGrid.appendChild(card);
    }
}

function changeMonth(direction) {
    currentPivotDate.setMonth(currentPivotDate.getMonth() + direction);
    renderCalendar();
}

function openAssignModal(dateString) {
    const modal = new bootstrap.Modal(document.getElementById('assignShiftModal'));
    modal.show();
}

/* DOCUMENTS MODAL (TRAINER APPROVAL) */

let currentReviewingAppId = null;
let currentDocIndex = 0;
const docTypes = ['dotCert', 'trainingCert', 'waterSafety', 'nbiClearance', 'drugTest'];
let applicationVerdicts = {};

function viewDoc(docType, appId) {
    currentReviewingAppId = appId;
    currentDocIndex = docTypes.indexOf(docType);
    
    if (!applicationVerdicts[appId]) {
        applicationVerdicts[appId] = {};
    }
    
    const applicant = data.pending.find(a => a.id === appId);
    document.getElementById('reviewerApplicantName').innerText = `Reviewing: ${applicant.name}`;
    
    updateModalDocDisplay();
    const reviewModal = new bootstrap.Modal(document.getElementById('documentReviewModal'));
    reviewModal.show();
}

function updateModalDocDisplay() {
    const appId = currentReviewingAppId;
    const docLabel = docTypes[currentDocIndex];

    const friendlyNames = {
        'dotCert': 'DOT Accreditation',
        'trainingCert': 'Professional Training',
        'waterSafety': 'Water Safety & First Aid',
        'nbiClearance': 'NBI Clearance',
        'drugTest': 'Drug Test Result'
    };
    
    const displayName = friendlyNames[docLabel] || 'Unknown Document';

    document.getElementById('currentDocLabel').innerText = `Document: ${displayName}`;
    document.getElementById('docCounter').innerText = `${currentDocIndex + 1} / ${docTypes.length}`;

    const previewArea = document.getElementById('documentFrame');

    /* BACKEND DEVELOPER: 
            REPLACE THIS FILE PATH LOGIC WITH YOUR ACTUAL SERVER-SIDE STORAGE PATH OR API ENDPOINT.
    */
    const filePath = `assets/documents/${appId}_${docLabel}`; 

    previewArea.innerHTML = `
    <div class="scrollable-content w-100 text-center" style="min-height: 1000px;">
        <object data="${filePath}.pdf" type="application/pdf" width="100%" style="min-height: 800px;">
            <img src="${filePath}.jpg" class="img-fluid rounded shadow-sm" alt="Document Preview" 
                 onerror="this.onerror=null; this.src='${filePath}.png';">
            
            <div class="onerror-fallback p-5 text-white">
                <i class="bi bi-file-earmark-exclamation shadow-sm" style="font-size: 3rem;"></i>
                <p class="mt-3">File format not supported or file not found.</p>
                <a href="${filePath}.pdf" target="_blank" class="btn btn-light btn-sm">Try downloading file</a>
            </div>
        </object>
    </div>
    `;

    const currentStatus = applicationVerdicts[appId][docLabel] || 'Pending';
    const footerAction = document.getElementById('docActionButtons');
    
    footerAction.innerHTML = `
        <div class="d-flex justify-content-center gap-3">
            <button class="btn ${currentStatus === 'Approved' ? 'btn-success' : 'btn-outline-success'} fw-bold" 
                onclick="setFileVerdict('${docLabel}', 'Approved')">
                <i class="bi bi-check-lg"></i> Approve File
            </button>
            <button class="btn ${currentStatus === 'Rejected' ? 'btn-danger' : 'btn-outline-danger'} fw-bold" 
                onclick="setFileVerdict('${docLabel}', 'Rejected')">
                <i class="bi bi-x-lg"></i> Reject File
            </button>
        </div>
    `;
}

function setFileVerdict(docLabel, verdict) {
    const appId = currentReviewingAppId;
    applicationVerdicts[appId][docLabel] = verdict;
    updateModalDocDisplay();
    checkOverallStatus(appId);
}

function checkOverallStatus(appId) {
    const verdicts = Object.values(applicationVerdicts[appId]);
    const totalFiles = docTypes.length;

    if (verdicts.includes('Rejected')) {
        finalizeVerdict(appId, 'Rejected');
    } 
    else if (verdicts.length === totalFiles && verdicts.every(v => v === 'Approved')) {
        finalizeVerdict(appId, 'Approved');
    }
}

/**
 * FINALIZE VERDICT
 * FOR BACKEND: IF STATUS APPROVED, MOVE THE TRAINER DATA FROM PENDING TO 
 * VERIFIED TABLE IN THE DATABASE
 */
function finalizeVerdict(appId, status) {
    const statusColor = status === 'Approved' ? '#198754' : '#dc3545';
    const card = document.getElementById(`app-${appId}`);
    
    if (card) {
        card.innerHTML = `
            <div class="row align-items-center py-2">
                <div class="col-12 text-center">
                    <h5 class="mb-0 fw-bold" style="color: ${statusColor}">
                        <i class="bi ${status === 'Approved' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i> 
                        RESULT: ${status.toUpperCase()}
                    </h5>
                </div>
            </div>
        `;

        setTimeout(() => {
            card.style.transition = "all 0.5s ease";
            card.style.opacity = "0";
            card.style.transform = "translateX(20px)"; 
            
            setTimeout(() => {
                data.pending = data.pending.filter(app => app.id !== appId);
                renderPendingApplications();
            }, 500);
        }, 3000); 
    }
    
    setTimeout(() => {
        const modalEl = document.getElementById('documentReviewModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
    }, 800);
}

function navDoc(direction) {
    currentDocIndex += direction;
    if (currentDocIndex < 0) currentDocIndex = docTypes.length - 1;
    if (currentDocIndex >= docTypes.length) currentDocIndex = 0;
    updateModalDocDisplay();
}

function renderPendingApplications() {
    const container = document.getElementById('pending-applications-container');
    const badge = document.getElementById('pending-count-badge');
    if (!container) return;

    badge.innerText = `${data.pending.length} New Applicants`;

    container.innerHTML = data.pending.map(app => `
        <div class="verification-card bg-white shadow-sm p-4 mb-3" id="app-${app.id}">
            <div class="row align-items-center">
                <div class="col-md-4">
                    <span class="applicant-name fw-bold" style="color: var(--surf-navy)">${app.name}</span>
                    <small class="d-block text-muted">Applied: ${app.appliedDate}</small>
                </div>
                <div class="col-md-8 text-end">
                    <div class="doc-group justify-content-end">
                        <span class="small text-muted me-2 mt-1">Review Files:</span>
                        <button class="btn-doc-pill" onclick="viewDoc('dotCert', ${app.id})">DOT Cert</button>
                        <button class="btn-doc-pill" onclick="viewDoc('trainingCert', ${app.id})">Training</button>
                        <button class="btn-doc-pill" onclick="viewDoc('waterSafety', ${app.id})">Safety</button>
                        <button class="btn-doc-pill" onclick="viewDoc('nbiClearance', ${app.id})">NBI</button>
                        <button class="btn-doc-pill" onclick="viewDoc('drugTest', ${app.id})">Drug Test</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// REPORTS SECTION

function getHazardStatus(hazardType) {
    const type = hazardType.toLowerCase();
    if (type.includes('rip') || type.includes('current') || type.includes('shark')) {
        return { status: "Dangerous", badgeClass: "bg-danger" };
    } 
    if (type.includes('life') || type.includes('jellyfish') || type.includes('debris')) {
        return { status: "Warning", badgeClass: "bg-warning text-dark" };
    }
}

function renderReportsQueue() {

    // BACKEND DEVELOPER: FETCH THE LIST OF UNPROCESSED HAZARD REPORTS FROM THE DATABASE.

    const queueContainer = document.getElementById('admin-reports-queue');
    if (!queueContainer) return;

    queueContainer.innerHTML = data.reports.map(report => `
        <div class="verification-item p-4 mb-3 border rounded-3 bg-white shadow-sm" 
             style="cursor: pointer;" 
             onclick="showReportDetails(${report.id}, this)">
            <h6 class="fw-bold text-uppercase mb-2" style="color: var(--surf-navy);">${report.reporter}</h6>
            <p class="small text-muted mb-3 text-truncate-2">${report.description}</p>
            <div class="d-flex align-items-center small text-primary">
                <i class="bi bi-geo-alt-fill me-2"></i>
                <span class="fw-semibold">${report.location}</span>
            </div>
        </div>
    `).join('');
}

function showReportDetails(reportId, element) {
    const report = data.reports.find(r => r.id === reportId);
    if (!report) return;

    document.querySelectorAll('.verification-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    document.getElementById('no-selection-view').classList.add('d-none');
    document.getElementById('active-detail-view').classList.remove('d-none');

    document.getElementById('detail-hazard-type').innerText = report.hazard_type;
    document.getElementById('detail-location').innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${report.location}`;
    document.getElementById('detail-description').innerText = report.description;
    document.getElementById('detail-coordinates').innerText = report.coordinates;
    document.getElementById('detail-reporter').innerText = report.reporter;
    
    const decision = getHazardStatus(report.hazard_type);
    
    const statusSelect = document.getElementById('admin-status-override');
    if (statusSelect) {
        statusSelect.value = decision.status;
        updateStatusStyle(statusSelect); 
    }
}

function updateStatusStyle(selectElement) {
    const status = selectElement.value;
    selectElement.className = "form-select fw-bold"; 
    
    if (status === 'Dangerous') selectElement.classList.add('text-danger', 'border-danger');
    else selectElement.classList.add('text-warning', 'border-warning');
}

function processReport(action) {

    /* LEAD ARCHITECT / BACKEND: 
            1. IF 'approve', UPDATE THE REPORT STATUS IN THE DB AND BROADCAST TO ALL USERS.
            2. IF 'reject', REMOVE OR ARCHIVE THE REPORT.
    */

    const finalStatus = document.getElementById('admin-status-override').value;
    const reportName = document.getElementById('detail-hazard-type').innerText;

    if (action === 'approve') {
        alert(`PUBLISHED: ${reportName} marked as ${finalStatus.toUpperCase()}`);
    } else {
        alert(`REPORT REJECTED: ${reportName} will not be posted.`);
    }
}

function updateTrainerDatalist() {
    // BACKEND DEVELOPER: POPULATE THIS DATALIST WITH THE NAMES OF VERIFIED TRAINERS FROM THE DATABASE.
   
    const datalist = document.getElementById('trainerList');
    if (!datalist) return;
    datalist.innerHTML = data.verified
        .map(trainer => `<option value="${trainer}">`)
        .join('');
}

function updateDashboardStatus(waveHeight, currentReports) {

    // LEAD ARCHITECT: INTEGRATE WEATHER/MARINE API HERE TO UPDATE DASHBOARD ANALYTICS IN REAL-TIME.

    const banner = document.getElementById('status-banner-container');
    const badge = document.getElementById('status-badge');
    const progressBar = document.getElementById('status-progress-bar');
    const waveText = document.getElementById('current-wave-height');
    const hazardText = document.getElementById('hazard-summary');

    if (!banner) return;

    waveText.innerText = `${waveHeight}m`;

    let status = "GOOD TO GO";
    let badgeClass = "bg-light text-primary";
    let progressColor = "#28a745"; 
    let summary = "No major hazards reported in the last 4 hours.";

    const hasDangerous = currentReports.some(r => getHazardStatus(r.hazard_type).status === "Dangerous");
    
    if (hasDangerous || waveHeight > 2.5) {
        status = "DANGEROUS";
        badgeClass = "bg-white text-danger";
        progressColor = "#dc3545"; 
        summary = "Critical hazards detected! Coordination with lifeguards is advised.";
    } 
    else if (waveHeight > 1.8 || currentReports.length > 0) {
        status = "EXERCISE CAUTION";
        badgeClass = "bg-warning text-dark";
        progressColor = "#ffc107"; 
        summary = "Moderate waves or minor hazards reported. Stay alert.";
    }

    badge.innerText = status;
    badge.className = `badge rounded-pill px-3 py-2 ${badgeClass}`;
    hazardText.innerText = summary;
    
    progressBar.style.backgroundColor = progressColor;
    progressBar.style.width = "100%";
}

// FOR THE TOTAL BOOKING MONTHLY GRAPH 
function initBookingsChart() {

    // UPDATE THIS TO GET REAL DATA

    const ctx = document.getElementById('bookingsChart');
    if (!ctx) return; 

    const chartCtx = ctx.getContext('2d');
    
    const blueGradient = chartCtx.createLinearGradient(0, 0, 0, 400);
    blueGradient.addColorStop(0, 'rgba(13, 110, 253, 0.8)');
    blueGradient.addColorStop(1, 'rgba(13, 110, 253, 0.2)');

    new Chart(chartCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Total Bookings',
                data: data.monthlyStats, 
                backgroundColor: blueGradient,
                borderColor: '#0d6efd',
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    renderPendingApplications(); 
    renderReportsQueue();
    updateTrainerDatalist();
    initBookingsChart();

    updateDashboardStatus(currentWave, data.reports);
});

//  DUMMY DATA - FOR TESTING ONLY 

const currentWave = 1.2; // MOCK FOR THE CURRENT STATUS IN DASHBOARD

// MOCK FOR THE APPLICANTS
const data = {
    pending: [
        { id: 1, name: "Juan Dela Cruz", appliedDate: "Oct 12, 2024" },
        { id: 2, name: "Lyzette Rivera", appliedDate: "Apr 15, 2026" }
    ],
    verified: ["Juan Dela Cruz", "Maria Santos", "Bagasbas Surfer", "Jasmine Lopez"],
    
    // MOCK FOR REPORTS
    reports: [
        {
            id: 101,
            reporter: "Admin_SurfSafe",
            hazard_type: "Rip Current",
            location: "Central Bagasbas Beach",
            description: "Strong rip currents detected near the main tower.",
            coordinates: "14.1332° N, 122.9861° E"
        },
        {
            id: 102,
            reporter: "Trainer_Jhon",
            hazard_type: "Marine Life",
            location: "North Surf Point",
            description: "Minor jellyfish sightings reported near the north reef.",
            coordinates: "14.1350° N, 122.9875° E"
        }
    ],

    // MOCK FOR THE GRAPH IN DASHBOARD
    monthlyStats: [12, 19, 15, 25, 32, 45, 50, 38, 20, 15, 10, 22]
};