<?php
session_start();
include '../includes/db.php';

// COMPLETE BOOKING - TRAINER FUNCTION

header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'message' => ''];

if (isset($_SESSION['user_id']) && ($_SESSION['role'] === 'Trainer' || $_SESSION['role'] === 'Admin')) {
    if (!isset($_POST['booking_id'])) {
        $response['message'] = "Missing reference identification token.";
        echo json_encode($response);
        exit();
    }

    $booking_id = intval($_POST['booking_id']);

    $query = "UPDATE tourist_bookings SET booking_status = 'completed' WHERE booking_id = $booking_id";

    if (mysqli_query($conn, $query)) {
        $response['success'] = true;
        $response['message'] = "Surf lesson successfully marked as completed!";
    } else {
        $response['message'] = "Database mutation layer error: " . mysqli_error($conn);
    }
} else {
    $response['message'] = "Unauthorized access authentication layer block.";
}

echo json_encode($response);
exit();
?>