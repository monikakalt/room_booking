<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    private $roomModel;

    public function __construct(Room $rM)
    {
        $this->middleware('auth');
        $this->roomModel = $rM;
    }

    public function getRoomTable(){
        return $this->roomModel->getRooms();
    }

    public function getRoom($id){
        return $this->roomModel->getRoom($id);
    }


    public function updateRoom(Request $request){
        if(UserController::authenticateAdmin()){
            $this->validate($request,Room::VALIDATION_RULES);
            return $this->roomModel->updateRoom($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function addRoom(Request $request){
        if(UserController::authenticateAdmin()){
            $this->validate($request,Room::VALIDATION_RULES);
            return $this->roomModel->addNewRoom($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function deleteRoom(Request $request){
        if(UserController::authenticateAdmin()){
            return $this->roomModel->deleteRoom($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function transferAvailableRooms($id, $start_date, $end_date){
        return $this->roomModel->getAvailableRooms($id, $start_date, $end_date);
    }

    public function getAvailableRoomsInBuilding($id, $start_date, $end_date){
        return $this->roomModel->getAvailableRoomsInBuilding($id, $start_date, $end_date);
    }

    public function getAvailableRoomsInBuildingAndReservation($building_id, $reservation_id, $start_date, $end_date){
        return $this->roomModel->getAvailableRoomsInBuildingAndReservation($building_id, $reservation_id, $start_date, $end_date);
    }
}