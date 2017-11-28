<?php

namespace App\Http\Controllers;

use App\Models\EmailRecover;
use Illuminate\Http\Request;
use App\Models\ModifyUser;
use App\User;

class ForgotPasswordController extends Controller
{
   public $recover;
   public $modify;

    public function __construct(EmailRecover $rModel, ModifyUser $modifyModel)
    {
        $this->recover = $rModel;
        $this->modify = $modifyModel;
    }

    public function emailRecoverForm()
    {
      return view('emails');
    }

    public function sendEmailForRecover(Request $request)
    {
      $username = $request->username;
      $email = $request->email;
      $user = User::where('username', $request->username)->where('email',$request->email)->first();
      $verifyId = base64_encode(str_random(64));
      if($user !== null)
      {
        $userId = $user->id;
        $this->recover->sendEmailRecover($email,$verifyId, $userId);
        return response()->json(['status' => 'Success. Email was sent'], 200);
      }
      else return response('Unauthorized.', 401);
    }
    
    public function handlePasswordPermmision($verifyId) {
        if($this->recover->checkPermission($verifyId))
        { 
            return view('passwordChange',['id' => $verifyId]);
        }
        else return response('Unauthorized.', 401);      
    }

    public function handlePasswordChangeRequest(Request $request, $verifyId) {
        if($this->recover->checkPermission($verifyId))
        { 
            if($request->oldPassword !== null && $request->oldPassword === $request->newPassword)
            {               
                 $id = User::where('verify', $verifyId)->first()->id;
                $this->recover->changePassword($id, $request->oldPassword);
                
                $this->modify->deleteVerify($id);
                
                return response()->json(['status' => 'Success'], 200);
            }
            else return response()->json(['status' => 'Password Error'], 401);  
        }
        else return response('Unauthorized.', 401);            
    }
}
