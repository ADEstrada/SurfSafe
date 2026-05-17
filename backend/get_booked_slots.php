<?php
include '../includes/db.php';

$shift_id = isset($_GET['shift_id']) ? intval($_GET['shift_id']) : 0;
$reserved = [];

if ($shift_id > 0) {
    $query = "SELECT selected_time FROM tourist_bookings 
              WHERE shift_id = $shift_id 
              AND booking_status = 'upcoming' 
              AND selected_time IS NOT NULL 
              AND selected_time != ''";
              
    $result = mysqli_query($conn, $query);
    
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            if (strpos($row['selected_time'], ' - ') !== false) {
                $reserved[] = $row['selected_time'];
            }
        }
    }
}

header('Content-Type: application/json');
echo json_encode(['success' => true, 'reserved' => $reserved]);
exit();
?>