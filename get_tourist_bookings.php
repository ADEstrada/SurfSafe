<?php
session_start();
include 'includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'bookings' => []];

if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'Tourist') {
    $tourist_id = intval($_SESSION['user_id']);

    $query = "SELECT tb.booking_id, tb.meetup_location, tb.booking_status, tb.selected_time,
                     ts.shift_date, ts.start_time, ts.end_time,
                     u.first_name, u.last_name, u.email, u.phone
              FROM tourist_bookings tb
              INNER JOIN trainer_shifts ts ON tb.shift_id = ts.shift_id
              INNER JOIN users u ON ts.user_id = u.user_id
              WHERE tb.tourist_id = $tourist_id
              ORDER BY ts.shift_date DESC, ts.start_time DESC";

    $result = mysqli_query($conn, $query);
    if ($result) {
        $bookingsList = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $bookingsList[] = [
                'id' => $row['booking_id'],
                'trainer_name' => $row['first_name'] . ' ' . $row['last_name'],
                'trainer_email' => $row['email'],
                'trainer_phone' => $row['phone'] ? $row['phone'] : 'N/A',
                'date' => date('F d, Y', strtotime($row['shift_date'])),

                'selected_time' => !empty($row['selected_time']) ? $row['selected_time'] : (date('g:i A', strtotime($row['start_time'])) . ' - ' . date('g:i A', strtotime($row['end_time']))),
                
                'location' => $row['meetup_location'],
                'status' => $row['booking_status']
            ];
        }
        $response = ['success' => true, 'bookings' => $bookingsList];
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>