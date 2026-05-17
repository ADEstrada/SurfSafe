<?php
// get_active_hazards.php
header('Content-Type: application/json');
session_start();

include 'includes/db.php';

$response = [
    'success' => false,
    'hazards' => []
];

try {
    $query = "SELECT id, hazard_type, description, latitude, longitude, reporter, verification_status AS status, DATE_FORMAT(reported_at, '%b %d, %Y | %h:%i %p') AS reported_at
              FROM hazard_reports
              WHERE verification_status = 'Approved'
              ORDER BY id DESC";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response['success'] = true;
    $response['hazards'] = $reports;

} catch (PDOException $e) {
    $response['message'] = "API Error context compilation lookup crash: " . $e->getMessage();
}

echo json_encode($response);
exit();
?>