<?php
session_start();
include 'includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'count' => 0];

if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'Admin') {
    
    $query = "SELECT COUNT(*) as total FROM trainers_profiles WHERE profile_completed = 1";
    $result = mysqli_query($conn, $query);
    
    if ($result) {
        $row = mysqli_fetch_assoc($result);
        $response['count'] = intval($row['total']);
        $response['success'] = true;
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>