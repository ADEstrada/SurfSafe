<?php
session_start();
include 'includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$shifts = [];

if (isset($_SESSION['user_id'])) {
    $query = "SELECT s.*, u.first_name, u.last_name 
              FROM trainer_shifts s
              INNER JOIN users u ON s.user_id = u.user_id
              ORDER BY s.shift_date ASC, s.start_time ASC";
              
    $result = mysqli_query($conn, $query);
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $shifts[] = [
                'id' => $row['shift_id'],
                'user_id' => $row['user_id'],
                'trainer_name' => $row['first_name'] . ' ' . $row['last_name'],
                'date' => $row['shift_date'],
                'start_time' => date('g:i A', strtotime($row['start_time'])),
                'end_time' => date('g:i A', strtotime($row['end_time']))
            ];
        }
    }
}

header('Content-Type: application/json');
echo json_encode($shifts);
exit();
?>