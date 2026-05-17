<!-- MAIN PURPOSE IS TO FETCH ALL PENDING HAZARDS TO BE APPROVE -->
<?php
session_start();
include '../includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = [
    'success' => false,
    'reports' => []
];

if (isset($_SESSION['role']) && $_SESSION['role'] === 'Admin') {
    $query = "SELECT id, hazard_type, description, latitude, longitude, reporter, verification_status,
                     DATE_FORMAT(reported_at, '%b %d, %Y | %h:%i %p') AS reported_at
              FROM hazard_reports
              WHERE verification_status = 'Pending'
              ORDER BY id DESC";

    $result = mysqli_query($conn, $query);

    if ($result) {
        $reports = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $reports[] = [
                'id' => intval($row['id']),
                'hazard_type' => $row['hazard_type'],
                'description' => $row['description'],
                'coordinates' => $row['latitude'] . ', ' . $row['longitude'],
                'location' => 'Bagasbas Beach Area', 
                'reporter' => $row['reporter'],
                'reported_at' => $row['reported_at']
            ];
        }
        $response['success'] = true;
        $response['reports'] = $reports;
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>