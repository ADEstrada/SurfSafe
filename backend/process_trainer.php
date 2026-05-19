<?php
ob_start();
error_reporting(0);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../includes/PHPMailer/Exception.php';
require '../includes/PHPMailer/PHPMailer.php';
require '../includes/PHPMailer/SMTP.php';

include '../includes/db.php';

$response = ['success' => false, 'message' => 'Unknown error'];

if (isset($_GET['id']) && isset($_GET['status'])) {
    $id = intval($_GET['id']);
    $status = $_GET['status']; 

    $is_approved = ($status === 'Approved') ? 1 : 2; 

    $sql = "UPDATE Users SET is_approved = $is_approved WHERE user_id = $id";

    if (mysqli_query($conn, $sql)) {
        
        $emailQuery = "SELECT email, first_name FROM Users WHERE user_id = $id";
        $result = mysqli_query($conn, $emailQuery);
        
        if ($row = mysqli_fetch_assoc($result)) {
            $to = $row['email'];
            $name = $row['first_name'];
            
            // --- PHPMAILER SETUP ---
            $mail = new PHPMailer(true);

            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com'; 
                $mail->SMTPAuth   = true;
                
                $mail->Username   = 'surfsafebagasbas@gmail.com';
                $mail->Password   = 'nfpwckcnghdjggfp'; 
                
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                $mail->SMTPOptions = array(
                    'ssl' => array(
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true
                    )
                );

                $mail->setFrom('surfsafebagasbas@gmail.com', 'SurfSafe Bagasbas Admin');
                $mail->addAddress($to, $name); 

                $mail->isHTML(true);
                
                if ($status === 'Approved') {
                    $mail->Subject = 'SurfSafe Bagasbas - Application Approved!';
                    $mail->Body    = "<h3>Welcome to the team, $name!</h3>
                                      <p>Great news! Your trainer application is <strong>APPROVED</strong>.</p>
                                      <p>You can now log in to your dashboard to manage your availability on Bagasbas Beach.</p>";
                } else {
                    $mail->Subject = 'SurfSafe Bagasbas - Application Update';
                    $mail->Body    = "<h3>Hello $name,</h3>
                                      <p>Unfortunately, your application was declined due to missing or invalid documents.</p>
                                      <p>Please contact the admin for further clarification.</p>";
                }

                $mail->send();
                $response = ['success' => true];

            } catch (Exception $e) {
                $response = ['success' => true, 'message' => "Approved, but email failed: {$mail->ErrorInfo}"];
            }
        } else {
            $response = ['success' => true]; 
        }
    } else {
        $response = ['success' => false, 'message' => 'Database error'];
    }
}

ob_end_clean();
header('Content-Type: application/json');
echo json_encode($response);
?>