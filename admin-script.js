// ADDED THIS TO HOLD THE DATA FETCHED FROM THE DATABASE FOR PENDING TRAINER APPLICATIONS AND REPORTS, AS WELL AS THE MONTHLY STATS FOR BOOKINGS - LYZETTE
let data = {
    pending: [],
    verified: [],
    reports: [],
    monthlyStats: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

// FOR SWITCHING TABS 
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

    const isMobile = window.innerWidth <= 575.98;

    if (!isMobile) {
        const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        days.forEach(day => {
            const div = document.createElement('div');
            div.className = 'grid-header';
            div.innerText = day;
            calendarGrid.appendChild(div);
        });
    }

    const year = currentPivotDate.getFullYear();
    const month = currentPivotDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });
    dateRangeEl.innerText = `${monthName} ${year}`;

    if (!isMobile) {
        let startDayIndex = firstDayOfMonth.getDay() - 1;
        if (startDayIndex === -1) startDayIndex = 6;

        for (let i = 0; i < startDayIndex; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'day-card empty-slot';
            calendarGrid.appendChild(emptyDiv);
        }
    }

    const totalDays = lastDayOfMonth.getDate();
    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(year, month, i);

        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));

        const dateISO = localDate.toISOString().split('T')[0];
        const isToday = date.toDateString() === new Date().toDateString();

        const dayLabel = date.toLocaleString('default', { weekday: 'short' });

        const card = document.createElement('div');
        card.className = `day-card ${isToday ? 'active-day' : ''}`;
        card.setAttribute('onclick', `openAssignModal('${dateISO}')`);
        
        card.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div d-flex flex-column>
                    <span class="day-name-mobile d-sm-none" style="display:block; font-size: 8px; font-weight: 700; color: var(--surf-grayish); line-height: 1;">${dayLabel.toUpperCase()}</span>
                    <span>${date.getDate()}</span>
                </div>
                ${isToday ? '<i class="bi bi-circle-fill" style="font-size: 8px; color: var(--surf-navy);"></i>' : ''}
            </div>
            <div class="schedule-slots" id="slots-${dateISO}">
                <small class="text-muted d-block mt-2" style="font-size: 10px; font-weight: 400; opacity: 0.6;">Click to assign</small>
            </div>
        `;
        calendarGrid.appendChild(card);
    }
}

// FUNCTION FOR CHANGING MONTH
function changeMonth(direction) {
    currentPivotDate.setMonth(currentPivotDate.getMonth() + direction);
    renderCalendar();
}

// THIS FUNCTION OPENS THE ASSIGN SHIFT MODAL AND SETS THE TARGET DATE FOR WHICH THE SHIFT IS BEING ASSIGNED - LYZETTE
let modalTargetDateISO = '';
function openAssignModal(dateString) {
    modalTargetDateISO = dateString;
    
    const searchInput = document.getElementById('trainerSearchInput');
    const hiddenIdInput = document.getElementById('selectedTrainerId');
    const suggestionsList = document.getElementById('trainerSuggestionsList');
    const shiftForm = document.getElementById('assignShiftForm');
    
    if (searchInput) searchInput.value = '';
    if (hiddenIdInput) hiddenIdInput.value = '';
    if (suggestionsList) {
        suggestionsList.innerHTML = '';
        suggestionsList.classList.add('d-none');
    }
    if (shiftForm) shiftForm.reset();

    const modal = new bootstrap.Modal(document.getElementById('assignShiftModal'));
    modal.show();
}

// DOCUMENTS MODAL (TRAINER APPROVAL) 

let currentReviewingAppId = null;
let currentDocIndex = 0;
const docTypes = ['dotCert', 'trainingCert', 'waterSafety', 'nbiClearance', 'drugTest'];
let applicationVerdicts = {};

// UPDATED THIS FUNCTION TO OPEN THE DOCUMENT REVIEW MODAL WITH THE CORRECT APPLICANT DATA AND DOCUMENT - LYZETTE
function viewDoc(docType, appId) {
    console.log("Button clicked! Looking for ID:", appId);
    
    currentReviewingAppId = appId;
    currentDocIndex = docTypes.indexOf(docType);

    if (!applicationVerdicts[appId]) {
        applicationVerdicts[appId] = {};
    }

    const cleanAppId = String(appId).trim();
    const applicant = data.pending.find(a => String(a.id).trim() === cleanAppId);

    if (applicant) {
        document.getElementById('reviewerApplicantName').innerText = `Reviewing: ${applicant.name}`;
        updateModalDocDisplay();

        const modalEl = document.getElementById('documentReviewModal');
        if (modalEl) {
            const reviewModal = bootstrap.Modal.getOrCreateInstance(modalEl);
            reviewModal.show();
        }
    } else {
        alert(`System Error: Could not find applicant with ID: ${appId}. Check the console.`);
    }
}

// UPDATED BACKEND FOR FETCHING AND DISPLAYING DOCUMENTS IN THE MODAL, AS WELL AS HANDLING APPROVAL/REJECTION OF EACH FILE - LYZETTE
function updateModalDocDisplay() {
    const appId = currentReviewingAppId;
    const docLabel = docTypes[currentDocIndex]; 

    const cleanAppId = String(appId).trim();
    const applicant = data.pending.find(a => String(a.id).trim() === cleanAppId);
    if (!applicant) return;

    const fileName = applicant.docs[docLabel]; 
    const previewArea = document.getElementById('documentFrame');

    if (!fileName || fileName.trim() === "") {
        previewArea.innerHTML = `
            <div class="p-5 text-center bg-light border-bottom" style="min-height: 400px; display: flex; flex-direction: column; justify-content: center;">
                <i class="bi bi-file-earmark-x text-muted" style="font-size: 4rem;"></i>
                <h5 class="mt-3 text-muted fw-bold">No Document Uploaded</h5>
                <p class="small text-muted">The applicant did not provide this file during signup.</p>
            </div>
        `;
    } else {
        const filePath = `uploads/${fileName}`; 
        
        previewArea.innerHTML = `
            <div class="w-100 text-center bg-dark" style="height: 65vh; overflow: hidden;">
                <iframe src="${filePath}" width="100%" height="100%" style="border: none;">
                    <p>Your browser does not support PDFs.</p>
                </iframe>
            </div>
            <div class="text-center p-2 bg-light border-bottom">
                <a href="${filePath}" target="_blank" class="btn btn-sm btn-outline-primary fw-bold">
                    <i class="bi bi-box-arrow-up-right"></i> Open File in New Tab
                </a>
            </div>
        `;
    }

    const friendlyNames = {
        'dotCert': 'DOT Accreditation',
        'trainingCert': 'Professional Training',
        'waterSafety': 'Water Safety & First Aid',
        'nbiClearance': 'NBI Clearance',
        'drugTest': 'Drug Test Result'
    };
    
    document.getElementById('currentDocLabel').innerText = `Document: ${friendlyNames[docLabel] || 'Unknown'}`;
    document.getElementById('docCounter').innerText = `${currentDocIndex + 1} / ${docTypes.length}`;

    const currentStatus = applicationVerdicts[appId] ? applicationVerdicts[appId][docLabel] : 'Pending';
    const footerAction = document.getElementById('docActionButtons');
    
    footerAction.innerHTML = `
        <div class="d-flex justify-content-center gap-3">
            <button class="btn ${currentStatus === 'Approved' ? 'btn-success' : 'btn-outline-success'} fw-bold px-4" 
                onclick="setFileVerdict('${docLabel}', 'Approved')">
                <i class="bi bi-check-lg"></i> Approve File
            </button>
            <button class="btn ${currentStatus === 'Rejected' ? 'btn-danger' : 'btn-outline-danger'} fw-bold px-4" 
                onclick="setFileVerdict('${docLabel}', 'Rejected')">
                <i class="bi bi-x-lg"></i> Reject File
            </button>
        </div>
    `;
}

// UPDATED THIS FUNCTION TO SET THE VERDICT FOR EACH FILE, CHECK THE OVERALL STATUS OF THE APPLICATION, AND NAVIGATE TO THE NEXT FILE IF APPROVED - LYZETTE
function setFileVerdict(docLabel, verdict) {
    const appId = currentReviewingAppId;
    applicationVerdicts[appId][docLabel] = verdict;
    
    updateModalDocDisplay();
    
    checkOverallStatus(appId);
    
    if (verdict === 'Approved') {
        const verdicts = Object.values(applicationVerdicts[appId]);
        const totalFiles = docTypes.length;
        
        if (verdicts.length < totalFiles || verdicts.includes('Pending')) {
            setTimeout(() => {
                navDoc(1);
            }, 500); 
        }
    }
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

// DONE UPDATING BACKEND FOR FINALIZING THE VERDICT AND UPDATING THE UI CARD IN PENDING APPLICATIONS - LYZETTE
function finalizeVerdict(appId, status) {
    const statusColor = status === 'Approved' ? '#198754' : '#dc3545';
    const card = document.getElementById(`app-${appId}`);
    
    fetch(`backend/process_trainer.php?id=${appId}&status=${status}`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const modalEl = document.getElementById('documentReviewModal');
                if (modalEl) {
                    const reviewModal = bootstrap.Modal.getInstance(modalEl);
                    if (reviewModal) reviewModal.hide();
                }
                updateUICard(card, status, statusColor, appId);
            } else {
                alert("Error processing application: " + result.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            alert("Network error. Could not reach the server.");
        });
}

function updateUICard(card, status, color, appId) {
    if (card) {
        card.innerHTML = `
            <div class="row align-items-center py-2">
                <div class="col-12 text-center">
                    <h5 class="mb-0 fw-bold" style="color: ${color}">
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
                const cleanAppId = String(appId).trim();
                data.pending = data.pending.filter(app => String(app.id).trim() !== cleanAppId);
                
                renderPendingApplications();
                
                const badge = document.getElementById('stat-pending-approvals');
                if (badge) badge.innerText = data.pending.length;
            }, 500);
        }, 2000); 
    }
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

