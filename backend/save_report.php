
<?php
session_start();
include '../includes/db.php';

// FOR SUBMITTING REPORT -->

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'message' => ''];

// GATEKEEPER
if (isset($_SESSION['user_id'])) {
    $reporter_id = intval($_SESSION['user_id']);
    
    // FETCHES THE NAME OF THE REPORTER 
    $first_name = isset($_SESSION['first_name']) ? $_SESSION['first_name'] : 'Active';
    $last_name = isset($_SESSION['last_name']) ? $_SESSION['last_name'] : 'User';
    $full_reporter_name = $first_name . ' ' . $last_name;

    $hazard_type = mysqli_real_escape_string($conn, $_POST['hazard_type']);
    $description = mysqli_real_escape_string($conn, $_POST['description']);
    $latitude    = mysqli_real_escape_string($conn, $_POST['latitude']);
    $longitude   = mysqli_real_escape_string($conn, $_POST['longitude']);

    if (empty($hazard_type) || empty($description) || empty($latitude) || empty($longitude)) {
        $response['message'] = "Validation error: Missing targeted map coordinates or hazard indicators.";
    } else {
        $insert_query = "INSERT INTO hazard_reports (reporter_id, hazard_type, description, latitude, longitude, reporter, verification_status) 
                         VALUES ($reporter_id, '$hazard_type', '$description', '$latitude', '$longitude', '$full_reporter_name', 'Pending')";

        if (mysqli_query($conn, $insert_query)) {
            $response['success'] = true;
            $response['message'] = "Report submitted successfully! Waiting for Admin verification.";
        } else {
            $response['message'] = "Database insertion path failure: " . mysqli_error($conn);
        }
    }
} else {
    $response['message'] = "Authentication error: Session token invalid or expired.";
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>