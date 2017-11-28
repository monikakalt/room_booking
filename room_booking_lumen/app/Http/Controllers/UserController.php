<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    private $userModel;

    public function __construct(User $uM)
    {
        $this->middleware('auth', ['except' => ['authenticate']]);
        $this->userModel = $uM;
    }

    public function authenticate(Request $request)
    {
        $this->validate($request, [
            'username' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('username', $request->input('username'))->first();

        if($user === null){
            return response()->json(['status' => 'Username does not exist.'],401);
        }

        if(Hash::check($request->input('password'), $user->password)){
            $apitoken = base64_encode(str_random(40));
            User::where('username', $request->input('username'))->update(['api_token' => "$apitoken"]);
            return response()->json(['status' => 'success','api_token' => $apitoken]);
        } else {
            return response()->json(['status' => 'Incorrect password.'],401);
        }
    }

    public function getUserTable(){
        if($this->authenticateAdmin()){
            return $this->userModel->getUsers();
        } else {
        return response('Unauthorized.', 401);
        }
    }

    public function getUser($id){
        if($this->authenticateAdmin()){
            return $this->userModel->getUser($id);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function updateUser(Request $request){
        if($this->authenticateAdmin()){
            $this->validate($request,User::VALIDATION_RULES_UPDATE);
            return $this->userModel->editUser($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function deleteUser(Request $request){
        if($this->authenticateAdmin()){
            return $this->userModel->deleteUser($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function addUser(Request $request){
        $this->validate($request,User::VALIDATION_RULES_ADD);
        if($this->authenticateAdmin()){
            return $this->userModel->addUser($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public static function authenticateAdmin(){
        $isAdmin = Auth::user()->is_admin;
        if($isAdmin == 1){
            return true;
        } else {
            return false;
        }
    }

    public function handleUserInfoRequest(){
        return $this->userModel->handleUserInfoRequest();
    }

    public function authenticateUser(){
        $data['is_admin'] = false;
        $data['authorized'] = false;
        if(Auth::user()){
            $data['is_admin'] = self::authenticateAdmin();
            $data['authorized'] = true;
            return $data;
        } else {
            return $data;
        }
    }

    public function filterUsersByFirstName($firstName){
        return $this->userModel->filterUsersByFirstName($firstName);
    }

    public function filterUsersByLastName($lastName){
        return $this->userModel->filterUsersByLastName($lastName);
    }

    public function filterUsersByPosition($position){
        return $this->userModel->filterUsersByPosition($position);
    }

    public function filterUsersByCity($city){
        return $this->userModel->filterUsersByCity($city);
    }
    public function deleteToken(Request $request)
    {
         return $this->userModel->deleteToken($request);
    }
}