// FOR THE VERIFICATION QUEUE
function renderReportsQueue() {
    const queueContainer = document.getElementById('admin-reports-queue');
    if (!queueContainer) return;

    fetch('backend/get_pending_hazards.php')
    .then(res => res.json())
    .then(resData => {
        if (resData.success) {
            data.reports = resData.reports;

            // FOR THE SUMMARIZE STATS
            const statReportsMain = document.getElementById('stat-pending-reports');
            if (statReportsMain) statReportsMain.innerText = data.reports.length;

            const statReportsList = document.getElementById('stat-pending-reports-list');
            if (statReportsList) statReportsList.innerText = data.reports.length;

            const queueBadge = document.getElementById('pending-count-badge');
            if (queueBadge) queueBadge.innerText = `${data.reports.length} New Hazard Reports`;

            if (data.reports.length === 0) {
                queueContainer.innerHTML = `
                    <div class="text-center py-5 text-muted bg-white border rounded shadow-sm">
                        <i class="bi bi-shield-check fs-2 text-success"></i>
                        <p class="small mb-0 mt-2">All Clear! No unprocessed hazard flags inside the database framework.</p>
                    </div>`;
                return;
            }
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
        })
        .catch(error => console.error("Error executing admin verification fetch cycle:", error));
}

// RIGHT SIDE - WHERE THE APPROVAL HAPPENS
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
    const activeItem = document.querySelector('.verification-item.active');
    if (!activeItem) {
        alert("Please select a report from the queue container first!");
        return;
    }

    const onclickStr = activeItem.getAttribute('onclick');
    const reportId = onclickStr.match(/\d+/)[0];

    const finalStatus = document.getElementById('admin-status-override').value;

    fetch(`backend/process_hazard.php?id=${reportId}&action=${action}&status=${finalStatus}`)
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert(result.message);

                // ANIMATION EFFECT FOR AUTOMATIC REMOVAL OF THE CARD
                activeItem.style.transition = "all 0.4s ease";
                activeItem.style.opacity = "0";
                activeItem.style.transform = "translateX(-30px)";

                setTimeout(() => {
                    document.getElementById('no-selection-view').classList.remove('d-none');
                    document.getElementById('active-detail-view').classList.add('d-none');
                    renderReportsQueue();

                    renderAdminActiveHazardsTable();
                }, 400);

            } else {
                alert("Database Error encountered: " + result.message);
            }
        })
        .catch(error => {
            console.error("Asynchronous admin operational validation failure:", error);
            alert("Network routing validation timeout failure.");
        });
}

