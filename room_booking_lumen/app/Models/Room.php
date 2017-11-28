<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

class Room extends Model {

    const VALIDATION_RULES = [
        'room_nr'  => 'required',
        'building_id'  => 'required',
        'capacity'  => 'required',
    ];

    protected $table = 'room';

    protected $fillable = ['room_nr','building_id','capacity'];

    public function getRoom($id){
        $room = DB::table($this->table)
            ->join('building', 'building.id', '=', 'room.building_id')
            ->join('city', 'city.id' , '=', 'building.city_id')
            ->where('room.id', $id)
            ->select('city.city_name', 'building.address', 'room.id', 'room.building_id', 'room.capacity', 'room.room_nr')
            ->first();
        $roomData['id'] = $room->id;
        $roomData['room_nr'] = $room->room_nr;
        $roomData['capacity'] = $room->capacity;
        $roomData['building_id'] = $room->building_id;
        $roomData['address'] = $room->address;
        $roomData['city_name'] = $room->city_name;

        return $roomData;
    }

    public function getRooms(){
        return DB::table($this->table)
            ->join('building', 'building.id', '=', 'room.building_id')
            ->join('city', 'city.id' , '=', 'building.city_id')
            ->select('city.city_name', 'building.address', 'room.id', 'room.building_id', 'room.capacity', 'room.room_nr')
            ->groupBy('room.id')
            ->get();
    }

    public function addNewRoom(Request $request){
        $room = new Room;
        $room->room_nr  = $request->room_nr;
        $room->capacity  = $request->capacity;
        $room->building_id  = $request->building_id;

        $room->save();
    }

    public function updateRoom(Request $request){ //Update a record
        $room = Room::findOrFail($request->id);
        $room->room_nr  = $request->room_nr;
        $room->capacity  = $request->capacity;
        $room->building_id  = $request->building_id;
        $room->save();
    }

    public function deleteRoom(Request $request){
        $room = Room::find($request->id);
        $room->delete();
    }

    public function getAvailableRooms($id, $start_date, $end_date){
        $start_date = urldecode($start_date);
        $end_date = urldecode($end_date);
        return DB::table('room')->join('building', 'building.id', '=', 'room.building_id')
                                ->join('city', 'building.city_id', '=', 'city.id')
                                ->select('building.address', 'building.id as building_id', 'room.room_nr', 'room.capacity', 'room.id as room_id')
                                ->whereNotExists(function($query) use ($start_date, $end_date){
                                    $query->select(DB::raw(1))
                                          ->from('reservation')
                                          ->whereRaw("reservation.room_id = room.id")
                                          ->whereRaw("reservation.end_date >= '$start_date'")
                                          ->whereRaw("reservation.start_date <= '$end_date'");
                                })
                                ->where('city.id', '=', $id)
                                ->groupBy('room.id')
                                ->get();
    }

    public function getAvailableRoomsInBuilding($id, $start_date, $end_date){
        $start_date = urldecode($start_date);
        $end_date = urldecode($end_date);
        return DB::table('room')->join('building', 'building.id', '=', 'room.building_id')
                                ->select('room.room_nr', 'room.capacity', 'room.id as room_id')
                                ->whereNotExists(function($query) use ($start_date, $end_date){
                                    $query->select(DB::raw(1))
                                          ->from('reservation')
                                          ->whereRaw("reservation.room_id = room.id")
                                          ->whereRaw("reservation.end_date >= '$start_date'")
                                          ->whereRaw("reservation.start_date <= '$end_date'");
                                })
                                ->where('building.id', '=', $id)
                                ->groupBy('room.id')
                                ->get();
    }

    public function getAvailableRoomsInBuildingAndReservation($building_id, $reservation_id, $start_date, $end_date){
        $start_date = urldecode($start_date);
        $end_date = urldecode($end_date);
        return DB::table('room')->join('building', 'building.id', '=', 'room.building_id')
                                ->select('room.room_nr', 'room.capacity', 'room.id as room_id')
                                ->whereNotExists(function($query) use ($start_date, $end_date, $reservation_id){
                                    $query->select(DB::raw(1))
                                          ->from('reservation')
                                          ->whereRaw("reservation.room_id = room.id")
                                          ->whereRaw("reservation.end_date >= '$start_date'")
                                          ->whereRaw("reservation.start_date <= '$end_date'")
                                          ->whereRaw("reservation.id != '$reservation_id'");
                                })
                                ->where('building.id', '=', $building_id)
                                ->groupBy('room.id')
                                ->get();
    }
}
