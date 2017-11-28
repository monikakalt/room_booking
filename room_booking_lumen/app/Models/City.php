<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

use App\Models\Building;

class City extends Model {

    const VALIDATION_RULES = [
        'city_name'  => 'required|unique:city',
    ];

    protected $table = 'city';

    protected $fillable = ['city_name'];

    public function getCity($id){
        return City::find($id);
    }

    public function getCities(){
        return City::all();
    }

    public function Building()
    {
        return $this->hasOne('App\Models\Building');
    }

    public function addNewCity(Request $request){
        $city = new City;
        $city->city_name  = $request->city_name;
        $city->save();
    }

    public function updateCity(Request $request){
        $city = City::findOrFail($request->id);
        $city->city_name = $request->city_name;
        $city->save();
    }

    public function deleteCity(Request $request){
        $id = $request->id;
        City::getCity($id)->delete();
    }

    public function filterCitiesByUser(){
        $user_id = Auth::user()->id;
        return DB::table('city')->join('building', 'city.id', '=', 'building.city_id')
                                ->join('room', 'room.building_id', '=', 'building.id')
                                ->join('reservation', 'room.id', '=', 'reservation.room_id')
                                ->select('city.id', 'city.city_name')
                                ->where('reservation.user_id', '=', $user_id)
                                ->groupBy('city.id')
                                ->get();
    }
}
