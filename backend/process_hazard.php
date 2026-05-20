<?php
session_start();
include '../includes/db.php';

// FOR THE PROCCESS OF REPORTED HAZARD -->

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'message' => ''];

if (isset($_SESSION['role']) && $_SESSION['role'] === 'Admin') {
    $report_id = intval($_GET['id']);
    $action    = $_GET['action']; // APPROVE/REJECT

    if ($action === 'approve') {
        
        $hazard_status = isset($_GET['status']) ? mysqli_real_escape_string($conn, $_GET['status']) : 'Safe';
        
        $update_query = "UPDATE hazard_reports 
                         SET verification_status = 'Approved', status = '$hazard_status' 
                         WHERE id = $report_id";
    } else {
        $update_query = "UPDATE hazard_reports 
                         SET verification_status = 'Rejected', status = 'Rejected' 
                         WHERE id = $report_id";
    }

    if (mysqli_query($conn, $update_query)) {
        $response['success'] = true;
        $response['message'] = ($action === 'approve') ? "Hazard approved and successfully published as $hazard_status!" : "Hazard report rejected.";
    } else {
        $response['message'] = "Database query update crash: " . mysqli_error($conn);
    }
} else {
    $response['message'] = "Unauthorized access template layer block.";
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>