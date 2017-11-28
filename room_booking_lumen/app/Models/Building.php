<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

class Building extends Model {

    const VALIDATION_RULES = [
        'address'  => 'required',
        'city_id'  => 'required|numeric',
    ];

    protected $table = 'building';

    protected $fillable = ['address','city_id'];

    public function getBuilding($id){ //Get a single record by ID
        $building = DB::table($this->table)
            ->join('city', 'city.id', '=', 'building.city_id')
            ->where('building.id', $id)
            ->select('city.city_name', 'building.address', 'building.id', 'building.city_id')
            ->first();
        $buildingData['id'] = $building->id;
        $buildingData['address'] = $building->address;
        $buildingData['city_id'] = $building->city_id;
        $buildingData['city_name'] = $building->city_name;

        return $buildingData;
    }

    public function City()
    {
        return $this->belongsTo('App\Models\City');
    }

    public function getBuildings(){
        return DB::table($this->table)->join('city', 'city.id', '=', 'building.city_id')
            ->select('city.city_name', 'building.address', 'building.id')
            ->groupBy('building.id')
            ->get();
    }

    public function addNewBuilding(Request $request){
        $building = new Building;
        $building->address  = $request->address;
        $building->city_id  = $request->city_id;

        $building->save();
    }

    public function updateBuilding(Request $request){
        $building = Building::findOrFail($request->id);
        $building->address  = $request->address;
        $building->city_id  = $request->city_id;
        $building->save();
    }

    public function deleteBuilding(Request $request){
        $building = Building::find($request->id);
        $building->delete();
    }

    public function getAllBuildingsByCityID($id){
        return DB::table('building')
            ->join('city', 'city.id', '=', 'building.city_id')
            ->select('building.id', 'building.address')
            ->where('building.city_id', '=', $id)
            ->groupBy('building.id')
            ->get();
    }

    public function filterBuildingsByCity($id){
        $user_id = Auth::user()->id;
        return DB::table('building')->join('room', 'room.building_id', '=', 'building.id')
                                    ->join('reservation', 'room.id', '=', 'reservation.room_id')
                                    ->select('building.id', 'building.address')
                                    ->where('building.city_id', '=', $id)
                                    ->where('reservation.user_id', '=', $user_id)
                                    ->groupBy('building.id')
                                    ->get();
    }
}
