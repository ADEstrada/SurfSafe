<?php
session_start();
include 'includes/db.php';


error_reporting(E_ALL);
ini_set('display_errors', 0);

$trainers = [];

if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'Admin') {
    
    $search = isset($_GET['term']) ? mysqli_real_escape_string($conn, $_GET['term']) : '';

    $query = "SELECT u.user_id, u.first_name, u.last_name, u.email 
              FROM users u
              INNER JOIN trainers_profiles tp ON u.user_id = tp.user_id
              WHERE u.role = 'Trainer' 
              AND tp.profile_completed = 1";

    if (!empty($search)) {
        $query .= " AND (u.first_name LIKE '%$search%' OR u.last_name LIKE '%$search%')";
    }

    $query .= " ORDER BY u.first_name ASC LIMIT 10";
    $result = mysqli_query($conn, $query);

    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $trainers[] = [
                'id' => $row['user_id'],
                'name' => $row['first_name'] . ' ' . $row['last_name'],
                'email' => $row['email']
            ];
        }
    }
}

header('Content-Type: application/json');
echo json_encode($trainers);
exit();
?>