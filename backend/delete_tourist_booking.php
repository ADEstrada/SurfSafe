<?php
session_start();
include '../includes/db.php';

// FOR DELETING BOOKINGS

header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'message' => ''];

if (isset($_SESSION['user_id'])) {
    if (!isset($_POST['booking_id'])) {
        $response['message'] = "Missing target log identifier parameter payload.";
        echo json_encode($response);
        exit();
    }

    $booking_id = intval($_POST['booking_id']);
    $tourist_id = intval($_SESSION['user_id']);

    $query = "DELETE FROM tourist_bookings WHERE booking_id = $booking_id AND tourist_id = $tourist_id";

    if (mysqli_query($conn, $query)) {
        $response['success'] = true;
        $response['message'] = "Booking record successfully removed from your account history logs!";
    } else {
        $response['message'] = "Database destruction cycle failure: " . mysqli_error($conn);
    }
} else {
    $response['message'] = "Unauthorized access protocol block.";
}

echo json_encode($response);
exit();
?>