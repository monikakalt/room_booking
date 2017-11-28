<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class Reservation extends Model {

    protected $table = 'reservation';

    protected $fillable = ['start_date','end_date','room_id', 'user_id'];

    public function getReservationTable(){
        return DB::table('reservation')->join('room', 'room.id', '=', 'reservation.room_id')
                                       ->join('building', 'building.id', '=', 'room.building_id')
                                       ->join('city', 'city.id', '=', 'building.city_id')
                                       ->join('user', 'user.id', '=', 'reservation.user_id')
                                       ->select('reservation.id', 'reservation.room_id', 'reservation.user_id', 'reservation.start_date', 'reservation.end_date',
                                            'user.first_name', 'user.last_name', 'room.room_nr', 'room.capacity', 'room.building_id', 'building.address',
                                            'building.city_id', 'city.city_name')
                                       ->groupBy('reservation.id')
                                       ->get();
    }

    public function getUserReservations(){
        $user_id = Auth::user()->id;
        return DB::table('reservation')->join('room', 'room.id', '=', 'reservation.room_id')
                                       ->join('building', 'building.id', '=', 'room.building_id')
                                       ->join('city', 'city.id', '=', 'building.city_id')
                                       ->join('user', 'user.id', '=', 'reservation.user_id')
                                       ->select('reservation.id', 'reservation.room_id', 'reservation.user_id', 'reservation.start_date', 'reservation.end_date',
                                                'user.first_name', 'user.last_name', 'room.room_nr', 'room.capacity', 'room.building_id', 'building.address',
                                                'building.city_id', 'city.city_name')
                                       ->where('reservation.user_id', '=', $user_id)
                                       ->groupBy('reservation.id')
                                       ->get();
    }

    public function getUserReservationsByID($id){
        return DB::table('reservation')->join('room', 'room.id', '=', 'reservation.room_id')
                                       ->join('building', 'building.id', '=', 'room.building_id')
                                       ->join('city', 'city.id', '=', 'building.city_id')
                                       ->join('user', 'user.id', '=', 'reservation.user_id')
                                       ->select('reservation.id', 'reservation.room_id', 'reservation.user_id', 'reservation.start_date', 'reservation.end_date',
                                                'user.first_name', 'user.last_name', 'room.room_nr', 'room.capacity', 'room.building_id', 'building.address',
                                                'building.city_id', 'city.city_name')
                                       ->where('reservation.user_id', '=', $id)
                                       ->groupBy('reservation.id')
                                       ->get();
    }

    public function getInformationByReservationId($id){
        $user_id = Auth::user()->id;
        $is_admin = Auth::user()->is_admin;
        $reservation_id = $id;
        if($is_admin){
        return DB::table('reservation')->join('room', 'room.id', '=', 'reservation.room_id')
                                       ->join('building', 'building.id', '=', 'room.building_id')
                                       ->join('city', 'city.id', '=', 'building.city_id')
                                       ->join('user', 'user.id', '=', 'reservation.user_id')
                                       ->select('reservation.id', 'reservation.room_id', 'reservation.user_id', 'reservation.start_date', 'reservation.end_date',
                                                'user.first_name', 'user.last_name', 'room.room_nr', 'room.capacity', 'room.building_id', 'building.address',
                                                'building.city_id', 'city.city_name')
                                       ->where('reservation.id', '=', $reservation_id)
                                       ->get();
        } else {
        return DB::table('reservation')->join('room', 'room.id', '=', 'reservation.room_id')
                                       ->join('building', 'building.id', '=', 'room.building_id')
                                       ->join('city', 'city.id', '=', 'building.city_id')
                                       ->join('user', 'user.id', '=', 'reservation.user_id')
                                       ->select('reservation.id', 'reservation.room_id', 'reservation.user_id', 'reservation.start_date', 'reservation.end_date',
                                                'user.first_name', 'user.last_name', 'room.room_nr', 'room.capacity', 'room.building_id', 'building.address',
                                                'building.city_id', 'city.city_name')
                                       ->where('reservation.user_id', '=', $user_id)
                                       ->where('reservation.id', '=', $reservation_id)
                                       ->get();
        }
    }

    public function filterReservationsByCity($id){
        $user_id = Auth::user()->id;
        return DB::table('reservation')->join('room', 'room.id', '=', 'reservation.room_id')
                                       ->join('building', 'building.id', '=', 'room.building_id')
                                       ->join('city','city.id','=','building.city_id')
                                       ->select('reservation.id', 'reservation.room_id', 'reservation.user_id', 'reservation.start_date', 'reservation.end_date'
                                       ,'room.room_nr','room.capacity','room.building_id', 'building.address','building.city_id', 'city.city_name')
                                       ->where('building.city_id', '=', $id)
                                       ->where('reservation.user_id', '=', $user_id)
                                       ->groupBy('reservation.id')
                                       ->get();
    }

    public function filterUserReservationsByCity($id, $user_id){
        return DB::table('reservation')->join('room', 'room.id', '=', 'reservation.room_id')
            ->join('building', 'building.id', '=', 'room.building_id')
            ->join('city','city.id','=','building.city_id')
            ->select('reservation.id', 'reservation.room_id', 'reservation.user_id', 'reservation.start_date', 'reservation.end_date'
                ,'room.room_nr','room.capacity','room.building_id', 'building.address','building.city_id', 'city.city_name')
            ->where('building.city_id', '=', $id)
            ->where('reservation.user_id', '=', $user_id)
            ->groupBy('reservation.id')
            ->get();
    }

    public function filterAllReservationsByCity($id){
        return DB::table('reservation')->join('room', 'room.id', '=', 'reservation.room_id')
            ->join('building', 'building.id', '=', 'room.building_id')
            ->join('city','city.id','=','building.city_id')
            ->select('reservation.id', 'reservation.room_id', 'reservation.user_id', 'reservation.start_date', 'reservation.end_date'
                ,'room.room_nr','room.capacity','room.building_id', 'building.address','building.city_id', 'city.city_name')
            ->where('building.city_id', '=', $id)
            ->groupBy('reservation.id')
            ->get();
    }

    public function filterReservationsByCityAndBuilding($city_id, $building_id){
        $user_id = Auth::user()->id;
        return DB::table('reservation')->join('room', 'room.id', '=', 'reservation.room_id')
                                       ->join('building', 'building.id', '=', 'room.building_id')
                                       ->join('city','city.id','=','building.city_id')
                                       ->select('reservation.id', 'reservation.room_id', 'reservation.user_id', 'reservation.start_date', 'reservation.end_date',
                                               'room.room_nr', 'room.capacity', 'room.building_id', 'building.address', 'building.city_id', 'city.city_name')
                                       ->where('building.city_id', '=', $city_id)
                                       ->where('building.id', '=', $building_id)
                                       ->where('reservation.user_id', '=', $user_id)
                                       ->groupBy('reservation.id')
                                       ->get();
    }

    public function filterUserReservationsByCityAndBuilding($city_id, $building_id, $user_id){
        return DB::table('reservation')->join('room', 'room.id', '=', 'reservation.room_id')
                                       ->join('building', 'building.id', '=', 'room.building_id')
                                       ->join('city','city.id','=','building.city_id')
                                       ->select('reservation.id', 'reservation.room_id', 'reservation.user_id', 'reservation.start_date', 'reservation.end_date',
                                               'room.room_nr', 'room.capacity', 'room.building_id', 'building.address', 'building.city_id', 'city.city_name')
                                       ->where('building.city_id', '=', $city_id)
                                       ->where('building.id', '=', $building_id)
                                       ->where('reservation.user_id', '=', $user_id)
                                       ->groupBy('reservation.id')
                                       ->get();
    }

    public function filterAllReservationsByCityAndBuilding($city_id, $building_id){
        return DB::table('reservation')->join('room', 'room.id', '=', 'reservation.room_id')
            ->join('building', 'building.id', '=', 'room.building_id')
            ->join('city','city.id','=','building.city_id')
            ->select('reservation.id', 'reservation.room_id', 'reservation.user_id', 'reservation.start_date', 'reservation.end_date',
                'room.room_nr', 'room.capacity', 'room.building_id', 'building.address', 'building.city_id', 'city.city_name')
            ->where('building.city_id', '=', $city_id)
            ->where('building.id', '=', $building_id)
            ->groupBy('reservation.id')
            ->get();
    }

    public function addNewReservation($data){
        $user_id = Auth::user()->id;
        $room_id = $data->input('room_id');
        $start_date = $data->input('start_date');
        $end_date = $data->input('end_date');
        $reservation_equipment = $data->input('reservation_equip');
        $date = date('Y-m-d H:i:s', time());

        if(!($this->isTimeAvailableForNewReservation($data))){
            return;
        }

        DB::table('reservation')->insert(
            ['room_id' => $room_id, 'user_id' => $user_id, 'start_date' => $start_date, 'end_date' => $end_date, 'created_at' => $date]
        );

        $reservation_id = DB::table('reservation')->max('id');

        if($reservation_equipment !== null){
            foreach($reservation_equipment as $equipment){
                DB::table('reservation_equip')->insert(
                    ['equipment_id' => $equipment['id'], 'reservation_id' => $reservation_id]
                );
            }
        }
    }

    public function removeReservation($data){
        $user_id = Auth::user()->id;
        $is_admin = Auth::user()->is_admin;
        $reservation_id = $data->input('id');
        if($is_admin){
        DB::table('reservation_equip')->join('reservation', 'reservation.id', '=', 'reservation_equip.reservation_id')
                                      ->where('reservation.id', '=', $reservation_id)
                                      ->delete();
        DB::table('reservation')->where('reservation.id', '=', $reservation_id)
                                ->delete();
        } else {
        DB::table('reservation_equip')->join('reservation', 'reservation.id', '=', 'reservation_equip.reservation_id')
                                      ->where('reservation.id', '=', $reservation_id)
                                      ->where('reservation.user_id', '=', $user_id)
                                      ->delete();
        DB::table('reservation')->where('reservation.user_id', '=', $user_id)
                                ->where('reservation.id', '=', $reservation_id)
                                ->delete();
        }
    }

    public function editReservation($data){
        $user_id = Auth::user()->id;
        $is_admin = Auth::user()->is_admin;
        $reservation_id = $data->input('reservation_id');
        $room_id = $data->input('room_id');
        $start_date = $data->input('start_date');
        $end_date = $data->input('end_date');
        $reservation_equipment = $data->input('reservation_equip');

        if(!($this->isTimeAvailableForEditReservation($data))){
            return;
        }
        
        if($is_admin){
            DB::table('reservation')->where('reservation.id', '=', $reservation_id)
                                    ->update(
                ['room_id' => $room_id, 'start_date' => $start_date, 'end_date' => $end_date]
            );
        } else {
            DB::table('reservation')->where('reservation.id', '=', $reservation_id)
                                    ->where('user_id', '=', $user_id)
                                    ->update(
                ['room_id' => $room_id, 'start_date' => $start_date, 'end_date' => $end_date]
            );
        }

        DB::table('reservation_equip')->where('reservation_equip.reservation_id', '=', $reservation_id)
                                      ->delete();

        if($reservation_equipment !== null){                              
            foreach($reservation_equipment as $equipment){
                DB::table('reservation_equip')->insert(
                    ['equipment_id' => $equipment['id'], 'reservation_id' => $reservation_id]
                );
            }
        }
    }

    private function isTimeAvailableForNewReservation($data){
        $room_id = $data->input('room_id');
        $start_date = $data->input('start_date');
        $end_date = $data->input('end_date');
        $reservation_equipment = $data->input('reservation_equip');
        
        if(!($this->validateDates($start_date, $end_date))){
            return false;
        }

        $reservation = DB::table('reservation')->where('reservation.room_id', '=', $room_id)
                                                ->where('reservation.start_date', '<=', $end_date)
                                                ->where('reservation.end_date', '>=', $start_date)
                                                ->first();

        if($reservation !== null){
            return false;
        }

        if($reservation_equipment !== null){
            foreach($reservation_equipment as $equipment){
                $equipmentStatus = DB::table('reservation_equip')->join('reservation', 'reservation.id', '=', 'reservation_equip.reservation_id')
                                                                 ->where('reservation_equip.equipment_id', '=', $equipment['id'])
                                                                 ->where('reservation.start_date', '<=', $end_date)
                                                                 ->where('reservation.end_date', '>=', $start_date)
                                                                 ->first();

                if($equipmentStatus !== null){
                    return false;
                }
            }
        }
        return true;
    }

    private function isTimeAvailableForEditReservation($data){
        $reservation_id = $data->input('reservation_id');
        $room_id = $data->input('room_id');
        $start_date = $data->input('start_date');
        $end_date = $data->input('end_date');
        $reservation_equipment = $data->input('reservation_equip');

        if(!($this->validateDates($start_date, $end_date))){
            return false;
        }

        $reservation = DB::table('reservation')->where('reservation.room_id', '=', $room_id)
                                                ->where('reservation.start_date', '<=', $end_date)
                                                ->where('reservation.end_date', '>=', $start_date)
                                                ->where('reservation.id', '!=', $reservation_id)
                                                ->first();

        if($reservation !== null){
            return false;
        }

        if($reservation_equipment !== null){
            foreach($reservation_equipment as $equipment){
                $equipmentStatus = DB::table('reservation_equip')->join('reservation', 'reservation.id', '=', 'reservation_equip.reservation_id')
                                                                 ->where('reservation_equip.equipment_id', '=', $equipment['id'])
                                                                 ->where('reservation.start_date', '<=', $end_date)
                                                                 ->where('reservation.end_date', '>=', $start_date)
                                                                 ->where('reservation.id', '!=', $reservation_id)
                                                                 ->first();

                if($equipmentStatus !== null){
                    return false;
                }
            }
        }
        return true;
    }

    private function validateDates($start_date, $end_date){
        $current_date = date('Y-m-d H:i:s', time());

        $start_date = urldecode($start_date);
        $end_date = urldecode($end_date);

        if(strlen($start_date) != 19){
            $start_date = date_format($start_date,"Y/m/d H:i:s");
        }

        if(strlen($end_date) != 19){
            $end_date = date_format($end_date,"Y/m/d H:i:s");
        }

        if($start_date == '0' ||
           $end_date == '0'){
               return false;
        }

        if($start_date >= $end_date){
            return false;
        }

        if($start_date <= $current_date){
            return false;
        }
        return true;
    }
}