// STATUS IN DASHBOARD (With Nighttime Guard Activation)
async function updateDashboardStatus(currentReports = []) {
    const lat = 14.1369; // Bagasbas Beach
    const lon = 122.9813;
    
    // Kinuha natin ang buong linggong saklaw para sa hourly monitoring
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=auto`;

    let waveHeight = 0.0; 
    const now = new Date();
    const currentHour = now.getHours();

    try {
        const response = await fetch(marineUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // INAYOS DITO: Tumpak nating hinahanap ang index kung saan tugma ang Taon, Buwan, Araw, at Oras para iwas bug sa magkasunod na araw
        const currentIndex = data.hourly?.time?.findIndex(t => {
            const d = new Date(t);
            return d.getDate() === now.getDate() && 
                   d.getMonth() === now.getMonth() && 
                   d.getFullYear() === now.getFullYear() && 
                   d.getHours() === currentHour;
        });

        const indexToUse = currentIndex !== -1 ? currentIndex : 0;
        waveHeight = data.hourly?.wave_height?.[indexToUse] || 0.0;
        
        console.log(`Real-time Wave Height fetched: ${waveHeight}m`);
    } catch (error) {
        console.error("Lead Architect API Error: Could not update dashboard in real-time.", error);
    }

    const banner = document.getElementById('status-banner-container');
    const badge = document.getElementById('status-badge');
    const progressBar = document.getElementById('status-progress-bar');
    const waveText = document.getElementById('current-wave-height');
    const hazardText = document.getElementById('hazard-summary');

    if (!banner) return;

    // Default parameters (Daylight operational limits template)
    let status = "GOOD TO GO";
    let badgeClass = "bg-success text-white"; 
    let progressColor = "#28a745"; 
    let summary = "Conditions are ideal for swimming and surfing. Enjoy the water!";

    let hasDangerous = false;
    try {
        if (Array.isArray(currentReports) && currentReports.length > 0) {
            hasDangerous = currentReports.some(r => {
                if (typeof getHazardStatus === "function") {
                    return getHazardStatus(r.hazard_type)?.status === "Dangerous";
                }
                return r.hazard_type === "Dangerous" || r.status === "Dangerous";
            });
        }
    } catch (err) {
        console.warn("Hazard check failed, defaulting to safe layout parsing:", err);
    }
    
    // =========================================================================
    // HETO ANG DAGDAG NA NIGHTTIME TIME GUARD LOGIC:
    // Kung ang kasalukuyang oras ng gabi ay 7:00 PM (19) pataas hanggang 5:00 AM (5) ng madaling araw:
    // =========================================================================
    if (currentHour >= 19 || currentHour < 5) {
        status = "CLOSED";
        badgeClass = "bg-dark text-white";
        progressColor = "#6c757d"; // Gray progress bar link indicator
        summary = "Bagasbas Beach surfing and swimming zones are currently CLOSED for the night. Swimming in the dark is highly dangerous.";
    } 
    // Opsyonal: Kung hindi pa gabi, doon pa lang nito babasahin ang mga Critical Hazards at Alon:
    else if (hasDangerous || waveHeight > 2.5) {
        status = "DANGEROUS";
        badgeClass = "bg-danger text-white";
        progressColor = "#dc3545"; 
        
        if (hasDangerous && waveHeight > 2.5) {
            summary = `CRITICAL: High waves (${waveHeight.toFixed(1)}m) and dangerous hazards reported! Stay out of the water.`;
        } else if (waveHeight > 2.5) {
            summary = `WARNING: Extremely high waves detected (${waveHeight.toFixed(1)}m). Conditions are unsafe for all activities.`;
        } else {
            summary = "DANGER: Critical hazards (e.g., strong currents or jellyfish) reported. Coordination with lifeguards is advised.";
        }
    } 
    else if (waveHeight > 1.8 || (Array.isArray(currentReports) && currentReports.length > 0)) {
        status = "EXERCISE CAUTION";
        badgeClass = "bg-warning text-dark";
        progressColor = "#ffc107"; 
        
        if (waveHeight > 1.8) {
            summary = `Moderate swell detected (${waveHeight.toFixed(1)}m). Beginner surfers and swimmers should be extra careful.`;
        } else {
            summary = "Caution: Minor hazards reported by the community. Stay alert and monitor your surroundings.";
        }
    } else {
        summary = "Bagasbas Beach is looking great! No significant wave or hazard threats detected as of the moment.";
    }
    // =========================================================================
        
    if (waveText) {
        waveText.innerText = `${waveHeight.toFixed(1)}m`;
    }

    if (badge) {
        badge.innerText = status;
        badge.className = `badge rounded-pill px-3 py-2 ${badgeClass}`;
    }

    if (hazardText) {
        hazardText.innerText = summary;
    }
    
    if (progressBar) {
        progressBar.style.backgroundColor = progressColor;
        progressBar.style.width = "100%";
        progressBar.style.transition = "all 0.5s ease"; 
    }
}// STATUS IN DASHBOARD (With Nighttime Guard Activation)
async function updateDashboardStatus(currentReports = []) {
    const lat = 14.1369; // Bagasbas Beach
    const lon = 122.9813;
    
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&timezone=auto`;

    let waveHeight = 0.0; 
    const now = new Date();
    const currentHour = now.getHours();

    try {
        const response = await fetch(marineUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // INAYOS DITO: Tumpak nating hinahanap ang index kung saan tugma ang Taon, Buwan, Araw, at Oras para iwas bug sa magkasunod na araw
        const currentIndex = data.hourly?.time?.findIndex(t => {
            const d = new Date(t);
            return d.getDate() === now.getDate() && 
                   d.getMonth() === now.getMonth() && 
                   d.getFullYear() === now.getFullYear() && 
                   d.getHours() === currentHour;
        });

        const indexToUse = currentIndex !== -1 ? currentIndex : 0;
        waveHeight = data.hourly?.wave_height?.[indexToUse] || 0.0;
        
        console.log(`Real-time Wave Height fetched: ${waveHeight}m`);
    } catch (error) {
        console.error("Lead Architect API Error: Could not update dashboard in real-time.", error);
    }

    const banner = document.getElementById('status-banner-container');
    const badge = document.getElementById('status-badge');
    const progressBar = document.getElementById('status-progress-bar');
    const waveText = document.getElementById('current-wave-height');
    const hazardText = document.getElementById('hazard-summary');

    if (!banner) return;

    // Default parameters (Daylight operational limits template)
    let status = "GOOD TO GO";
    let badgeClass = "bg-success text-white"; 
    let progressColor = "#28a745"; 
    let summary = "Conditions are ideal for swimming and surfing. Enjoy the water!";

    let hasDangerous = false;
    try {
        if (Array.isArray(currentReports) && currentReports.length > 0) {
            hasDangerous = currentReports.some(r => {
                if (typeof getHazardStatus === "function") {
                    return getHazardStatus(r.hazard_type)?.status === "Dangerous";
                }
                return r.hazard_type === "Dangerous" || r.status === "Dangerous";
            });
        }
    } catch (err) {
        console.warn("Hazard check failed, defaulting to safe layout parsing:", err);
    }
    
    if (currentHour >= 19 || currentHour < 5) {
        status = "CLOSED";
        badgeClass = "bg-dark text-white";
        progressColor = "#6c757d"; 
        summary = "Bagasbas Beach surfing and swimming zones are currently CLOSED for the night. Swimming in the dark is highly dangerous.";
    } 
    else if (hasDangerous || waveHeight > 2.5) {
        status = "DANGEROUS";
        badgeClass = "bg-danger text-white";
        progressColor = "#dc3545"; 
        
        if (hasDangerous && waveHeight > 2.5) {
            summary = `CRITICAL: High waves (${waveHeight.toFixed(1)}m) and dangerous hazards reported! Stay out of the water.`;
        } else if (waveHeight > 2.5) {
            summary = `WARNING: Extremely high waves detected (${waveHeight.toFixed(1)}m). Conditions are unsafe for all activities.`;
        } else {
            summary = "DANGER: Critical hazards (e.g., strong currents or jellyfish) reported. Coordination with lifeguards is advised.";
        }
    } 
    else if (waveHeight > 1.8 || (Array.isArray(currentReports) && currentReports.length > 0)) {
        status = "EXERCISE CAUTION";
        badgeClass = "bg-warning text-dark";
        progressColor = "#ffc107"; 
        
        if (waveHeight > 1.8) {
            summary = `Moderate swell detected (${waveHeight.toFixed(1)}m). Beginner surfers and swimmers should be extra careful.`;
        } else {
            summary = "Caution: Minor hazards reported by the community. Stay alert and monitor your surroundings.";
        }
    } else {
        summary = "Bagasbas Beach is looking great! No significant wave or hazard threats detected as of the moment.";
    }
        
    if (waveText) {
        waveText.innerText = `${waveHeight.toFixed(1)}m`;
    }

    if (badge) {
        badge.innerText = status;
        badge.className = `badge rounded-pill px-3 py-2 ${badgeClass}`;
    }

    if (hazardText) {
        hazardText.innerText = summary;
    }
    
    if (progressBar) {
        progressBar.style.backgroundColor = progressColor;
        progressBar.style.width = "100%";
        progressBar.style.transition = "all 0.5s ease"; 
    }
}


// FOR THE TOTAL BOOKING MONTHLY GRAPH 
let myAdminChartInstance = null; 

function initBookingsChart() {
    const ctx = document.getElementById('bookingsChart');
    if (!ctx) return; 

    const chartCtx = ctx.getContext('2d');
    
    const yearSelect = document.getElementById('chartYearFilter');
    const selectedYear = yearSelect ? yearSelect.value : '2026';

    fetch(`backend/get_booking_stats.php?year=${selectedYear}`)
        .then(res => res.json())
        .then(resData => {
            if (resData.success) {
                data.monthlyStats = resData.monthly_stats;

                if (myAdminChartInstance) {
                    myAdminChartInstance.destroy();
                }

                const blueGradient = chartCtx.createLinearGradient(0, 0, 0, 400);
                blueGradient.addColorStop(0, 'rgba(13, 110, 253, 0.8)');
                blueGradient.addColorStop(1, 'rgba(13, 110, 253, 0.2)');

                myAdminChartInstance = new Chart(chartCtx, {
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
        })
        .catch(error => console.error("Error executing dynamic analytics dashboard chart compilation:", error));
}

// BIND DROPDOWN CHANGE LISTENER FRAMEWORK
document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('chartYearFilter');
    if (yearSelect) {
        yearSelect.addEventListener('change', initBookingsChart);
    }
});

// UPDATED THIS FOR FETCHING REAL DATA FOR PENDING TRAINER APPLICATIONS AND REPORTS, AS WELL AS INITIALIZING THE DASHBOARD WITH REAL-TIME STATUS - LYZETTE
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    renderReportsQueue();
    initBookingsChart();

    renderAdminActiveHazardsTable();

    setTimeout(fetchAndRenderCalendarShifts, 200);

    // PROCESS NEW SHIFT SUBMISSIONS - LYZETTE
    const shiftForm = document.getElementById('assignShiftForm');
    if (shiftForm) {
        shiftForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const trainerId = document.getElementById('selectedTrainerId').value;
            const shiftDate = modalTargetDateISO; 
            
            const startTime = document.getElementById('shiftStartTime').value;
            const endTime = document.getElementById('shiftEndTime').value;

            if (!trainerId) {
                alert("Please select a trainer from the autocomplete list before confirming!");
                return;
            }

            const payload = new FormData();
            payload.append('user_id', trainerId);
            payload.append('shift_date', shiftDate);
            payload.append('start_time', startTime);
            payload.append('end_time', endTime);

            fetch('backend/save_trainer_shift.php', { method: 'POST', body: payload })
                .then(res => {
                    if (!res.ok) throw new Error("HTTP Status: " + res.status);
                    return res.json();
                })
                .then(result => {
                    if (result.success) {
                        alert("Shift allocated successfully!");
                        
                        const modalElement = document.getElementById('assignShiftModal');
                        const modalInstance = bootstrap.Modal.getInstance(modalElement);
                        if (modalInstance) modalInstance.hide();
                        
                        shiftForm.reset();
                        
                        fetchAndRenderCalendarShifts(); 
                    } else {
                        alert("Allocation Error: " + result.message);
                    }
                })
                .catch(error => {
                    console.error("Submission Failure:", error);
                    alert("Network processing error. Verify that save_trainer_shift.php exists.");
                });
        });
    }

    // FETCHES PENDING TRAINERS
    fetch('backend/get_pending_trainers.php')
        .then(response => response.json())
        .then(pendingData => {
            data.pending = pendingData; 
            renderPendingApplications();
            const pendingBadge = document.getElementById('stat-pending-approvals');
            if(pendingBadge) pendingBadge.innerText = data.pending.length;
        })
        .catch(error => console.error('Error fetching trainers:', error));

        // FETCHES SUMMARIZED DATA
        fetch('backend/get_dashboard_counters.php')
        .then(response => response.json())
        .then(countersData => {
            if (countersData.success) {
                
                // PENDING REPORTS 
                const statPendingMain = document.getElementById('stat-pending-reports');
                if (statPendingMain) statPendingMain.innerText = countersData.pending_reports;

                const statPendingList = document.getElementById('stat-pending-reports-list');
                if (statPendingList) statPendingList.innerText = countersData.pending_reports;

                // WEEKLY BOOKINGS 
                const weeklyBookingsCard = document.getElementById('stat-weekly-bookings');
                if (weeklyBookingsCard) {
                    weeklyBookingsCard.innerText = countersData.weekly_bookings;
                    const subLabelWeekly = weeklyBookingsCard.nextElementSibling;
                    if (subLabelWeekly && subLabelWeekly.innerText.includes('Waiting')) {
                        subLabelWeekly.innerText = "Bookings registered this week";
                    }
                }

                // ACTIVE BOOKINGS 
                const activeBookingElements = ['stat-active-bookings', 'stat-active-bookings-list'];
                activeBookingElements.forEach(id => {
                    const targetCard = document.getElementById(id);
                    if (targetCard) {
                        targetCard.innerText = countersData.active_bookings;
                        const subLabel = targetCard.nextElementSibling;
                        if (subLabel && subLabel.innerText.includes('Waiting')) {
                            subLabel.innerText = "Total upcoming surf sessions";
                        }
                    }
                });


                // ACTIVE HAZARDS COUNTERS
                const activeHazardElements = ['stat-active-hazards', 'stat-active-hazards-list'];
                activeHazardElements.forEach(id => {
                    const targetCard = document.getElementById(id);
                    if (targetCard) {
                        targetCard.innerText = countersData.active_hazards;
                        const subLabel = targetCard.nextElementSibling;
                        if (subLabel && subLabel.innerText.includes('Waiting')) {
                            subLabel.innerText = "Live verified danger indicators";
                        }
                    }
                });


                // TOTAL VERIFIED TRAINERS
                const mainDashboardCard = document.getElementById('stat-total-trainers');
                if (mainDashboardCard) {
                    mainDashboardCard.innerText = countersData.total_trainers;
                    const subLabelMain = mainDashboardCard.nextElementSibling;
                    if (subLabelMain && subLabelMain.innerText.includes('Waiting')) {
                        subLabelMain.innerText = "Verified & Active Profiles";
                    }
                }

                const trainersTabCard = document.getElementById('stat-total-trainers-list');
                if (trainersTabCard) {
                    trainersTabCard.innerText = countersData.total_trainers;
                    const subLabelList = trainersTabCard.nextElementSibling;
                    if (subLabelList && subLabelList.innerText.includes('Waiting')) {
                        subLabelList.innerText = "Completed Profiles Displayed";
                    }
                }
            }
        })
        .catch(error => console.error('Error executing master dashboard synchronization query:', error));


    updateDashboardStatus(data.reports);
});


