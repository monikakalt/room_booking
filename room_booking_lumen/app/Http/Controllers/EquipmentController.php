<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    private $equipmentModel;

    public function __construct(Equipment $eM)
    {
        $this->middleware('auth');
        $this->equipmentModel = $eM;
    }

    public function getEquipmentTable(){
        return $this->equipmentModel->getAllEquipment();
    }

    public function getEquipment($id){
        return $this->equipmentModel->getEquipment($id);
    }

    public function updateEquipment(Request $request){

        if(UserController::authenticateAdmin()){
            $this->validate($request,Equipment::VALIDATION_RULES);
            return $this->equipmentModel->updateEquipment($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function addEquipment(Request $request){

        if(UserController::authenticateAdmin()){
            $this->validate($request,Equipment::VALIDATION_RULES);
            return $this->equipmentModel->addNewEquipment($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function deleteEquipment(Request $request){

        if(UserController::authenticateAdmin()){
            return $this->equipmentModel->deleteEquipment($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function getEnums(Request $request){

        if(UserController::authenticateAdmin()){
            return $this->equipmentModel->getEnums();
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function transferAvailableEquipment($id, $start_date, $end_date){
        return $this->equipmentModel->getAvailableEquipment($id, $start_date, $end_date);
    }

    public function getAvailableEquipmentInBuildingAndReservation($building_id, $reservation_id, $start_date, $end_date){
        return $this->equipmentModel->getAvailableEquipmentInBuildingAndReservation($building_id, $reservation_id, $start_date, $end_date);
    }

    public function getEquipmentByReservationId($id){
        return $this->equipmentModel->getEquipmentByReservationId($id);
    }
}