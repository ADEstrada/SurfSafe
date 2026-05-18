<?php
session_start();
include '../includes/db.php';

// SO THE USER CAN SEE THEIR OWN REPORTS

header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'reports' => []];

if (isset($_SESSION['user_id'])) {
    $user_id = intval($_SESSION['user_id']);

    // INAYOS DITO: Idinagdag natin ang `status` column sa SELECT query
    $query = "SELECT id, hazard_type, description, latitude, longitude, verification_status, status,
                     DATE_FORMAT(reported_at, '%b %d, %Y | %h:%i %p') AS reported_at
              FROM hazard_reports
              WHERE reporter_id = $user_id
              ORDER BY id DESC";

    $result = mysqli_query($conn, $query);

    if ($result) {
        $myReports = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $myReports[] = [
                'id' => intval($row['id']),
                'hazard_type' => $row['hazard_type'],
                'description' => $row['description'],
                'latitude' => floatval($row['latitude']),
                'longitude' => floatval($row['longitude']),
                'verification_status' => $row['verification_status'],
                'status' => $row['status'], 
                'reported_at' => $row['reported_at']
            ];
        }
        $response = ['success' => true, 'reports' => $myReports];
    } else {
        $response['message'] = "Database read error cycle: " . mysqli_error($conn);
    }
} else {
    $response['message'] = "Session identity verification missing.";
}

echo json_encode($response);
exit();
?>