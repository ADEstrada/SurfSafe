<?php
session_start();
include 'includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'bookings' => []];

if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'Trainer') {
    $trainer_id = intval($_SESSION['user_id']);

    $query = "SELECT tb.booking_id, tb.meetup_location, tb.booking_status, tb.selected_time, tb.additional_notes,
                     ts.shift_date,
                     u.first_name AS tourist_first, u.last_name AS tourist_last, u.email AS tourist_email
              FROM tourist_bookings tb
              INNER JOIN trainer_shifts ts ON tb.shift_id = ts.shift_id
              INNER JOIN users u ON tb.tourist_id = u.user_id
              WHERE ts.user_id = $trainer_id
              ORDER BY ts.shift_date DESC, tb.created_at DESC";

    $result = mysqli_query($conn, $query);
    if ($result) {
        $bookingsList = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $bookingsList[] = [
                'id' => $row['booking_id'],
                'tourist_name' => $row['tourist_first'] . ' ' . $row['tourist_last'],
                'email' => $row['tourist_email'],
                'date_display' => date('l, F d, Y', strtotime($row['shift_date'])),
                'selected_time' => $row['selected_time'],
                'location' => $row['meetup_location'],
                'notes' => !empty($row['additional_notes']) ? $row['additional_notes'] : 'No structural requests specified.',
                'status' => strtolower($row['booking_status'])
            ];
        }
        $response = ['success' => true, 'bookings' => $bookingsList];
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>