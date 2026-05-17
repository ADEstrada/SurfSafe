<?php
session_start(); 
?>

<!DOCTYPE html>

<html lang="en">

    <head>

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>SurfSafe - About</title>

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
                        <a href="about.php" class="active">About</a>

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
        

        <main class="about-page">
            <section class="about-hero">
                <div class="container">
                    <h1 class="brand-title">SURFSAFE</h1>
                    <p class="brand-tagline">Redefining Beach Safety & Local Livelihood</p>
                </div>
            </section>

            <section class="about-story py-5">
                <div class="container">
                    <div class="story-wrapper">
                        <div class="story-content">
                            <h2 class="section-title-navy">BEYOND THE WAVES</h2>
                            <p>Bagasbas Beach isn't just a destination; it's the <strong>Surfing Capital of Bicol</strong>. While the waves are consistent, the connection between surfers, trainers, and safety data has always been manual and fragmented.</p>
                            <p>SurfSafe was built to bridge this gap. We’ve integrated real-time marine intelligence with a community-driven alert system to ensure that your focus remains on the ride, not the risks.</p>
                        </div>
                        <div class="story-quote">
                            <p>"Our goal is a smart bridge that prioritizes safety in every transaction, making every visit to Bagasbas secure."</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="about-pillars py-5">
                <div class="container">
                    <div class="row g-4">
                        <div class="col-md-4">
                            <div class="pillar-card">
                                <div class="pillar-icon"><i class="bi bi-water"></i></div>
                                <h5>Marine Intelligence</h5>
                                <p>Fetches real-time wave height, wind speed, and tide levels from a Marine API to determine surfing conditions that you can actually understand.</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="pillar-card">
                                <div class="pillar-icon"><i class="bi bi-people"></i></div>
                                <h5>Community Alerts</h5>
                                <p>A live hazard module where  surfers and lifeguards pin real-time threats to protect the community.</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="pillar-card">
                                <div class="pillar-icon"><i class="bi bi-shield-check"></i></div>
                                <h5>Smart Booking</h5>
                                <p>Verified trainers coupled with automated safety checks to ensure ideal surfing conditions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
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
    <script src="script.js"></script>
</html>