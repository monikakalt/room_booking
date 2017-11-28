<?php

namespace App\Models;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Equipment extends Model {

    const VALIDATION_RULES = [
        'equipment_type'  => 'required',
        'equipment_code'  => 'required',
        'building_id'  => 'required',
    ];

    protected $table = 'equipment';

    protected $fillable = ['equipment_type','equipment_code','building_id'];

    public function getEquipment($id){
        $equipment = DB::table($this->table)
            ->join('building', 'building.id', '=', 'equipment.building_id')
            ->join('city', 'city.id' , '=', 'building.city_id')
            ->where('equipment.id', $id)
            ->select('city.city_name', 'building.address', 'equipment.id', 'equipment.building_id', 'equipment.equipment_type', 'equipment.equipment_code')
            ->first();
        $equipmentData['id'] = $equipment->id;
        $equipmentData['equipment_type'] = $equipment->equipment_type;
        $equipmentData['equipment_code'] = $equipment->equipment_code;
        $equipmentData['building_id'] = $equipment->building_id;
        $equipmentData['address'] = $equipment->address;
        $equipmentData['city_name'] = $equipment->city_name;

        return $equipmentData;
    }

    public function getAllEquipment(){
        return DB::table($this->table)
            ->join('building', 'building.id', '=', 'equipment.building_id')
            ->join('city', 'city.id' , '=', 'building.city_id')
            ->select('city.city_name', 'building.address', 'equipment.id', 'equipment.building_id', 'equipment.equipment_type', 'equipment.equipment_code')
            ->groupBy('equipment.id')
            ->get();
    }

    public function addNewEquipment(Request $request){
        $equipment = new Equipment;
        $equipment->equipment_type  = $request->equipment_type;
        $equipment->equipment_code  = $request->equipment_code;
        $equipment->building_id  = $request->building_id;

        $equipment->save();
    }

    public function updateEquipment(Request $request){
        $equipment = Equipment::findOrFail($request->id);
        $equipment->equipment_type  = $request->equipment_type;
        $equipment->equipment_code  = $request->equipment_code;
        $equipment->building_id  = $request->building_id;
        $equipment->save();
    }

    public function deleteEquipment(Request $request){
        $equipment = Equipment::find($request->id);
        $equipment->delete();
    }

    public function getEnums(){
        $type = DB::select(DB::raw('SHOW COLUMNS FROM equipment WHERE Field = "equipment_type"'))[0]->Type;
        preg_match('/^enum\((.*)\)$/', $type, $matches);
        $values = array();
        foreach(explode(',', $matches[1]) as $value){
            $values[] = trim($value, "'");
        }
        return $values;
    }

    public function getAvailableEquipment($id, $start_date, $end_date){
        $start_date = urldecode($start_date);
        $end_date = urldecode($end_date);
        return DB::table('equipment')->join('building', 'building.id', '=', 'equipment.building_id')
                                     ->leftJoin('reservation_equip', 'reservation_equip.equipment_id', '=', 'equipment.id')
                                     ->select('equipment.id', 'equipment.equipment_type', 'equipment.equipment_code')
                                    ->whereNotExists(function($query) use ($start_date, $end_date){
                                     $query->select(DB::raw(1))
                                           ->from('reservation')
                                           ->whereRaw("reservation.id = reservation_equip.reservation_id")
                                           ->whereRaw("equipment.id = reservation_equip.equipment_id")
                                           ->whereRaw("reservation.end_date >= '$start_date'")
                                           ->whereRaw("reservation.start_date <= '$end_date'");
                                     })
                                     ->where('building.id', '=', $id)
                                     ->groupBy('equipment.id')
                                     ->get();
    }

    public function getAvailableEquipmentInBuildingAndReservation($building_id, $reservation_id, $start_date, $end_date){
        $start_date = urldecode($start_date);
        $end_date = urldecode($end_date);
        return DB::table('equipment')->join('building', 'building.id', '=', 'equipment.building_id')
                                     ->leftJoin('reservation_equip', 'reservation_equip.equipment_id', '=', 'equipment.id')
                                     ->select('equipment.id', 'equipment.equipment_type', 'equipment.equipment_code')
                                    ->whereNotExists(function($query) use ($start_date, $end_date, $reservation_id){
                                     $query->select(DB::raw(1))
                                           ->from('reservation')
                                           ->whereRaw("reservation.id = reservation_equip.reservation_id")
                                           ->whereRaw("equipment.id = reservation_equip.equipment_id")
                                           ->whereRaw("reservation.end_date >= '$start_date'")
                                           ->whereRaw("reservation.start_date <= '$end_date'")
                                           ->whereRaw("reservation.id != '$reservation_id'");
                                     })
                                     ->where('building.id', '=', $building_id)
                                     ->groupBy('equipment.id')
                                     ->get();
    }

    public function getEquipmentByReservationId($id){
        $user_id = Auth::user()->id;
        $reservation_id = $id;
        return DB::table('equipment')->join('reservation_equip', 'reservation_equip.equipment_id', '=', 'equipment.id')
                                     ->join('reservation', 'reservation.id', '=', 'reservation_equip.reservation_id')
                                     ->select('equipment.id', 'equipment.equipment_type', 'equipment.equipment_code')
                                     ->where('reservation_equip.reservation_id', '=', $reservation_id)
                                     ->where('reservation.user_id', '=', $user_id)
                                     ->groupBy('equipment.id')
                                     ->get();
    }
}
