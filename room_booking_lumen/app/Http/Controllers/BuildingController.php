<?php

namespace App\Http\Controllers;

use App\Models\Building;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    private $buildingModel;

    public function __construct(Building $cM)
    {
        $this->middleware('auth');
        $this->buildingModel = $cM;
    }

    public function getBuildingTable(){
        return $this->buildingModel->getBuildings();
    }

    public function getBuildingsByCity($id){
        return $this->buildingModel->getAllBuildingsByCityID($id);
    }

    public function getBuilding($id){
        return $this->buildingModel->getbuilding($id);
    }

    public function updateBuilding(Request $request){
        if(UserController::authenticateAdmin()){
            $this->validate($request,Building::VALIDATION_RULES);
            return $this->buildingModel->updatebuilding($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function addBuilding(Request $request){
        if(UserController::authenticateAdmin()){
            $this->validate($request,Building::VALIDATION_RULES);
            return $this->buildingModel->addNewbuilding($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function deleteBuilding(Request $request){
        if(UserController::authenticateAdmin()){
            return $this->buildingModel->deletebuilding($request);
        } else {
            return response('Unauthorized.', 401);
        }
    }

    public function filterBuildingsByCity($id){
        return $this->buildingModel->filterBuildingsByCity($id);
    }
}
