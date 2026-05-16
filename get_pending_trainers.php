<?php
session_start();
include 'includes/db.php';

$sql = "SELECT u.user_id, u.first_name, u.last_name, u.created_at, tp.* FROM Users u 
        JOIN Trainers_Profiles tp ON u.user_id = tp.user_id 
        WHERE u.role = 'Trainer' AND u.is_approved = 0";

$result = mysqli_query($conn, $sql);
$pending = [];

while ($row = mysqli_fetch_assoc($result)) {
    $pending[] = [
        'id' => $row['user_id'],
        'name' => $row['first_name'] . " " . $row['last_name'],
        'appliedDate' => date("M d, Y", strtotime($row['created_at'])),
        'docs' => [
            'dotCert' => $row['dot_cert'],
            'trainingCert' => $row['training_cert'],
            'waterSafety' => $row['water_safety'],
            'nbiClearance' => $row['nbi_clearance'],
            'drugTest' => $row['drug_test']
        ]
    ];
}

echo json_encode($pending);
?>