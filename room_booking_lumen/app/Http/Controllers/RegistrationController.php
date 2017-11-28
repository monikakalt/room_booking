<?php

namespace App\Http\Controllers;

use App\User;
use Validator;
use Illuminate\Http\Request;
use App\Models\ModifyUser;
use App\Models\EmailRecover;
 use Illuminate\Support\Facades\Hash;

class RegistrationController extends Controller
{
    public function __construct()
    {
    }

    public function handleNewUserRegistration(Request $request){
        $validator = Validator::make($request->all(), User::VALIDATION_RULES);  
        if($validator->fails())
        {
           $err = $this->formErrors($validator->errors());
           return response()->json(['status'=>$err]);
        }
       $model = new ModifyUser();   
        if ($model->checkUser($request)) {
            $NSarray = $model->getNameAndSurname($request->full_name);
            if ($NSarray !== null) {
                $username = $model->createUsername($NSarray[0], $NSarray[1]);
                $password = $model->createPassword($username);
                
                $mail = new EmailRecover();
                $mail->sendEmailRegistration($request->email,$username,$password);
                
                $password = Hash::make( $password);
                User::saveUser($request, $username, $password, $NSarray);
                return response()->json(['status' => 'Registered'], 200);
            } else
                return response()->json(['status' => 'Wrong full name input']);
        } else
            return response()->json(['status' => 'This user already exists']);
    }
    
    public function formErrors($errors)
    {
        $error = "";
        foreach ($errors->all() as $message) { 
                $error = $error.$message.' ';
            }
            return $error;
    } 
}