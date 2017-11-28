<?php

namespace App\Models;

 use Illuminate\Support\Facades\DB;
 use App\User;
 use Illuminate\Support\Facades\Hash;
 
class ModifyUser extends Model {

    public function __contruct() {
        
    }

    public function putVerify($verify, $id) {
        date_default_timezone_set("Europe/Vilnius");
        $datetime = date("Y-m-d h:i:s", strtotime("+10 minutes"));
        DB::table('user')->where('id', $id)->update(['verify' => $verify, 'verify_expire' => $datetime]);
    }

    public function changePassword($id, $password) {
        DB::table('user')->where('id', $id)->update(['password' => $password]);
    }

    public function deleteVerify($id)
    {
        DB::table('user')->where('id', $id)->update(['verify'=>"", 'verify_expire'=>""]);
    }

    public function createPassword($username)
    {
        $password = Hash::make($username);
        $chars = array("$", ".", "/");
        $password = str_replace($chars, chr(64+rand(0,26)), $password);
        return substr($password, 0,13);
        
    }

    public function createUsername($username,$surname)
    {
        $uniqueUsername = substr(strtolower($username), 0, 3);
        $uniqueUsername = $uniqueUsername.substr(strtolower($surname), 0, 3);
        $uniqueUsername = $uniqueUsername.rand(1,100);
        $user = User::where('username', $uniqueUsername)->first();
        if($user == null)
        {
            return $uniqueUsername;
        }
        else  $this->createUsername ($username, $surname);
    }

    public function getNameAndSurname($fullname)
    {
     $NSarray = explode(" ", $fullname);
     $count = count($NSarray);
     if($count > 2)
     {
         return null;
     }
     else return $NSarray;
    }
    
    public function checkUser($request)
    {
        $user = User::where('email',$request->email)->first();
        if($user == NULL)
        {
            return true;
        }
        else return false;
    }
}

