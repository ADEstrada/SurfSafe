<?php
session_start();
include '../includes/db.php';

// FOR DELETE REPORT 
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'message' => ''];

if (isset($_SESSION['user_id'])) {
    if (!isset($_GET['id'])) {
        $response['message'] = "Missing targeted report identifier token.";
        echo json_encode($response);
        exit();
    }

    $report_id = intval($_GET['id']);
    $user_id = intval($_SESSION['user_id']);

    $query = "DELETE FROM hazard_reports WHERE id = $report_id AND reporter_id = $user_id";

    if (mysqli_query($conn, $query)) {
        $response['success'] = true;
        $response['message'] = "Hazard report successfully deleted from your history log!";
    } else {
        $response['message'] = "Database deletion layer failure: " . mysqli_error($conn);
    }
} else {
    $response['message'] = "Unauthorized access security block.";
}

echo json_encode($response);
exit();
?>