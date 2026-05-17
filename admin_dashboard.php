<?php
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'Admin') {
    header("Location: login.html");
    exit();
}
?>

<!DOCTYPE html>

<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Admin Dashboard | SurfSafe</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="css/admin.css">
    </head>

    <body>

        <!-- SIDE BAR -->
        <div class="sidebar">
            <div class="sidebar-header">
                <img src="assets/logo.svg" alt="SurfSafe Logo" class="sidebar-logo">
            </div>

            <ul class="nav nav-pills flex-column mb-auto">
                <li class="nav-item">
                    <a href="#" class="nav-link active" id="btn-dashboard" onclick="switchAdminTab('dashboard', this)">
                        <i class="bi bi-speedometer2"></i> Dashboard
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" id="btn-trainers" onclick="switchAdminTab('trainers', this)">
                        <i class="bi bi-person-check"></i> Trainers
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" id="btn-reports" onclick="switchAdminTab('reports', this)">
                        <i class="bi bi-file-earmark-bar-graph"></i> Reports
                    </a>
                </li>
            </ul>

            <div class="p-3 border-top">
                <a href="index.php" class="btn btn-exit-admin w-100 btn-sm">
                    <i class="bi bi-box-arrow-left"></i> Exit to Site
                </a>
            </div>
        </div>

        <main class="main-content">

            <!-- DASHBOARD TAB -->
            <section id="tab-dashboard" class="admin-tab-content show-section">

                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="fw-bold mb-5">Dashboard</h2>
                </div>

                <!-- SUMMARIZE DATA -->
                <div class="row g-4 mb-5">

                    <!-- PENDING REPORTS --> 
                    <div class="col-lg-4 col-md-6 col-12 mb-3"> 
                        <div class="card stat-card blue-tint shadow-sm border-0 p-4">
                            <small class="text-uppercase fw-bold text-muted">Pending Reports</small>
                            <h1 id="stat-pending-reports" class="display-5 fw-bold mt-2">--</h1> 
                        </div>
                    </div>

                    <!-- TOTAL TRAINERS  -->
                    <div class="col-lg-4 col-md-6 col-12 mb-3"> 
                        <div class="card stat-card blue-tint shadow-sm border-0 p-4">
                            <small class="text-uppercase fw-bold text-muted">Total Trainers</small>
                            <h1 id="stat-total-trainers" class="display-5 fw-bold mt-2">--</h1> 
                        </div>
                    </div>

                    <!-- ACTIVE BOOKINGS -->
                    <div class="col-lg-4 col-md-6 col-12 mb-3"> 
                        <div class="card stat-card blue-tint shadow-sm border-0 p-4">
                            <small class="text-uppercase fw-bold text-muted">Active Bookings</small>
                            <h1 id="stat-active-bookings" class="display-5 fw-bold mt-2">--</h1> 
                        </div>
                    </div>
                </div>

                <!-- CURRENT STATUS  -->
                <div id="status-banner-container" class="current-status-banner p-4 text-white shadow-sm">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-clock-history"></i>
                            <span class="fw-bold">Current Status</span>
                        </div>
                        <span id="status-badge" class="badge rounded-pill bg-dark px-3 py-2">CHECKING...</span>
                    </div>
                    
                    <div class="mb-2">
                        <small class="text-uppercase opacity-75 surf-condition-label">Surf Condition</small>
                        <div class="progress mt-1 status-progress-container">
                            <div id="status-progress-bar" class="progress-bar"></div>
                        </div>
                    </div>
                    
                    <p class="mb-0 mt-3 small fw-semibold text-uppercase status-description-text">
                        Wave height is currently <span id="current-wave-height">--</span> 
                        at <span id="current-location">Bagasbas Point</span>. 
                        <span id="hazard-summary">Fetching real-time data...</span>
                    </p>
                </div>

                <!-- BOOKINGS ANALYTICS CHART -->
                <div class="row mt-5">
                    <div class="col-12">
                        <div class="card shadow-sm border-0 p-4">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h5 class="fw-bold mb-0">Booking Analytics</h5>
                                    <small class="text-muted">Total bookings per month</small>
                                </div>
                                <select id="chartYearFilter" class="form-select form-select-sm" style="width: auto;">
                                    <option selected>2026</option>
                                    <option>2027</option>
                                    <option>2028</option>
                                </select>
                            </div>
                            
                            <div style="position: relative; height:300px; width:100%">
                                <canvas id="bookingsChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            <!-- TRAINERS TAB  -->
            <section id="tab-trainers" class="admin-tab-content">

                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="fw-bold">Trainers</h2>
                    <div class="search-container">
                        <i class="bi bi-search"></i>
                        <input type="text" class="form-control search-input" placeholder="Search trainers...">
                    </div>
                </div>

                <!-- SUMMARIZE DATA  -->
                <div class="row g-4 mb-5">

                    <!-- TOTAL TRAINERS -->
                    <div class="col-lg-4 col-md-6 col-12 mb-3"> 
                        <div class="card stat-card blue-tint shadow-sm border-0 p-4">
                            <small class="text-uppercase fw-bold text-muted">Total Trainers</small>
                            <h1 id="stat-total-trainers-list" class="display-5 fw-bold mt-2">--</h1>
                        </div>
                    </div>

                    <!-- PENDING APPROVALS -->
                    <div class="col-lg-4 col-md-6 col-12 mb-3"> 
                        <div class="card stat-card blue-tint shadow-sm border-0 p-4">
                            <small class="text-uppercase fw-bold text-muted">Pending Approvals</small>
                            <h1 id="stat-pending-approvals" class="display-5 fw-bold mt-2">--</h1>
                        </div>
                    </div>

                    <!-- WEEKLY BOOKINGS -->
                    <div class="col-lg-4 col-md-6 col-12 mb-3"> 
                        <div class="card stat-card blue-tint shadow-sm border-0 p-4">
                            <small class="text-uppercase fw-bold text-muted">Weekly Bookings</small>
                            <h1 id="stat-weekly-bookings" class="display-5 fw-bold mt-2">--</h1>
                        </div>
                    </div>
                </div>

                <!-- APPROVAL QUEUE -->
                <div class="approval-section mb-5">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4 class="section-title mb-0">Review Applications</h4>
                        <span id="pending-count-badge" class="badge bg-secondary rounded-pill">0 New Applicants</span>
                    </div>
                    <div id="pending-applications-container"></div>
                </div>

                <!-- SCHEDULE CALENDAR -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <p class="mb-0 text-secondary">Real-time availability monitoring. Select a trainer to manage custom shifts.</p>
                    <div class="calendar-nav d-flex align-items-center">
                        <button class="btn btn-sm" onclick="changeMonth(-1)"><i class="bi bi-chevron-left"></i></button>
                        <span id="calendar-date-range" class="mx-3 small fw-bold text-uppercase">Loading...</span>
                        <button class="btn btn-sm" onclick="changeMonth(1)"><i class="bi bi-chevron-right"></i></button>
                    </div>
                </div>
                <div class="calendar-grid" id="trainer-calendar"></div>

            </section>

            <!-- REPORTS TAB -->
            <section id="tab-reports" class="admin-tab-content">

                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="fw-bold mb-5">Reports</h2>
                </div>

                <!-- SUMMARIZE DATA -->
                <div class="row g-4 mb-5">

                    <!-- PENDING REPORTS -->
                    <div class="col-lg-4 col-md-6 col-12 mb-3"> 
                        <div class="card stat-card blue-tint shadow-sm border-0 p-4">
                            <small class="text-uppercase fw-bold text-muted">Pending Reports</small>
                            <h1 id="stat-pending-reports-list" class="display-5 fw-bold mt-2">--</h1>
                        </div>
                    </div>

                    <!-- ACTIVE HAZARDS/REPORTS -->
                    <div class="col-lg-4 col-md-6 col-12 mb-3"> 
                        <div class="card stat-card blue-tint shadow-sm border-0 p-4">
                            <small class="text-uppercase fw-bold text-muted">Active Hazards</small>
                            <h1 id="stat-active-hazards" class="display-5 fw-bold mt-2">--</h1>
                        </div>
                    </div>

                    <!-- ACTIVE BOOKINGS -->
                    <div class="col-lg-4 col-md-6 col-12 mb-3"> 
                        <div class="card stat-card blue-tint shadow-sm border-0 p-4">
                            <small class="text-uppercase fw-bold text-muted">Active Bookings</small>
                            <h1 id="stat-active-bookings-list" class="display-5 fw-bold mt-2">--</h1>
                        </div>
                    </div>
                </div>

                <!-- VERIFICATION QUEUE FOR REPORTS -->
                <div class="row">
                    <div class="col-12">
                        <h6 class="text-uppercase fw-bold text-muted mb-4 small verification-queue-title">Verification Queue</h6>
                    </div>
                   <div class="col-md-5 mb-4">
                        <div id="admin-reports-queue" class="pe-2 queue-scroll-container">
                            
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div id="report-detail-container" class="report-detail-viewer shadow-sm">
                            <div id="no-selection-view" class="text-center h-100 d-flex flex-column align-items-center justify-content-center">
                                <i class="bi bi-eye text-muted mb-3" style="font-size: 2.5rem;"></i>
                                <h5 class="fw-bold">No Report Selected</h5>
                                <p class="text-muted small">Select a report from the queue to verify details.</p>
                            </div>

                            <div id="active-detail-view" class="d-none">
                                <div class="d-flex justify-content-between align-items-start mb-4">
                                    <div>
                                        <h4 id="detail-hazard-type" class="fw-bold mb-1">--</h4>
                                        <p id="detail-location" class="text-primary small mb-0"><i class="bi bi-geo-alt-fill"></i> --</p>
                                    </div>
                                    <div class="status-override-box">
                                        <label class="text-uppercase small fw-bold text-muted d-block mb-1" style="font-size: 10px;">Verify Status</label>
                                        <select id="admin-status-override" class="form-select form-select-sm fw-bold" onchange="updateStatusStyle(this)">
                                            <option value="Dangerous">Dangerous</option>
                                            <option value="Warning">Warning</option>
                                        </select>
                                    </div>
                                </div>
                                <hr>
                                <div class="report-info-grid">
                                    <div class="mb-4">
                                        <label class="text-uppercase small fw-bold text-muted d-block mb-1">Description</label>
                                        <p id="detail-description" class="text-dark">--</p>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 mb-3">
                                            <label class="text-uppercase small fw-bold text-muted d-block">Coordinates</label>
                                            <span id="detail-coordinates" class="small">--</span>
                                        </div>
                                        <div class="col-6 mb-3">
                                            <label class="text-uppercase small fw-bold text-muted d-block">Reported By</label>
                                            <span id="detail-reporter" class="small">--</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-5 d-flex gap-2">
                                    <button class="btn btn-outline-danger w-50 fw-bold py-2" onclick="processReport('reject')">REJECT</button>
                                    <button class="btn btn-primary w-50 fw-bold py-2" onclick="processReport('approve')">APPROVE & PUBLISH</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </main>

        <!-- POP UP FOR ASSIGNING SCHEDULE -->
       <div class="modal fade" id="assignShiftModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                    <div class="modal-header border-0">
                        <h5 class="modal-title fw-bold">Assign Training Shift</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="assignShiftForm">
                            
                            <div class="mb-4 position-relative">
                                <label for="trainerSearchInput" class="form-label small fw-bold">Assign Trainer</label>
                                <input type="text" id="trainerSearchInput" class="form-control modal-input" placeholder="Type trainer name..." autocomplete="off" required>
                                
                                <input type="hidden" id="selectedTrainerId" name="user_id">
                                
                                <div id="trainerSuggestionsList" class="list-group position-absolute w-100 shadow-lg d-none" style="z-index: 1050; max-height: 200px; overflow-y: auto; top: 100%;"></div>
                            </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label small fw-bold">Start Time</label>
                                        <input type="time" id="shiftStartTime" class="form-control modal-input" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label small fw-bold">End Time</label>
                                        <input type="time" id="shiftEndTime" class="form-control modal-input" required>
                                    </div>
                                </div>
                            <div class="alert alert-info border-0 mt-3 modal-alert">
                                <small class="d-block">
                                    <i class="bi bi-info-circle-fill"></i> This schedule will immediately be visible for booking.
                                </small>
                            </div>
                            <button type="submit" class="btn btn-exit-admin w-100 mt-3">Confirm Assignment</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- POPUP FOR DOCUMENT VERIFICATION -->
        <div class="modal fade" id="documentReviewModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0">
                        <h5 class="modal-title fw-bold" id="reviewerApplicantName">Reviewing:</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-0"> 
                        <div class="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
                            <h6 id="currentDocLabel" class="text-uppercase small fw-bold text-muted mb-0">Document Review</h6>
                            <span class="badge" id="docCounter" style="color: var(--surf-navy); background: var(--surf-lightblue)">1 / 5</span>
                        </div>
                        <div id="documentFrame"></div>
                        <div class="p-4 border-top bg-white">
                            <div id="docActionButtons" class="mb-4 text-center"></div>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-sm btn-link text-decoration-none text-muted fw-bold" onclick="navDoc(-1)">
                                    <i class="bi bi-chevron-left"></i> PREVIOUS
                                </button>
                                <button class="btn btn-sm btn-link text-decoration-none text-muted fw-bold" onclick="navDoc(1)">
                                    NEXT <i class="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="admin-script.js"></script>
</body>
</html>