// FETCH ONLY VERIFIED & COMPLETED TRAINERS FOR THE ADMIN BOOKING CALENDAR - LYZETTE
function populateCompletedTrainersDropdown() {
    const dropdown = document.getElementById('assignTrainerSelect');
    if (!dropdown) return;

    fetch('backend/get_available_trainers.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                dropdown.innerHTML = '<option value="" selected disabled>-- Select an Available Trainer --</option>';
                
                if (data.trainers.length === 0) {
                    dropdown.innerHTML = '<option value="" disabled>No trainers have completed profiles yet</option>';
                    return;
                }

                data.trainers.forEach(trainer => {
                    dropdown.innerHTML += `
                        <option value="${trainer.user_id}">
                            ${trainer.name} (${trainer.specialization} - ${trainer.experience} Yrs Exp)
                        </option>
                    `;
                });
            } else {
                console.error("Admin Error:", data.message);
            }
        })
        .catch(error => console.error("Network Fetch Error:", error));
}

// INITIALIZE COMPLETED TRAINER AUTCOMPLETE DISPLAYER - LYZETTE
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('trainerSearchInput');
    const suggestionsList = document.getElementById('trainerSuggestionsList');
    const hiddenIdInput = document.getElementById('selectedTrainerId');

    if (!searchInput || !suggestionsList) return;

    searchInput.addEventListener('input', function() {
        const value = this.value.trim();

        if (value.length === 0) {
            suggestionsList.innerHTML = '';
            suggestionsList.classList.add('d-none');
            hiddenIdInput.value = '';
            return;
        }

        fetch(`backend/get_completed_trainers.php?term=${encodeURIComponent(value)}`)
            .then(response => response.json())
            .then(trainers => {
                suggestionsList.innerHTML = '';

                if (trainers.length === 0) {
                    suggestionsList.innerHTML = `<div class="list-group-item text-muted small py-2">No completed trainer profiles found</div>`;
                    suggestionsList.classList.remove('d-none');
                    return;
                }

                trainers.forEach(trainer => {
                    const listItem = document.createElement('a');
                    listItem.href = '#';
                    listItem.className = 'list-group-item list-group-item-action py-2 px-3 small d-flex flex-column';
                    listItem.innerHTML = `
                        <span class="fw-bold text-dark">${trainer.name}</span>
                        <span class="text-muted extra-small" style="font-size: 0.75rem;">${trainer.email}</span>
                    `;

                    listItem.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        searchInput.value = trainer.name;
                        
                        hiddenIdInput.value = trainer.id;
                        
                        suggestionsList.innerHTML = '';
                        suggestionsList.classList.add('d-none');
                    });
                    suggestionsList.appendChild(listItem);
                });
                suggestionsList.classList.remove('d-none');
            })
            .catch(error => console.error("Autocomplete compilation breakdown:", error));
    });

    document.addEventListener('click', function(e) {
        if (e.target !== searchInput && e.target !== suggestionsList) {
            suggestionsList.innerHTML = '';
            suggestionsList.classList.add('d-none');
        }
    });
});

