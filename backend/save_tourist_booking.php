<?php
session_start();
include '../includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'message' => 'Processing failure'];

if (isset($_SESSION['user_id']) && $_SESSION['role'] === 'Tourist') {
    $tourist_id = intval($_SESSION['user_id']);
    $shift_id = isset($_POST['shift_id']) ? intval($_POST['shift_id']) : 0;
    $meetup_location = isset($_POST['meetup_location']) ? mysqli_real_escape_string($conn, $_POST['meetup_location']) : '';
    $additional_notes = isset($_POST['additional_notes']) ? mysqli_real_escape_string($conn, $_POST['additional_notes']) : '';
    $custom_time = isset($_POST['custom_time']) ? mysqli_real_escape_string($conn, $_POST['custom_time']) : '';

    if ($shift_id > 0 && !empty($meetup_location) && !empty($custom_time)) {
        
        list($start_str, $end_str) = explode(' - ', $custom_time);
        
        function convertTimeToMinutes($time_string) {
            $formatted24h = date("H:i", strtotime($time_string));
            list($hours, $minutes) = explode(':', $formatted24h);
            return (intval($hours) * 60) + intval($minutes);
        }
        
        $new_booking_start = convertTimeToMinutes($start_str);
        $new_booking_end = convertTimeToMinutes($end_str);

        $check_query = "SELECT selected_time FROM tourist_bookings 
                        WHERE shift_id = $shift_id AND booking_status = 'upcoming'";
        $check_result = mysqli_query($conn, $check_query);
        
        $schedule_conflict_found = false;
        
        if ($check_result) {
            while ($row = mysqli_fetch_assoc($check_result)) {
                if (!empty($row['selected_time'])) {
                    list($existing_start_str, $existing_end_str) = explode(' - ', $row['selected_time']);
                    $existing_start = convertTimeToMinutes($existing_start_str);
                    $existing_end = convertTimeToMinutes($existing_end_str);
                    
                    if ($new_booking_start < $existing_end && $new_booking_end > $existing_start) {
                        $schedule_conflict_found = true;
                        break;
                    }
                }
            }
        }

        if ($schedule_conflict_found) {
            $response['message'] = 'This time slot overlaps with an existing reservation for this coach. Please choose a different time.';
        } else {
            $query = "INSERT INTO tourist_bookings (tourist_id, shift_id, meetup_location, additional_notes, selected_time) 
                      VALUES ($tourist_id, $shift_id, '$meetup_location', '$additional_notes', '$custom_time')";
                      
            if (mysqli_query($conn, $query)) {
                $response = ['success' => true, 'message' => 'Your lesson has been booked successfully!'];
            } else {
                $response['message'] = 'Database insertion error: ' . mysqli_error($conn);
            }
        }
        
    } else {
        $response['message'] = 'Missing required shift, location, or custom time parameters.';
    }
} else {
    $response['message'] = 'Session invalid. Please log in as a tourist first.';
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>