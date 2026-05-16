<?php
session_start();
include 'includes/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];

    $sql = "SELECT * FROM Users WHERE email = '$email'";
    $result = mysqli_query($conn, $sql);
    
    if (mysqli_num_rows($result) > 0) {
        $user = mysqli_fetch_assoc($result);

        if (password_verify($password, $user['password_hash'])) {
            
            if ($user['role'] === 'Trainer') {
                if ($user['is_approved'] == 0) {
                    echo "<script>alert('Your account is still pending Admin approval.'); window.location.href='login.html';</script>";
                    exit();
                } elseif ($user['is_approved'] == 2) {
                    echo "<script>alert('Your application was rejected. Please contact the Admin.'); window.location.href='login.html';</script>";
                    exit();
                }
            }
            
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['first_name'] = $user['first_name'];

            if ($user['role'] === 'Admin') {
                header("Location: admin_dashboard.php");
            } elseif ($user['role'] === 'Trainer') {
                header("Location: index.php");
            } else {
                header("Location: index.php");
            }
            exit();

        } else {
            echo "<script>alert('Incorrect password.'); window.location.href='login.html';</script>";
        }
    } else {
        echo "<script>alert('Email not found.'); window.location.href='login.html';</script>";
    }
}
?>