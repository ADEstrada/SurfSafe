<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include 'includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'message' => 'Not authenticated'];

if (isset($_SESSION['user_id'])) {
    $user_id = intval($_SESSION['user_id']);
    $role = isset($_SESSION['role']) ? trim($_SESSION['role']) : '';

    $response = [
        'success' => true,
        'role' => $role,
        'user_id' => $user_id,
        'first_name' => '',
        'last_name' => '',
        'email' => '',
        'phone' => '',
        'profile_pix' => '',
        'experience' => '',
        'specialization' => '',
        'bio' => '',
        'documents' => [
            'dot_cert' => '',
            'training_cert' => '',
            'water_safety' => '',
            'nbi_clearance' => '',
            'drug_test' => ''
        ]
    ];

    $userQuery = "SELECT first_name, last_name, email, phone FROM users WHERE user_id = $user_id";
    $userResult = mysqli_query($conn, $userQuery);
    
    if ($userResult && $userRow = mysqli_fetch_assoc($userResult)) {
        $response['first_name'] = $userRow['first_name'] ?? '';
        $response['last_name'] = $userRow['last_name'] ?? '';
        $response['email'] = $userRow['email'] ?? '';
        $response['phone'] = $userRow['phone'] ?? '';
    }

    if (strcasecmp($role, 'Trainer') === 0) {
        $trainerQuery = "SELECT * FROM trainers_profiles WHERE user_id = $user_id";
        $trainerResult = mysqli_query($conn, $trainerQuery);
        
        if ($trainerResult && $trainerRow = mysqli_fetch_assoc($trainerResult)) {
            $response['profile_pix'] = $trainerRow['profile_pix'] ?? '';
            
            $response['experience'] = $trainerRow['experience_years'] ?? '';
            $response['specialization'] = $trainerRow['specialization'] ?? '';
            $response['bio'] = $trainerRow['bio'] ?? '';
            
            $response['documents']['dot_cert'] = $trainerRow['dot_cert'] ?? '';
            $response['documents']['training_cert'] = $trainerRow['training_cert'] ?? '';
            $response['documents']['water_safety'] = $trainerRow['water_safety'] ?? '';
            $response['documents']['nbi_clearance'] = $trainerRow['nbi_clearance'] ?? '';
            $response['documents']['drug_test'] = $trainerRow['drug_test'] ?? '';
        }
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>