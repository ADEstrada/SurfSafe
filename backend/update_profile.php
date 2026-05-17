<?php
session_start();
include '../includes/db.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

$response = ['success' => false, 'message' => 'Processing failure'];

if (!isset($_SESSION['user_id'])) {
    $response = ['success' => false, 'message' => 'Session invalid'];
} else {
    $user_id = intval($_SESSION['user_id']);
    $role = $_SESSION['role'];

    $email = isset($_POST['email']) ? mysqli_real_escape_string($conn, $_POST['email']) : '';
    $phone = isset($_POST['phone']) ? mysqli_real_escape_string($conn, $_POST['phone']) : '';

    if (isset($_POST['password']) && !empty($_POST['password'])) {
        $password_hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $userUpdateSql = "UPDATE users SET email = '$email', phone = '$phone', password_hash = '$password_hash' WHERE user_id = $user_id";
    } else {
        $userUpdateSql = "UPDATE users SET email = '$email', phone = '$phone' WHERE user_id = $user_id";
    }
    
    if (mysqli_query($conn, $userUpdateSql)) {
        $response = ['success' => true];

        if ($role === 'Trainer') {
            $exp_post = $_POST['experience'] ?? '0';
            $experience = preg_replace('/[^0-9]/', '', $exp_post);
            $experience_years = !empty($experience) ? intval($experience) : 0;
            
            $specialization = isset($_POST['specialization']) ? mysqli_real_escape_string($conn, $_POST['specialization']) : '';
            $bio = isset($_POST['bio']) ? mysqli_real_escape_string($conn, $_POST['bio']) : '';

            $avatar_filename = null;
            if (isset($_FILES['profile_pix']) && $_FILES['profile_pix']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['profile_pix']['tmp_name'];
                $fileName = $_FILES['profile_pix']['name'];
                $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
                
                $avatar_filename = time() . '_' . $user_id . '_avatar.' . $fileExtension;
                $uploadFileDir = 'uploads/';
                
                if (!is_dir($uploadFileDir)) {
                    mkdir($uploadFileDir, 0755, true);
                }
                
                move_uploaded_file($fileTmpPath, $uploadFileDir . $avatar_filename);
            }

            $checkQuery = "SELECT user_id, profile_pix FROM trainers_profiles WHERE user_id = $user_id";
            $checkResult = mysqli_query($conn, $checkQuery);

            $profile_completed = 1;

            if ($checkResult && mysqli_num_rows($checkResult) > 0) {
                $row = mysqli_fetch_assoc($checkResult);
                if ($avatar_filename === null) {
                    $avatar_filename = $row['profile_pix'];
                }

                $trainerSql = "UPDATE trainers_profiles SET 
                               profile_pix = " . ($avatar_filename ? "'$avatar_filename'" : "NULL") . ",
                               experience_years = $experience_years, 
                               specialization = '$specialization', 
                               bio = '$bio',
                               profile_completed = $profile_completed
                               WHERE user_id = $user_id";
            } else {
                $trainerSql = "INSERT INTO trainers_profiles (user_id, profile_pix, experience_years, specialization, bio, profile_completed) 
                               VALUES ($user_id, " . ($avatar_filename ? "'$avatar_filename'" : "NULL") . ", $experience_years, '$specialization', '$bio', $profile_completed)";
            }

            if (!mysqli_query($conn, $trainerSql)) {
                $response = ['success' => false, 'message' => 'Profile fields saved, image sync failed: ' . mysqli_error($conn)];
            }
        }
    } else {
        $response = ['success' => false, 'message' => 'Core fields update failure: ' . mysqli_error($conn)];
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
?>