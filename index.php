<?php
session_start();
?>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>SurfSafe - Home</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="css/style.css">

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
                        <a href="index.php" class="active">Home</a>
                        <a href="marine_data.php">Marine Data</a>
                        <a href="report.php">Report</a>
                        <a href="about.php">About</a>

                        <?php if (isset($_SESSION['user_id'])): ?>
                            <a href="trainers.php" id="nav-book-trainer">Trainers</a>
                            
                            <?php if ($_SESSION['role'] === 'Trainer'): ?>
                                <a href="my_bookings.php" id="nav-my-bookings">My Bookings</a>
                            <?php endif; ?>
                        <?php endif; ?>
                    </nav>

                    <div class="auth-wrapper">
                        <?php if (!isset($_SESSION['user_id'])): ?>
                            <div id="auth-controls" class="auth-buttons">
                                <a href="login.html" class="btn-login">Login</a>
                                <a href="signup.html" class="btn-signup">Sign Up</a>
                            </div>
                        <?php else: ?>
                            <div id="user-profile-section">
                                <div class="dropdown">
                                    <a href="#" class="profile-link d-flex align-items-center dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-person-circle profile-nav-icon"></i>
                                        <span class="ms-2"><?php echo htmlspecialchars($_SESSION['first_name']); ?></span>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="profileDropdown">
                                        <li><a class="dropdown-item" href="profile.php"><i class="bi bi-pencil-square me-2"></i>Edit Profile</a></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item text-danger" href="backend/logout.php"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                                    </ul>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>

                </div>
            </div>
        </header>

        <main class="home-section">

            <!-- INTRO SECTION -->
            <section class="intro-content">

                <div class="welcome-badge">WELCOME TO DAET, CAMARINES NORTE</div>

                <h1 class="main-title">Surf Smarter,<br>Stay Safe in Bagasbas.</h1>
                <p class="content-description">Bagasbas Beach's first integrated safety and surfing management platform. Explore, book, and surf with confidence.</p>

                <div class="cta-btns">
                    <a href="hazard_map.php" class="btn-safety"><i class="bi bi-shield-check"></i> Check Beach Safety</a>
                    <a href="#" class="btn-trainer btn-gatekeeper"><i class="bi bi-calendar-check"></i> Book a Trainer</a>
                </div>

                <a href="#" class="photo-credit-btn" data-bs-toggle="tooltip" title="Photography by @Sebastian Concina">
                    <i class="bi bi-camera-fill"></i>
                </a>

            </section>

            <!-- MARINE FORECAST PREVIEW SECTION  -->
            <section class="marine-data-preview">
                <div class="container text-center">

                    <div class="forecast-header">
                        <p class="forecast-badge">7-Day Forecast</p>
                        <h2 class="section-title">MARINE CONDITION</h2>
                        <p class="section-subtitle">Plan your surfing sessions ahead with our weekly sea state predictions.</p>
                    </div>

                    <div class="forecast-wrapper d-flex justify-content-center flex-wrap" id="forecastContainer"></div>

                    <template id="forecastCardTemplate">
                        <div class="forecast-card">
                            <h5 class="day-name"></h5>

                            <div class="data-group">
                                <i class="bi bi-water"></i>
                                <span class="data-value"><span class="wave-val">--</span>m</span>
                                <span class="data-label">WAVE</span>
                            </div>

                            <div class="data-group">
                                <i class="bi bi-wind"></i>
                                <span class="data-value"><span class="wind-val">--</span>kph</span>
                                <span class="data-label">WIND</span>
                            </div>

                            <div class="data-group">
                                <i class="bi bi-arrow-down-up"></i>
                                <span class="data-value tide-val">--</span>
                                <span class="data-label">TIDE</span>
                            </div>
                        </div>
                    </template>

                    <div class="mt-5">
                                <a href="marine_data.php" class="btn-detailed">View Detailed Marine Data</a>
                    </div>

                </div>
            </section>

            <!-- HAZARD MAP PREVIEW SECTION -->
            <section class="hazard-map-preview">
                <div class="container">

                    <div class="hazard-header text-start">
                        <h2 class="hazard-section-title">HAZARD MAP MONITORING</h2>
                        <p class="hazard-section-subtitle">Real-time visualization of Bagasbas beach safety status. From currents to jellyfish sightings, stay informed before you hit the water.</p>
                    </div>

                   <div class="map-container">
                        <div id="hazard-map-api" class="map-placeholder"></div>

                        <div class="map-overlay">
                            <a href="report.php#hazard-map-section" class="btn-full-map">VIEW FULL MAP</a>
                        </div>
                    </div>

                </div>
            </section>

            <!-- REPORTS PREVIEW SECTION -->
            <section class="reports-preview">
                <div class="container text-center">

                    <div class="report-badge-container">
                        <span class="report-badge">COMMUNITY CROWDSURFING</span>
                    </div>

                    <h2 class="report-description">Be informed about Bagasbas current news and status as shown by the community’s reported hazards like rip currents, jellyfish, or debris.</h2>

                    <div class="report-actions">
                                <a href="report.php" class="btn-see-reports">See Reports</a>
                    </div>

                    <a href="#" class="photo-credit-btn" data-bs-toggle="tooltip" title="Photography by @Sebastian Concina">
                        <i class="bi bi-camera-fill"></i>
                    </a>

                </div>
            </section>

            <!-- TRAINERS PREVIEW SECTION -->
            <section class="trainers-preview">
                <div class="container">
                    <div class="row align-items-center">

                        <div class="col-md-6 mb-4 mb-md-0">
                            <div class="trainer-img-wrapper">
                                <img src="assets/surfer.svg" alt="Girl Surfing" class="img-surf">
                                <a href="#" class="photo-credit-btn" data-bs-toggle="tooltip" title="Photography by Dave Rosima">
                                    <i class="bi bi-info-circle-fill"></i>
                                </a>
                            </div>
                        </div>

                        <div class="col-md-6 text-center text-md-center ps-md-5">
                            <p class="trainer-badge">PROFESSIONAL COACHING</p>
                            <h2 class="trainer-section-title">ACCREDITED TRAINERS</h2>
                            <p class="trainer-section-description">Master the waves with the help of Bagasbas’ finest instructors. View profiles and book sessions directly through our platform.</p>

                            <div class="mt-5">
                                <a href="#" class="btn-see-trainers btn-gatekeeper">See Trainers</a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </main>

        <!-- POPUP SIGNUP REQUIRED -->
        <div class="modal fade" id="authNudgeModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content auth-modal-content text-center">
                    <div class="modal-body p-5">
                        <i class="bi bi-lock-fill lock-icon"></i>

                        <h3 class="auth-modal-title">Members Only</h3>
                        <p class="auth-modal-text">To view our accredited trainers and book a surfing session, you need to have a SurfSafe account.</p>

                        <div class="d-grid gap-2 mt-4">
                            <a href="signup.html" class="btn-signup py-2">Create an Account</a>
                            <a href="login.html" class="btn-login py-2">Log In</a>
                        </div>

                        <button type="button" class="btn btn-maybe-later mt-2" data-bs-dismiss="modal">Maybe Later</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- POPUP SET PROFILE -->
        <div class="modal fade" id="touristFirstTimeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg text-center" style="border-radius: 24px; overflow: hidden;">

                    <div class="p-4 bg-primary text-white position-relative">
                        <div class="position-absolute top-0 start-0 w-100 h-100 opacity-10" style="background-image: radial-gradient(circle, #fff 10%, transparent 11%); background-size: 12px 12px;"></div>
                        <i class="bi bi-person-vcard fs-1 d-block mb-2 animate-bounce"></i>
                        <h4 class="fw-bold mb-0" style="letter-spacing: 0.5px;">Setup Your Tourist Profile!</h4>
                    </div>

                    <div class="modal-body p-4 bg-white text-dark">
                        <p class="fw-bold mb-2 text-dark" style="font-size: 1.1rem;">Welcome to SurfSafe Bagasbas!</p>
                        <p class="text-muted small mb-4" style="line-height: 1.5;">
                            To complete lesson bookings with our accredited local coaches securely, please take a quick moment to update your contact information first.
                        </p>

                        <div class="p-3 mb-4 rounded-3 d-flex align-items-start gap-2 text-start" style="background-color: #fff9e6; border-left: 4px solid #ffc107;">
                            <i class="bi bi-exclamation-triangle-fill text-warning fs-5 mt-0.5"></i>
                            <div class="small text-secondary">
                                <strong class="text-dark d-block mb-0.5">Booking Feature Gated:</strong>
                                You won't be able to lock in lesson schedules or receive onsite validation keys until a valid phone number is active in your database record.
                            </div>
                        </div>

                        <a href="profile.php" class="btn btn-primary w-100 py-2.5 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2" style="font-size: 0.95rem;">
                            <i class="bi bi-pencil-square"></i> Set Up Profile Now
                        </a>
                    </div>
                </div>
            </div>
        </div>

        </body>

            <footer class="main-footer mt-5">
                <div class="footer-top py-5">
                    <div class="container">
                        <div class="row gy-4">
                            <div class="col-lg-4 col-md-6">
                                <h5 class="footer-brand mb-3">Surf<span>Safe</span></h5>
                                <p class="footer-tagline">Bridging the gap between manual booking and real-time safety at Bagasbas Beach.</p>
                            </div>
                            
                            <div class="col-lg-4 col-md-6">
                                <h6 class="text-uppercase fw-bold mb-3">Contact Us</h6>
                                <ul class="list-unstyled footer-contact">
                                    <li><i class="bi bi-envelope-fill me-2"></i> <a href="mailto:surfsafebagasbas@gmail.com">surfsafebagasbas@gmail.com</a></li>
                                    <li><i class="bi bi-telephone-fill me-2"></i> <span>09089238207</span></li>
                                </ul>
                            </div>

                            <div class="col-lg-4 col-md-6">
                                <h6 class="text-uppercase fw-bold mb-3">Follow Our Community</h6>
                                <a href="https://www.facebook.com/profile.php?id=61589966697537" target="_blank" class="btn btn-outline-light btn-sm social-btn">
                                    <i class="bi bi-facebook me-2"></i>Bagasbas SurfSafe
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="footer-bottom py-3">
                    <div class="container text-center">
                        <p class="mb-0">&copy; 2026 <strong>SurfSafe</strong>. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script src="script.js"></script>

</html>