// RENDER ALL TRAINERS AND DISPLAY APPROVED STATUS COUNTS - LYZETTE
function renderTrainers() {
    const list = document.getElementById('trainers-list');
    if (!trainersData || trainersData.length === 0) return;

    const approvedCount = trainersData.filter(trainer => trainer.profile_completed == 1 || trainer.hasProfile === true).length;

    const mainDashboardCard = document.getElementById('stat-total-trainers');
    if (mainDashboardCard) {
        mainDashboardCard.innerText = approvedCount;
        const label = mainDashboardCard.nextElementSibling;
        if (label) label.innerText = "Verified & Active Profiles";
    }

    const trainersTabCard = document.getElementById('stat-total-trainers-list');
    if (trainersTabCard) {
        trainersTabCard.innerText = approvedCount;
        const labelList = trainersTabCard.nextElementSibling;
        if (labelList) labelList.innerText = "Completed Profiles Displayed";
    }

    if (!list) return;
    
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

// FETCH SHIFTS AND POPULATE CALENDAR DAYS DYNAMICALLY - LYZETTE
function fetchAndRenderCalendarShifts() {
    fetch('backend/get_trainer_shifts.php')
        .then(res => res.json())
        .then(shifts => {
            renderCalendar();

            shifts.forEach(shift => {
                const daySlotContainer = document.getElementById(`slots-${shift.date}`);
                if (daySlotContainer) {
                    if (daySlotContainer.innerHTML.includes('Click to assign')) {
                        daySlotContainer.innerHTML = '';
                    }

                    daySlotContainer.innerHTML += `
                        <div class="p-1 mb-1 rounded text-white bg-primary small text-truncate" style="font-size: 10px; font-weight: 600; line-height: 1.2;">
                            <i class="bi bi-person-fill"></i> ${shift.trainer_name}<br>
                            <span class="opacity-75" style="font-size: 9px;">${shift.start_time} - ${shift.end_time}</span>
                        </div>
                    `;
                }
            });
        })
        .catch(error => console.error("Error compilation fetching calendar shifts:", error));
}

// FUNCTION SO THAT PUBLISH HAXARDS WILL RENDER IN THE TABLE
function renderAdminActiveHazardsTable() {
    const tableBody = document.getElementById('admin-active-hazards-table-body');
    if (!tableBody) return;

    fetch('backend/get_active_hazards.php')
    .then(res => res.json())
    .then(resData => {
        if (resData.success) {
            const activeHazards = resData.hazards;

            if (activeHazards.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center py-4 text-muted small">
                            <i class="bi bi-shield-check text-success me-1"></i> No active hazard threats are currently published on the live map.
                        </td>
                    </tr>`;
                return;
            }

            tableBody.innerHTML = activeHazards.map(hazard => {
                let badgeClass = "bg-success text-white";
                if (hazard.status.toLowerCase() === 'dangerous') badgeClass = "bg-danger text-white";
                else if (hazard.status.toLowerCase() === 'warning') badgeClass = "bg-warning text-dark";

                return `
                    <tr id="active-hazard-row-${hazard.id}">
                        <td class="fw-bold text-uppercase small text-secondary">${hazard.hazard_type}</td>
                        <td class="small text-truncate" style="max-width: 250px;" title="${hazard.description}">${hazard.description}</td>
                        <td><span class="badge rounded-pill ${badgeClass} small fw-bold">${hazard.status.toUpperCase()}</span></td>
                        <td class="small">${hazard.reporter}</td>
                        <td class="small text-muted">${hazard.reported_at}</td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold" 
                                    style="font-size: 11px;"
                                    onclick="resolveLiveHazard(${hazard.id})">
                                <i class="bi bi-check2-circle"></i> Resolve Issue
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    })
    .catch(error => {
        console.error("Error compiler executing live active hazard table iteration:", error);
        tableBody.innerHTML = `<tr><td colspan="6" class="text-danger text-center small py-3">Error connecting to public hazard stream data.</td></tr>`;
    });
}

// FFUNCTION FOR THE BUTTON
function resolveLiveHazard(hazardId) {
    const rowElement = document.getElementById(`active-hazard-row-${hazardId}`);
    
    if (confirm(`Are you sure this beach hazard condition has been cleared and resolved?`)) {
        fetch(`backend/resolve_hazard.php?id=${hazardId}`)
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert(result.message);
                
                if (rowElement) {
                    rowElement.style.transition = "all 0.4s ease";
                    rowElement.style.backgroundColor = "#e8f5e9";
                    rowElement.style.opacity = "0";
                    
                    setTimeout(() => {
                       
                        renderAdminActiveHazardsTable();
                        
                        if (typeof renderReportsQueue === 'function') renderReportsQueue();
                    }, 400);
                }
            } else {
                alert("Operation failure inside framework: " + result.message);
            }
        })
        .catch(error => {
            console.error("Asynchronous admin dispatch operation exception caught:", error);
            alert("Network routing connection error.");
        });
    }
}