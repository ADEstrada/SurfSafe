

<?php
session_start();
include '../includes/db.php';

// FOR THE SUMMARIZED DATA IN THE ADMIN DASHBOARD 

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = [
    'success' => false,
    'pending_reports' => 0,
    'weekly_bookings' => 0,
    'active_bookings' => 0,
    'active_hazards' => 0,
    'total_trainers' => 0 
];

if (isset($_SESSION['role']) && $_SESSION['role'] === 'Admin') {
    
    // COUNT PENDING REPORTS
    $q_pending_rep = "SELECT COUNT(id) AS total FROM hazard_reports WHERE verification_status = 'Pending'";
    $r_pending_rep = mysqli_query($conn, $q_pending_rep);
    if ($r_pending_rep) {
        $row = mysqli_fetch_assoc($r_pending_rep);
        $response['pending_reports'] = intval($row['total']);
    }

    // COUNT WEEKLY BOOKINGS (Current Week Mon-Sun)
    $q_weekly_books = "SELECT COUNT(booking_id) AS total FROM tourist_bookings 
                       WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) 
                       AND booking_status IN ('upcoming', 'completed')";
    $r_weekly_books = mysqli_query($conn, $q_weekly_books);
    if ($r_weekly_books) {
        $row = mysqli_fetch_assoc($r_weekly_books);
        $response['weekly_bookings'] = intval($row['total']);
    }

    // COUNT ACTIVE BOOKINGS (Status 'upcoming')
    $q_active_books = "SELECT COUNT(booking_id) AS total FROM tourist_bookings WHERE booking_status = 'upcoming'";
    $r_active_books = mysqli_query($conn, $q_active_books);
    if ($r_active_books) {
        $row = mysqli_fetch_assoc($r_active_books);
        $response['active_bookings'] = intval($row['total']);
    }

    // COUNT ACTIVE HAZARDS (Status 'Approved')
    $q_active_haz = "SELECT COUNT(id) AS total FROM hazard_reports WHERE verification_status = 'Approved'";
    $r_active_haz = mysqli_query($conn, $q_active_haz);
    if ($r_active_haz) {
        $row = mysqli_fetch_assoc($r_active_haz);
        $response['active_hazards'] = intval($row['total']);
    }

    // COUNT TOTAL VERIFIED TRAINERS 
    $q_total_trainers = "SELECT COUNT(*) as total FROM trainers_profiles WHERE profile_completed = 1";
    $r_total_trainers = mysqli_query($conn, $q_total_trainers);
    if ($r_total_trainers) {
        $row = mysqli_fetch_assoc($r_total_trainers);
        $response['total_trainers'] = intval($row['total']);
    }

    $response['success'] = true;
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>