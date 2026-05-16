<?php
session_start();
include 'includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'message' => 'Unauthorized entry points'];

if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'Admin') {
    $user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
    $shift_date = isset($_POST['shift_date']) ? mysqli_real_escape_string($conn, $_POST['shift_date']) : '';
    $start_time = isset($_POST['start_time']) ? mysqli_real_escape_string($conn, $_POST['start_time']) : '';
    $end_time = isset($_POST['end_time']) ? mysqli_real_escape_string($conn, $_POST['end_time']) : '';

    if ($user_id > 0 && !empty($shift_date) && !empty($start_time) && !empty($end_time)) {
        $insertQuery = "INSERT INTO trainer_shifts (user_id, shift_date, start_time, end_time) 
                        VALUES ($user_id, '$shift_date', '$start_time', '$end_time')";
        
        if (mysqli_query($conn, $insertQuery)) {
            $response = ['success' => true, 'message' => 'Shift allocated successfully'];
        } else {
            $response['message'] = 'Database error: ' . mysqli_error($conn);
        }
    } else {
        $response['message'] = 'Missing required fields.';
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>