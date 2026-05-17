<?php
session_start();
include '../includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'trainers' => []];

if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'Admin') {
    
    $query = "SELECT u.user_id, u.first_name, u.last_name, u.email, u.phone, 
                     tp.profile_pix, tp.experience_years, tp.specialization 
              FROM users u
              INNER JOIN trainers_profiles tp ON u.user_id = tp.user_id
              WHERE u.role = 'Trainer' 
              AND tp.profile_completed = 1
              ORDER BY u.first_name ASC";
              
    $result = mysqli_query($conn, $query);
    
    if ($result) {
        $trainers = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $trainers[] = [
                'user_id' => $row['user_id'],
                'name' => $row['first_name'] . ' ' . $row['last_name'],
                'email' => $row['email'],
                'phone' => $row['phone'],
                'image' => $row['profile_pix'] ? 'uploads/' . $row['profile_pix'] : 'assets/default-avatar.png',
                'experience' => $row['experience_years'],
                'specialization' => $row['specialization']
            ];
        }
        $response = ['success' => true, 'trainers' => $trainers];
    } else {
        $response['message'] = 'Database error: ' . mysqli_error($conn);
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>