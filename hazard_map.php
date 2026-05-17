<?php
session_start(); 
?>

<!DOCTYPE html>

<html lang="en">

    <head>

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>SurfSafe - Hazard Map</title>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
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
                        <a href="hazard_map.php" class="active">Hazard Map</a>
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

        <main class="hazard-map-page">

            <div class="container py-4">
                <div class="text-center mb-4">
                    <h2 class="fw-bold">HAZARD MAP MONITORING</h2>
                    <p class="text-muted">
                        Live approved hazard reports around Bagasbas Beach.
                    </p>
                </div>
                
                <div class="hazard-map-container shadow-lg">
                    <div id="map"></div>
                </div>
            </div>
        </main>

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