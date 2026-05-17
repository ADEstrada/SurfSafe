<?php
session_start();
include '../includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'shifts' => []];

// FIXED QUERY: Fetches shifts, users, and profile details seamlessly - Lyzette
$query = "SELECT ts.shift_id, ts.user_id, ts.shift_date, ts.start_time, ts.end_time,
                 u.first_name AS trainer_name, u.last_name,
                 tp.specialization, tp.profile_pix AS image, tp.experience_years AS experience, tp.bio,
                 DAYNAME(ts.shift_date) AS day_name
          FROM trainer_shifts ts
          INNER JOIN users u ON ts.user_id = u.user_id
          INNER JOIN trainers_profiles tp ON u.user_id = tp.user_id
          WHERE u.role = 'Trainer' 
          AND u.is_approved = 1
          ORDER BY ts.shift_date ASC, ts.start_time ASC";

$result = mysqli_query($conn, $query);
$shiftsList = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $profile_img = !empty($row['image']) ? 'uploads/' . $row['image'] : 'assets/default-avatar.png';
        
        $shiftsList[] = [
            'shift_id' => intval($row['shift_id']),
            'user_id' => intval($row['user_id']),
            'trainer_name' => $row['trainer_name'] . ' ' . $row['last_name'],
            'image' => $profile_img,
            'specialization' => !empty($row['specialization']) ? $row['specialization'] : 'Surfing Instructor',
            'experience' => intval($row['experience']),
            'bio' => !empty($row['bio']) ? $row['bio'] : 'Accredited local surf instructor ready to catch waves!',
            'day_name' => $row['day_name'],
            'date_display' => date('F d, Y', strtotime($row['shift_date'])),
            'start_time' => date('g:i A', strtotime($row['start_time'])),
            'end_time' => date('g:i A', strtotime($row['end_time']))
        ];
    }
    $response = ['success' => true, 'shifts' => $shiftsList];
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>