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
                        <a href="index.php">Home</a>
                        <a href="marine_data.php">Marine Data</a>
                        <a href="hazard_map.php">Hazard Map</a>
                        <a href="report.php">Report</a>
                        <a href="about.php">About</a>

                        <?php if (isset($_SESSION['user_id'])): ?>
                            <a href="trainers.php" id="nav-book-trainer" class="active">Trainers</a>
                            
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
                    <h2 class="fw-bold">ACCREDITED TRAINERS</h2>
                    <p class="text-primary small fw-bold">Book Now!</p>
                </div>

                <div id="trainers-list" class="row g-4">

                <!-- BAT DINAGDAG 'TO
                    <div class="col-12 text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="text-muted mt-2">Loading active shifts from Bagasbas Beach...</p>
                    </div>
                 -->
                    
                </div>
            </section>
        </main>
    </body>

    <div class="modal fade" id="trainerModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                <div class="modal-body p-0 position-relative">
                    <button class="nav-arrow prev-arrow" onclick="prevTrainer()">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <button class="nav-arrow next-arrow" onclick="nextTrainer()">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                    
                    <button type="button" class="btn-close position-absolute top-0 end-0 m-3 z-3" data-bs-dismiss="modal"></button>
                    
                    <div id="modal-trainer-details">
                        </div>
                </div>
            </div>
        </div>
    </div>

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

    <!-- BAT MAY PA 105 DITO -->
    <script src="script.js?v=105"></script>
</html>