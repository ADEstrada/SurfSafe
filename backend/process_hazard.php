<!-- FOR THE PROCCESS OF REPORTED HAZARD -->
<?php
session_start();
include '../includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'message' => ''];

if (isset($_SESSION['role']) && $_SESSION['role'] === 'Admin') {
    $report_id = intval($_GET['id']);
    $action    = $_GET['action']; // APPROVE/REJECT

    if ($action === 'approve') {
        // IF APPROVED, STATUS CHANGES TO APPROVED
        $update_query = "UPDATE hazard_reports SET verification_status = 'Approved' WHERE id = $report_id";
    } else {
        // IF REJECTED, STATUS CHANGED TOO
        $update_query = "UPDATE hazard_reports SET verification_status = 'Rejected' WHERE id = $report_id";
    }

    if (mysqli_query($conn, $update_query)) {
        $response['success'] = true;
        $response['message'] = ($action === 'approve') ? "Hazard approved and successfully published!" : "Hazard report rejected.";
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