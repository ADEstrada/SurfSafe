<!-- FOR THE BOOKING ANALYTICS GRAPH  -->
<?php
session_start();
include '../includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = [
    'success' => false,
    'monthly_stats' => array_fill(0, 12, 0) 
];

if (isset($_SESSION['role']) && $_SESSION['role'] === 'Admin') {
    
    // GET THE YEAR
    $year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');

    $query = "SELECT MONTH(created_at) as month_num, COUNT(booking_id) as total_bookings 
              FROM tourist_bookings 
              WHERE YEAR(created_at) = $year AND booking_status IN ('upcoming', 'completed')
              GROUP BY MONTH(created_at)";

    $result = mysqli_query($conn, $query);

    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $monthIndex = intval($row['month_num']) - 1; 
            $response['monthly_stats'][$monthIndex] = intval($row['total_bookings']);
        }
        $response['success'] = true;
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>