<?php

namespace App\Models;

 use App\Models\ModifyUser;
 use App\User;
 use Illuminate\Support\Facades\Hash;
 
class EmailRecover extends Model {

    public function __contruct()
    {
    
    }

    public function email()
    {
        require '../vendor/phpmailer/phpmailer/PHPMailerAutoload.php';
        $mail = new \PHPMailer;                              // Enable verbose debug output

        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
        $mail->Debugoutput = 'html';
        $mail->SMTPDebug = 0;
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'teltonikatest123@gmail.com';                 // SMTP username
        $mail->Password = 'teltonikatest';                           // SMTP password
        $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 587;                                    // TCP port to connect to       
         return $mail;
    }

    public function sendEmailRecover($email,$token,$id)
    {
        $mail = $this->email();     
        $mail->setFrom('recovery@gmail.com', 'Admin');
        $mail->AddAddress($email);               // Name is optional
        $mail->isHTML(true);                    // Set email format to HTML
        
        $path = 'http://localhost/room_booking/Angular/#!/forgot/' . $token;
        $expire = $this->getExpireDate();
        
        $view = view('emailMessage', ['expire' => $expire, 'path' => $path]);
        $contents = (string) $view;
        $contents = $view->render();
        
        $mail->Subject = 'Email recover';
        $mail->Body = $contents;

        $verify = new ModifyUser();
        $verify->putVerify($token, $id);
        
        if (!$mail->send()) {
            echo 'Message could not be sent.' . '<br>';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            
        }
    }

    public function sendEmailRegistration($email, $username, $password)
    {
        $mail = $this->email();
        $mail->setFrom('Register@gmail.com', 'Admin');
        $mail->AddAddress($email);               // Name is optional
        $mail->isHTML(true);   // Set email format to HTML
 
        $mail->Subject = 'New Registration';
        $view = view('emailRegistration', ['username' => $username, 'password' => $password]);
        $contents = (string) $view;
        $contents = $view->render();
        $mail->Body = $contents;
   
        if (!$mail->send()) {
            echo 'Message could not be sent.' . '<br>';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            
        }
    }

    public function getCurrentDateTime()
    {
        date_default_timezone_set("Europe/Vilnius");
        $datetime = date("Y-m-d h:i:s");
        return $datetime;
    }

    public function getExpireDate()
    {
         date_default_timezone_set("Europe/Vilnius");
        $datetime = date("Y-m-d h:i:s", strtotime("+10 minutes"));
        return $datetime;
    }

    public function checkPermission($id)
    {
        if ($id !== null) {
            $user = User::where('verify', $id)->first();
            $datetime = $this->getCurrentDateTime();
            if ($user != null) {
                if ($user->verify_expire > $datetime) {
                    return true;
                } else
                    return false;
            }
            return false;
        } else
            return false;
    }

    public function changePassword($id,$password)
    {
         $verify = new ModifyUser();
         $password = Hash::make( $password);
         $verify->changePassword($id, $password);
    }
}