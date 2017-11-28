<?php

$app->get('/', function () use ($app) {
    return view('index');
});

$app->post('/login', 'UserController@authenticate');

$app->post('/register', 'RegistrationController@handleNewUserRegistration');

$app->get('/forgot','ForgotPasswordController@emailRecoverForm');
$app->post('/forgot', 'ForgotPasswordController@sendEmailForRecover');
$app->get('/forgot/{id}', 'ForgotPasswordController@handlePasswordPermmision');
$app->post('/forgot/{id}','ForgotPasswordController@handlePasswordChangeRequest');

//----Cities----
$app->get('/getCities', 'CityController@getCityTable');
$app->post('/addCity',      'CityController@addCity');
$app->get('/city/{id}',    'CityController@getCity');
$app->post('/editCity', 'CityController@updateCity');
$app->delete('/deleteCity', 'CityController@deleteCity');
$app->get('/filterCitiesByUser', 'CityController@filterCitiesByUser');

//----Buildings----
$app->get('/getBuildings', 'BuildingController@getBuildingTable');
$app->get('/getBuildingsByCity/{id}', 'BuildingController@getBuildingsByCity');
$app->post('/addBuilding',      'BuildingController@addBuilding');
$app->get('/building/{id}',    'BuildingController@getBuilding');
$app->post('/editBuilding', 'BuildingController@updateBuilding');
$app->delete('/deleteBuilding', 'BuildingController@deleteBuilding');
$app->get('/filterBuildingsByCity/{id}', 'BuildingController@filterBuildingsByCity');

//----Rooms----
$app->get('/getRooms', 'RoomController@getRoomTable');
$app->post('/addRoom',      'RoomController@addRoom');
$app->get('/room/{id}',    'RoomController@getRoom');
$app->post('/editRoom', 'RoomController@updateRoom');
$app->delete('/deleteRoom', 'RoomController@deleteRoom');
$app->get('/getAvailableRoomsInCity/{id}/{start_date}/{end_date}', 'RoomController@transferAvailableRooms');
$app->get('/getAvailableRoomsInBuilding/{id}/{start_date}/{end_date}', 'RoomController@getAvailableRoomsInBuilding');
$app->get('/getAvailableRoomsInBuildingAndReservation/{building_id}/{reservation_id}/{start_date}/{end_date}', 'RoomController@getAvailableRoomsInBuildingAndReservation');

//----Equipment----
$app->get('/getAllEquipment', 'EquipmentController@getEquipmentTable');
$app->get('/getEquipmentEnums', 'EquipmentController@getEnums');
$app->post('/addEquipment',      'EquipmentController@addEquipment');
$app->get('/equipment/{id}',    'EquipmentController@getEquipment');
$app->post('/editEquipment', 'EquipmentController@updateEquipment');
$app->delete('/deleteEquipment', 'EquipmentController@deleteEquipment');
$app->get('/getAvailableEquipmentInBuilding/{id}/{start_date}/{end_date}', 'EquipmentController@transferAvailableEquipment');
$app->get('/getAvailableEquipmentInBuildingAndReservation/{building_id}/{reservation_id}/{start_date}/{end_date}', 'EquipmentController@getAvailableEquipmentInBuildingAndReservation');
$app->get('/getEquipmentByReservationId/{id}', 'EquipmentController@getEquipmentByReservationId');

//----Users----
$app->get('/getUsers', 'UserController@getUserTable');
$app->get('/user/{id}',    'UserController@getUser');
$app->get('/authenticateUser',    'UserController@authenticateUser');
$app->post('/editUser', 'UserController@updateUser');
$app->post('/addUser', 'UserController@addUser');
$app->delete('/deleteUser', 'UserController@deleteUser');
$app->get('/getUserInformation','UserController@handleUserInfoRequest');
$app->get('/filterUsersByFirstName/{first_name}','UserController@filterUsersByFirstName');
$app->get('/filterUsersByLastName/{last_name}','UserController@filterUsersByLastName');
$app->get('/filterUsersByPosition/{position}','UserController@filterUsersByPosition');
$app->get('/filterUsersByCity/{city}','UserController@filterUsersByCity');
$app->post('/deleteToken','UserController@deleteToken');

//----Reservations----
$app->get('/getReservationTable', 'ReservationController@transferReservationTable');
$app->post('/reserve', 'ReservationController@handleNewReservation');
$app->delete('/removeReservation','ReservationController@handleReservationRemoveRequest');
$app->post('/editReservation','ReservationController@handleReservationEditRequest');
$app->get('/getUserReservations','ReservationController@handleReservationRequest');
$app->get('/getUserReservationsByID/{id}','ReservationController@handleReservationRequestByID');
$app->get('/filterReservationsByCity/{id}', 'ReservationController@filterReservationsByCity');
$app->get('/filterUserReservationsByCity/{id}/{user_id}', 'ReservationController@filterUserReservationsByCity');
$app->get('/filterAllReservationsByCity/{id}', 'ReservationController@filterAllReservationsByCity');
$app->get('/filterReservationsByCityAndBuilding/{city_id}/{building_id}', 'ReservationController@filterReservationsByCityAndBuilding');
$app->get('/filterUserReservationsByCityAndBuilding/{city_id}/{building_id}/{user_id}', 'ReservationController@filterUserReservationsByCityAndBuilding');
$app->get('/filterAllReservationsByCityAndBuilding/{city_id}/{building_id}', 'ReservationController@filterAllReservationsByCityAndBuilding');
$app->get('/getInformationByReservationId/{id}','ReservationController@getInformationByReservationId');

