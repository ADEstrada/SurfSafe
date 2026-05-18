<?php
session_start();
include '../includes/db.php';
include 'backend/helpers.php';

header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'message' => '', 'cancelled_count' => 0];


$lat = 14.1369; 
$lon = 122.9813;
$marineUrl = "https://marine-api.open-meteo.com/v1/marine?latitude={$lat}&longitude={$lon}&hourly=wave_height,wind_speed_10m&timezone=auto";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $marineUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$apiResponse = curl_exec($ch);
curl_close($ch);

if (!$apiResponse) {
    $response['message'] = "Failed to connect to Open-Meteo API stream.";
    echo json_encode($response);
    exit();
}

$marineData = json_decode($apiResponse, true);
$hourly = $marineData['hourly'] ?? null;

if (!$hourly) {
    $response['message'] = "Invalid API payload architecture layout parsing.";
    echo json_encode($response);
    exit();
}

$currentHour = intval(date('H'));
$todayDateStr = date('Y-m-d'); 

$waveHeight = $hourly['wave_height'][$currentHour] ?? 0.0;
$windSpeed = $hourly['wind_speed_10m'][$currentHour] ?? 0.0;

$isUnsafe = ($waveHeight > 2.5 || $windSpeed > 30);

if ($isUnsafe) {
    $query = "SELECT tb.booking_id, tb.selected_time, 
                     u.email AS tourist_email, u.first_name AS tourist_name,
                     ts.shift_date,
                     tu.first_name AS trainer_name
              FROM tourist_bookings tb
              INNER JOIN trainer_shifts ts ON tb.shift_id = ts.shift_id
              INNER JOIN users u ON tb.tourist_id = u.user_id
              INNER JOIN users tu ON ts.user_id = tu.user_id
              WHERE ts.shift_date = '$todayDateStr' AND LOWER(tb.booking_status) = 'upcoming'";

    $result = mysqli_query($conn, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $cancelledCount = 0;

        while ($row = mysqli_fetch_assoc($result)) {
            $booking_id = $row['booking_id'];
            $tourist_email = $row['tourist_email'];
            $tourist_name = $row['tourist_name'];
            $booking_time = $row['selected_time'];
            $trainer_name = $row['trainer_name'];

            // Execute cancellation logic statement
            $updateQuery = "UPDATE tourist_bookings SET booking_status = 'cancelled' WHERE booking_id = $booking_id";
            if (mysqli_query($conn, $updateQuery)) {
                // Tatawagin na nito ang PHPMailer execution thread natin boi
                sendCancellationEmail($tourist_email, $tourist_name, $todayDateStr, $booking_time, $trainer_name);
                $cancelledCount++;
            }
        }
        $response['success'] = true;
        $response['message'] = "Danger alert triggered. Automatically cancelled {$cancelledCount} matching slots.";
        $response['cancelled_count'] = $cancelledCount;
    } else {
        $response['success'] = true;
        $response['message'] = "Conditions unsafe ({$waveHeight}m), but no active upcoming schedules found for today.";
    }
} else {
    $response['success'] = true;
    $response['message'] = "Sea conditions are within safe operational parameters ({$waveHeight}m).";
}

echo json_encode($response);
exit();
?>