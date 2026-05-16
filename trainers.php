<?php
session_start();
include 'includes/db.php';

$is_logged_in = isset($_SESSION['user_id']);
$user_role = $is_logged_in ? $_SESSION['role'] : '';
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>SurfSafe - Trainers</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="style.css">
    </head>

    <body>
        <header class="navbar navbar-expand-md sticky-top shadow-sm">
            <div class="header-container">
                <img src="assets/logo.svg" alt="SurfSafe Logo" class="logo-icon">

                <button class="navbar-toggler custom-hamburger collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#surfNavbar">
                    <div class="hamburger-lines">
                        <span class="line line1"></span>
                        <span class="line line2"></span>
                        <span class="line line3"></span>
                    </div>
                </button>

                <div class="collapse navbar-collapse" id="surfNavbar">
                    <nav class="nav-pages mx-auto">
                        <a href="index.php">Home</a>
                        <a href="marine_data.html">Marine Data</a>
                        <a href="hazard_map.html">Hazard Map</a>
                        <a href="report.html">Report</a>
                        <a href="about.html">About</a>
                        <a href="trainers.php" id="nav-book-trainer" class="active <?php echo ($user_role === 'Admin') ? 'd-none' : ''; ?>">Trainers</a>
                        <a href="my_bookings.php" id="nav-my-bookings" class="d-none">My Bookings</a>
                    </nav>

                    <?php if (!$is_logged_in): ?>
                     <div id="auth-controls" class="auth-buttons">
                        <a href="login.html" class="btn-login">Login</a>
                        <a href="signup.html" class="btn-signup">Sign Up</a>
                    </div>
                    <?php else: ?>
                    <div id="user-profile-section">
                        <div class="dropdown">
                            <a href="#" class="profile-link d-flex align-items-center dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-person-circle profile-nav-icon"></i>
                                <span class="ms-2">Profile</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="profileDropdown">
                                <li><a class="dropdown-item" href="profile.php"><i class="bi bi-pencil-square me-2"></i>Edit Profile</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item text-danger" href="logout.php"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </header>

        <main class="py-5">
            <section class="container text-center mb-5">
                <p class="text-primary fw-bold small mb-4">Why book via SurfSafe?</p>
                <div class="row g-4">
                    <div class="col-md-4">
                        <i class="bi bi-calendar-check fs-2 text-primary"></i>
                        <h6 class="fw-bold mt-3">Advance Booking</h6>
                        <p class="text-muted small">Plan your trip. See who's free days ahead.</p>
                    </div>
                    <div class="col-md-4">
                        <i class="bi bi-shield-check fs-2 text-primary"></i>
                        <h6 class="fw-bold mt-3">Verified Locals</h6>
                        <p class="text-muted small">Certified instructors from the local community.</p>
                    </div>
                    <div class="col-md-4">
                        <i class="bi bi-folder2 fs-2 text-primary"></i>
                        <h6 class="fw-bold mt-3">Standard Rates</h6>
                        <p class="text-muted small">No hidden fees. Pay the community-approved price.</p>
                    </div>
                </div>
            </section>

            <section class="container">
                <div class="text-center mb-5">
                    <h2 class="fw-bold">AVAILABLE SCHEDULES & COACHES</h2>
                    <p class="text-primary small fw-bold">Select an open shift to book your session!</p>
                </div>

                <div id="trainers-list" class="row g-4">
                    <div class="col-12 text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="text-muted mt-2">Loading active shifts from Bagasbas Beach...</p>
                    </div>
                </div>
            </section>
        </main>
    </body>

    <div class="modal fade" id="trainerModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-bold text-navy">Confirm Session Booking</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4">
                    <div id="modal-trainer-details">
                        </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js?v=105"></script>
</html>