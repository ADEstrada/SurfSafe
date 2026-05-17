<?php
include '../includes/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $first_name = mysqli_real_escape_string($conn, $_POST['first_name']);
    $last_name = mysqli_real_escape_string($conn, $_POST['last_name']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password_hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $role = $_POST['role'];

    $is_approved = ($role === 'Trainer') ? 0 : 1;

    $sql = "INSERT INTO Users (role, first_name, last_name, email, password_hash, is_approved) 
            VALUES ('$role', '$first_name', '$last_name', '$email', '$password_hash', '$is_approved')";

    if (mysqli_query($conn, $sql)) {
        $user_id = mysqli_insert_id($conn);

        if ($role === 'Trainer') {
            $target_dir = "uploads/";
            
            $file_map = [
                'dotCert' => 'dot_cert',
                'trainingCert' => 'training_cert',
                'waterSafety' => 'water_safety',
                'nbiClearance' => 'nbi_clearance',
                'drugTest' => 'drug_test'
            ];

            $db_values = [];

            foreach ($file_map as $html_name => $db_col) {
                $unique_name = "";
                if (!empty($_FILES[$html_name]["name"])) {
                    $unique_name = time() . "_" . $user_id . "_" . basename($_FILES[$html_name]["name"]);
                    move_uploaded_file($_FILES[$html_name]["tmp_name"], $target_dir . $unique_name);
                }
                $db_values[$db_col] = $unique_name;
            }

            $p_sql = "INSERT INTO Trainers_Profiles (user_id, dot_cert, training_cert, water_safety, nbi_clearance, drug_test) 
                      VALUES ('$user_id', 
                              '{$db_values['dot_cert']}', 
                              '{$db_values['training_cert']}', 
                              '{$db_values['water_safety']}', 
                              '{$db_values['nbi_clearance']}', 
                              '{$db_values['drug_test']}')";
            
            mysqli_query($conn, $p_sql);

            echo "<script>alert('Application submitted! Admin will review your documents.'); window.location.href='../login.html';</script>";
        } else {
            echo "<script>alert('Signup successful!'); window.location.href='../login.html';</script>";
        }
    }
}
?>