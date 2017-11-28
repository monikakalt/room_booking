<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\User;
use Illuminate\Http\Request;

class CityController extends Controller
{
    private $cityModel;

    public function __construct(City $cM)
    {
        $this->middleware('auth');
        $this->cityModel = $cM;
    }

    public function getCityTable(){
        return $this->cityModel->getCities();
    }

    public function getCity($id){
        if(UserController::authenticateAdmin()){
            return $this->cityModel->getCity($id);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function updateCity(Request $request){
        if(UserController::authenticateAdmin()){
            $this->validate($request,City::VALIDATION_RULES);
            return $this->cityModel->updateCity($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function addCity(Request $request){
        if(UserController::authenticateAdmin()){
            $this->validate($request,City::VALIDATION_RULES);
            return $this->cityModel->addNewCity($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function deleteCity(Request $request){
        if(UserController::authenticateAdmin()){
            return $this->cityModel->deleteCity($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function filterCitiesByUser(){
        return $this->cityModel->filterCitiesByUser();
    }
}