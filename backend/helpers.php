<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php'; 

function sendCancellationEmail($touristEmail, $touristName, $bookingDate, $bookingTime, $trainerName) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';                    
        $mail->SMTPAuth   = true;
        $mail->Username   = 'surfsafebagasbas@gmail.com';       
        $mail->Password   = 'nfpwckcnghdjggfp';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('no-reply@surfsafe-bagasbas.com', 'SurfSafe Bagasbas');
        $mail->addAddress($touristEmail, $touristName);

        $mail->isHTML(true);
        $mail->Subject = "=?UTF-8?B?".base64_encode("⚠️ SurfSafe: Booking Cancellation Due to Weather Conditions")."?=";
        
        $mail->Body = "
        <div style='font-family: Poppins, Arial, sans-serif; padding: 20px; color: #333;'>
            <h2 style='color: #dc3545;'>Surf lesson session cancelled due to rough sea conditions</h2>
            <p>Dear <strong>" . htmlspecialchars($touristName) . "</strong>,</p>
            <p>We prioritize your safety above everything else. Our real-time Marine System has flagged the weather conditions at Bagasbas Beach as <strong>UNSAFE / DANGEROUS</strong> for surfing activities today.</p>
            <br>
            <div style='background-color: #f8f9fa; padding: 15px; border-left: 4px solid #dc3545; border-radius: 4px;'>
                <h4 style='margin-top:0; color:#555;'>Cancellation Details:</h4>
                <p style='margin: 5px 0;'><strong>Date:</strong> " . $bookingDate . "</p>
                <p style='margin: 5px 0;'><strong>Time Slot:</strong> " . $bookingTime . "</p>
                <p style='margin: 5px 0;'><strong>Instructor:</strong> " . htmlspecialchars($trainerName) . "</p>
            </div>
            <br>
            <p>Your booking status has been automatically moved to <strong>Cancelled</strong>. You may schedule a new surf session via the app once conditions return to normal safety guidelines.</p>
            <p>Stay safe,<br><strong>SurfSafe Bagasbas Team</strong></p>
        </div>
        ";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("PHPMailer Error details: " . $mail->ErrorInfo);
        return false;
    }
}
?>