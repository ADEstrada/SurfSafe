<?php
session_start(); 
?>

<!DOCTYPE html>

<html lang="en">

    <head>

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>SurfSafe - Marine Data</title>

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
                        <a href="marine_data.php" class="active">Marine Data</a>
                        <a href="hazard_map.php">Hazard Map</a>
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

        <main class="marine-section">

            <!-- SUMMARY -->
            <section class="condition-summary">
                <div class="container">

                    <div class="summary-card">
                        <div class="row align-items-center">

                            <div class="col-md-6 text-center text-md-start">
                                <h1 class="location-title">Bagasbas Beach</h1>
                                <p class="current-date" id="live-date">--</p>
                            </div>

                            <div class="col-md-6 text-center text-md-end">
                                <div class="status-badge" id="surf-condition">--</div>
                                <p class="summary-text">Wind: <span id="current-wind-speed">--</span> kph <span id="current-wind-dir">--</span></p>
                            </div>

                            <a href="#" class="photo-credit-btn" data-bs-toggle="tooltip" title="Photography by @Sebastian Concina">
                                <i class="bi bi-camera-fill"></i>
                            </a>

                        </div>
                    </div>
                </div>
            </section>

            <!-- 7 DAY FORECAST SECTION -->
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

                    </div>
            </section>

            <!-- HOURLY WAVE HEIGHT SECTION -->
            <section class="hourly-forecast">
                <div class="container">

                    <h3 class="chart-title">Hourly Wave Height</h3>

                    <div class="chart-card">
                        <div class="chart-container">
                            <canvas id="waveChart"></canvas>
                        </div>
                    </div>

                    <div class="best-window-box">
                        <p>Best Surfing Window: <span id="best-time-window">--:--</span></p>
                    </div>

                </div>
            </section>

            <!-- TIDE CHART SECTION-->
            <section class="tide-forecast">
                <div class="container">

                    <h3 class="chart-title text-end">Tide Chart</h3>

                    <div class="tide-info-box">
                        <p>Next <span class="high-tide">high tide </span> in Daet is at <span id="next-high-time">--:--</span>, which is in <span class="high-tide-countdown"><span id="high-h">--</span> hr <span id="high-m">--</span> min <span id="high-s">--</span> s</span> from now.</p>
                        <p>Next <span class="low-tide">low tide</span> in Daet is at <span id="next-low-time">--:--</span>, which is in <span class="low-tide-countdown"><span id="low-h">--</span> hr <span id="low-m">--</span> min <span id="low-s">--</span> s</span> from now.</p>
                        <p>The local time in Daet is <span id="local-time">--:--:--</span>. See the detailed Daet tide chart below.</p>
                    </div>

                    <div class="chart-card">

                        <div class="chart-container">
                            <canvas id="tideChart"></canvas>
                        </div>
                    </div>

                </div>
            </section>

            <!-- WEATHER WIDGETS -->
            <section class="weather-details py-5">
                <div class="container">

                   
                        <h3 class="chart-title text-center mb-4">Current Weather Conditions</h3>

                        <div class="row g-4 text-center">
                            <div class="col-6 col-md-3">
                                <div class="detail-item">
                                    <i class="bi bi-compass fs-2 mb-2"></i>
                                    <p class="detail-label">Wind Direction</p>
                                    <h4 id="detail-wind-dir">--</h4>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="detail-item">
                                    <i class="bi bi-moisture fs-2 mb-2"></i>
                                    <p class="detail-label">Humidity</p>
                                    <h4 id="detail-humidity">--%</h4>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="detail-item">
                                    <i class="bi bi-eye fs-2 mb-2"></i>
                                    <p class="detail-label">Visibility</p>
                                    <h4 id="detail-visibility">-- km</h4>
                                </div>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="detail-item">
                                    <i class="bi bi-sun fs-2 mb-2"></i>
                                    <p class="detail-label">UV Index</p>
                                    <h4 id="detail-uv">--</h4>
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
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="script.js"></script>

</html>