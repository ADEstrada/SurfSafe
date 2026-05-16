<?php
session_start();
include 'includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'message' => 'Processing failure'];

if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'Tourist') {
    $booking_id = isset($_POST['booking_id']) ? intval($_POST['booking_id']) : 0;
    $tourist_id = intval($_SESSION['user_id']);

    if ($booking_id > 0) {
        $query = "UPDATE tourist_bookings SET booking_status = 'cancelled' 
                  WHERE booking_id = $booking_id AND tourist_id = $tourist_id";
                  
        if (mysqli_query($conn, $query)) {
            $response = ['success' => true, 'message' => 'Booking cancelled successfully!'];
        } else {
            $response['message'] = 'Database alteration error: ' . mysqli_error($conn);
        }
    }
} else {
    $response['message'] = 'Unauthorized session permission parameters.';
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>