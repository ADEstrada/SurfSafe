<?php
// get_active_hazards.php
header('Content-Type: application/json');
session_start();

include '../includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = [
    'success' => false,
    'hazards' => []
];

// FIXED: Pinalitan ng MySQLi driver query loop pattern para tugma sa includes/db.php ninyo
$query = "SELECT id, hazard_type, description, latitude, longitude, reporter, verification_status AS status, 
                 DATE_FORMAT(reported_at, '%b %d, %Y | %h:%i %p') AS reported_at
          FROM hazard_reports
          WHERE verification_status = 'Approved'
          ORDER BY id DESC";

$result = mysqli_query($conn, $query);

if ($result) {
    $reports = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $reports[] = [
            'id' => intval($row['id']),
            'hazard_type' => $row['hazard_type'],
            'description' => $row['description'],
            'latitude' => floatval($row['latitude']),
            'longitude' => floatval($row['longitude']),
            'reporter' => $row['reporter'],
            'status' => $row['status'],
            'reported_at' => $row['reported_at']
        ];
    }
    $response['success'] = true;
    $response['hazards'] = $reports;
} else {
    $response['message'] = "Database framework error: " . mysqli_error($conn);
}

echo json_encode($response);
exit(); 
?>