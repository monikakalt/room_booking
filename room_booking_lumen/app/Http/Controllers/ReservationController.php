<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    private $reservationModel;
    public function __construct(Reservation $rM)
    {
        $this->middleware('auth');
        $this->reservationModel = $rM;
    }

    public function transferReservationTable(){
        if(UserController::authenticateAdmin()){
            return $this->reservationModel->getReservationTable();
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function handleNewReservation(Request $r){
        $this->reservationModel->addNewReservation($r);
    }

    public function handleReservationRemoveRequest(Request $r){
        $this->reservationModel->removeReservation($r);
    }

    public function handleReservationEditRequest(Request $r){
        $this->reservationModel->editReservation($r);
    }

    public function handleReservationRequest(){
        return $this->reservationModel->getUserReservations();
    }

    public function handleReservationRequestByID($id){
        if(UserController::authenticateAdmin()){
            return $this->reservationModel->getUserReservationsByID($id);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function filterReservationsByCity($id){
        return $this->reservationModel->filterReservationsByCity($id);
    }

    public function filterUserReservationsByCity($id,$user_id){
        if(UserController::authenticateAdmin()){
            return $this->reservationModel->filterUserReservationsByCity($id,$user_id);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function filterAllReservationsByCity($id){
        if(UserController::authenticateAdmin()){
            return $this->reservationModel->filterAllReservationsByCity($id);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function filterReservationsByCityAndBuilding($city_id, $building_id){
        return $this->reservationModel->filterReservationsByCityAndBuilding($city_id, $building_id);
    }

    public function filterUserReservationsByCityAndBuilding($city_id, $building_id, $user_id){
        if(UserController::authenticateAdmin()){
            return $this->reservationModel->filterUserReservationsByCityAndBuilding($city_id, $building_id, $user_id);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function filterAllReservationsByCityAndBuilding($city_id, $building_id){
        if(UserController::authenticateAdmin()){
            return $this->reservationModel->filterAllReservationsByCityAndBuilding($city_id, $building_id);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function getInformationByReservationId($id){
        return $this->reservationModel->getInformationByReservationId($id);
    }
}
