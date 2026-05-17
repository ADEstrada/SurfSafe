<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}
$user_role = $_SESSION['role'];
$first_name = $_SESSION['first_name'];
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>SurfSafe - Profile</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

    <header class="navbar navbar-expand-md sticky-top shadow-sm">
        <div class="header-container">
            <img src="assets/logo.svg" alt="SurfSafe Logo" class="logo-icon">

            <button class="navbar-toggler custom-hamburger" type="button" data-bs-toggle="collapse" data-bs-target="#surfNavbar">
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
                    <a href="trainers.php" id="nav-book-trainer" class="<?php echo (isset($_SESSION['role']) && $_SESSION['role'] === 'Admin') ? 'd-none' : ''; ?>">Trainers</a>
                    <a href="my_bookings.php" id="nav-my-bookings" class="d-none">My Bookings</a>
                </nav>

                <div class="auth-wrapper">
                    <?php if (isset($_SESSION['user_id'])): ?>
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
                    <?php else: ?>
                        <div id="auth-controls" class="auth-buttons">
                            <a href="login.html" class="btn-login">Login</a>
                            <a href="signup.html" class="btn-signup">Sign Up</a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </header>

    <div class="profile-container mt-4">
        <form id="profileForm" enctype="multipart/form-data">

        <?php if ($user_role === 'Trainer'): ?>
                <div class="profile-header-card" id="profile-header-section"> 
                    
                    <div class="profile-img-wrapper position-relative text-center d-inline-block" style="width: 150px; height: 150px; min-width: 150px; min-height: 150px; background-color: #f0f3f8; border-radius: 50%;">
                        <img id="profileAvatar" src="https://placehold.co/150x150/00167A/FFFFFF?text=Surf+Coach" class="profile-pic-img" style="width: 150px; height: 150px; object-fit: cover; border-radius: 50%;" alt="Profile Picture">
                        
                        <label for="inputAvatar" class="btn btn-primary rounded-circle edit-field d-none position-absolute" style="cursor: pointer; z-index: 99; bottom: 0; right: 0; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; padding: 0; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
                            <i class="bi bi-camera-fill" style="font-size: 1.1rem; color: #ffffff;"></i>
                            <input type="file" id="inputAvatar" name="profile_pix" accept="image/*" class="d-none">
                        </label>
                    </div>

                    <div class="profile-info-main">
                        <h2 id="trainerName">Loading...</h2>
                        <span id="verificationBadge" class="trainer-status-badge d-none">
                            <i class="bi bi-patch-check-fill"></i> Verified Surf Trainer
                        </span>
                        <p class="location-label">
                            <i class="bi bi-geo-alt"></i> <span id="trainerLocation">Bagasbas Beach, Daet</span>
                        </p>
                    </div>
                </div>
        <?php endif; ?>

        <div class="profile-grid">
            
            <div class="side-card">
                <h3 class="section-subtitle-profile" id="sideCardTitle">
                    <?php echo ($user_role === 'Trainer') ? 'Trainer Details' : 'Tourist Account'; ?>
                </h3>
                
                <div class="info-row">
                    <span class="info-label">Email Address</span>
                    <span class="info-value display-field" id="trainerEmail">...</span>
                    <input type="email" id="inputEmail" class="form-control edit-field d-none">
                </div>

                <div class="info-row">
                    <span class="info-label">Password</span>
                    <span class="info-value display-field">********</span>
                    <input type="password" id="inputPassword" class="form-control edit-field d-none" placeholder="New password">
                </div>

                <div class="info-row">
                    <span class="info-label">Phone Number</span>
                    <span class="info-value display-field" id="trainerPhone">...</span>
                    <input type="text" id="inputPhone" class="form-control edit-field d-none">
                </div>

                <div class="info-row <?php echo ($user_role === 'Trainer') ? '' : 'd-none'; ?>" id="experience-section">
                    <span class="info-label">Experience Level</span>
                    <span class="info-value display-field" id="trainerExp">...</span>
                    <input type="text" id="inputExp" class="form-control edit-field d-none">
                </div>

                <div class="mt-4 d-grid gap-2">
                    <button id="editToggleBtn" class="btn btn-outline-primary w-100" type="button">
                        <?php echo ($user_role === 'Trainer') ? 'Edit Profile' : 'Update Info'; ?>
                    </button>
                    <button id="saveBtn" class="btn btn-primary w-100 d-none" type="button">Save Changes</button>
                </div>
            </div>

            <div class="profile-main-content">
                
                <?php if ($user_role === 'Trainer'): ?>
                <div class="main-profile-card" id="trainer-info-card">
                    <h3 class="section-subtitle-profile">Trainer Information</h3>
    
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label">Specialization</label>
                            <input type="text" id="inputSpecialization" class="form-control main-input" disabled>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label">Certifications</label>
                            <input type="text" id="inputCertifications" class="form-control main-input" disabled>
                        </div>
                    </div>

                    <div class="mt-3">
                        <label class="form-label">Bio / About Me</label>
                        <textarea id="inputBio" class="form-control main-input" rows="4" disabled></textarea>
                    </div>

                    <div class="section-subtitle-profile mt-4">Documents Uploaded</div>
                        <div id="trainer-documents-container" class="d-flex flex-column gap-2">
                            <p class="text-muted small mb-0">Loading registration documents...</p>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if ($user_role === 'Tourist'): ?>
                <div class="main-profile-card" id="tourist-activity-card">
                    <div class="activity-section">
                        <h3 class="section-subtitle-profile"><i class="bi bi-calendar-check me-2"></i>Recent Bookings</h3>
                        <div id="tourist-bookings-list" class="mt-3">
                            <p class="text-muted small">Manage your upcoming surf sessions and trainer schedules.</p>
                        </div>
                    </div>

                    <hr class="my-4">

                    <div class="activity-section">
                        <h3 class="section-subtitle-profile"><i class="bi bi-flag me-2"></i>My Reports</h3>
                        <div id="my-reports-list" class="mt-3">
                            <p class="text-muted small">View the history of safety reports you have submitted.</p>
                        </div>
                    </div>
                </div>
                <?php endif; ?>

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
    
    <!-- BAT MAY NUMBER -->
    <script src="script.js?v=102"></script>
</body>
</html>