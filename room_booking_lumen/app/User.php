<?php

namespace App;

use App\Models\Reservation;
use Illuminate\Auth\Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;

class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable;

    const VALIDATION_RULES = [
        'full_name'  => ['required',
                        'regex:/(\b[a-zA-Z]+\s[a-zA-Z]+\b)/u',
                        'min:5',
                        ],
        'email'  => 'required|unique:user|email',
        'employment_date' => 'required',
        'birth_date' => 'required',
        'city' => 'required|min:4',
        'position' => 'required',
        'address' => 'required',
    ];

    const VALIDATION_RULES_UPDATE = [
        'first_name'  => 'required',
        'last_name'  => 'required',
        'email'  => 'required|email',
        'username'  => 'required',
        'employment_date' => 'required',
        'birth_date' => 'required',
        'city' => 'required|min:4',
        'position' => 'required',
        'address' => 'required',
        'is_admin'  => 'required',
    ];

    const VALIDATION_RULES_ADD = [
        'first_name'  => 'required',
        'last_name'  => 'required',
        'username'  => 'required|unique:user',
        'is_admin'  => 'required',
        'password'  => 'required',
        'email'  => 'required|unique:user|email',
        'employment_date' => 'required',
        'birth_date' => 'required',
        'city' => 'required|min:4',
        'position' => 'required',
        'address' => 'required',
    ];

    protected $table = 'user';

    protected $fillable = [
        'first_name','last_name','username', 'email','address','employment_date',
        'birth_date','city','position'
    ];

    protected $hidden = [
        'password','is_admin','api_token'
    ];

    public static function getUserReservations($userid)
    {
        return DB::table('user')->join('reservation', 'user.id', '=', 'reservation.user_id')
            ->select('reservation.*')
            ->where('user.id', $userid)
            ->get();
    }

    public static function saveUser(Request $request, $username, $password, $NSarray)
    {
        $user = new User();
        $user->first_name  = $NSarray[0];
        $user->last_name  = $NSarray[1];
        $user->username  = $username;
        $user->email  = $request->input('email');
        $user->address  = $request->input('address');
        $user->employment_date  = $request->input('employment_date');
        $user->birth_date  = $request->input('birth_date');
        $user->city  = $request->input('city');
        $user->position  = $request->input('position');
        $user->password  = $password;       
        $user->is_admin = 0;
        $user->save();
    }

    public function getUsers(){
        return DB::table($this->table)
            ->select('user.id', 'user.first_name','user.last_name','user.username', 'user.email','user.address','user.employment_date',
                     'user.birth_date','user.city','user.position','user.is_admin')
            ->groupBy('user.id')
            ->get();
    }

    public function getUser($id){
        $user = DB::table($this->table)
            ->where('user.id', $id)
            ->select('user.id', 'user.first_name','user.last_name', 'user.username', 'user.email','user.address','user.employment_date',
                'user.birth_date','user.city','user.position','user.is_admin')
            ->first();
        $userData['id']  = $user->id;
        $userData['first_name']  = $user->first_name;
        $userData['last_name']  = $user->last_name;
        $userData['username']  = $user->username;
        $userData['email']  = $user->email;
        $userData['position']  = $user->position;
        $userData['city'] = $user->city;
        $userData['address']  = $user->address;
        $userData['employment_date']  = $user->employment_date;
        $userData['birth_date']  = $user->birth_date;
        $userData['is_admin']  = $user->is_admin;

        return $userData;
    }

    public function editUser(Request $request){
        $user = User::findOrFail($request->id);
        $user->first_name  = $request->first_name;
        $user->last_name  = $request->last_name;
        $user->username = $request->username;
        $user->email  = $request->email;
        $user->position  = $request->position;
        $user->city  = $request->city;
        $user->address  = $request->address;
        $user->employment_date  = $request->employment_date;
        $user->birth_date  = $request->birth_date;
        $user->is_admin  = $request->is_admin;

        $user->save();
    }

    public function addUser(Request $request){

        $user = new User;
        $user->first_name  = $request->first_name;
        $user->last_name  = $request->last_name;
        $user->username = $request->username;
        $user->password =  Hash::make($request->password);
        $user->email  = $request->email;
        $user->position  = $request->position;
        $user->city  = $request->city;
        $user->address  = $request->address;
        $user->employment_date  = $request->employment_date;
        $user->birth_date  = $request->birth_date;
        $user->is_admin  = $request->is_admin;

        $user->save();
    }

    public function deleteUser(Request $request){
        $room = User::find($request->id);
        $room->delete();
    }
    public function deleteToken(Request $request)
    {
       User::where('api_token', $request->token)->update(['api_token'=>""]);
    }

    public function handleUserInfoRequest(){
        $user_id = Auth::user()->id;
        return DB::table('user')->where('id', '=', $user_id)
                                ->get();
    }

    public function filterUsersByFirstName($firstName){
        return DB::table('user')->where('first_name', 'like', $firstName . '%')
                                ->get();
    }

    public function filterUsersByLastName($lastName){
        return DB::table('user')->where('last_name', 'like', $lastName . '%')
                                ->get();
    }

    public function filterUsersByPosition($position){
        return DB::table('user')->where('position', 'like', $position . '%')
                                ->get();
    }

    public function filterUsersByCity($city){
        return DB::table('user')->where('city', 'like', $city . '%')
                                ->get();
    }
}
