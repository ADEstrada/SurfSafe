<?php
session_start();
include '../includes/db.php';

$response = ['success' => false, 'message' => 'Action validation failure'];

if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'Trainer') {
    $booking_id = isset($_POST['booking_id']) ? intval($_POST['booking_id']) : 0;
    $target_status = isset($_POST['target_status']) ? mysqli_real_escape_string($conn, $_POST['target_status']) : 'completed';

    if ($booking_id > 0) {
        $query = "UPDATE tourist_bookings SET booking_status = '$target_status' WHERE booking_id = $booking_id";
        
        if (mysqli_query($conn, $query)) {
            $response = ['success' => true, 'message' => 'Status updated successfully.'];
        } else {
            $response['message'] = 'Database error: ' . mysqli_error($conn);
        }
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>