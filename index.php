<?php
require 'vendor/autoload.php';
require_once('lib/config.php');

//http://docs.slimframework.com
//Load Slim Application
$app = new \Slim\Slim;

//Load JWT
use \Firebase\JWT\JWT;

//Load DB
try {
    $db = new DB();
} catch (DBException $e) {
    http_response_code(500);
    die($e->getMessage());
}

//authentication middleware for protected routes
$authenticate = function(\Slim\Route $route) use ($app){
    
    //get header from app and try to decode.
    try{
        $header = $app->request->headers->get('x-auth-token');
        $header = json_decode($header,true);
        $decoded = JWT::decode($header['token'], "yourMom1969", array('HS256'));
    }
    catch(exception $e){
        http_response_code(401);
        die("No Token");
    }
    
    //check if its expired and that the private token matches the public token
    if($decoded->expires < time() && $header['username'] == $decoded->username){
        http_response_code(401);
        die("Token Expired");
    }
    
};

//protected route group
$app->group('/api/v1', $authenticate, function () use ($app, $db) {
    
   $app->get('/hello/:name', function ($name) {
        echo json_encode("{'name':$name}");
    });
    
    $app->map('/players', function() use ($app, $db) {
        try {
            $players = $db->get_players();
            $outArray = array();
            foreach ($players as $player) {
                $arr = array('ID'=>$player->player_id,'Email'=>$player->email_address,'Secret'=>$player->secret,'Username'=>$player->username);
                array_push($outArray,$arr);
            }
            echo json_encode($outArray);
        } catch (DBException $e) {
            http_response_code(500);
            die($e->getMessage());
        }
    })->via('GET', 'POST');
    
});

$app->get('/', function () {
    include 'index.html';
});




//generate webtoken on user authentication
$app->get('/login', function() use ($app, $db) {
    
    //verify login credentials
    $auth = $app->request->headers->get("stuff");
    $authArray = explode(":",$auth);
    try {
        $stuff = $db->get_auth($authArray[0],$authArray[1]);
    } catch (DBException $e) {
        http_response_code(401);
        die($e->getMessage());
    }
    
    if(count($stuff)){
        
        $key = "yourMom1969";
        $token = array(
            'username'=>$stuff[0]->username,
            'issued'=> time(),
            'expires'=> time() + 60
        );
        $jwt = JWT::encode($token, $key);
        
        //now put the encoded token into another public json object
        $pubToken = array(
            'username'=>$stuff[0]->username,
            'token'=>$jwt
        );
        echo json_encode($pubToken);
    }
    else{echo "No Auth";}
    
});

/*
$app->get('/books/:id', function ($id) {
    //Show book identified by $id
});

$app->post('/books', function () {
    //Create book
});

$app->put('/books/:id', function ($id) {
    //Update book identified by $id
});

$app->delete('/books/:id', function ($id) {
    //Delete book identified by $id
});

$app->get('/hello/:name+', function ($name) {
    // Do something
});
//When you invoke this example application with a resource URI Ò/hello/Josh/T/LockhartÓ, the route callbackÕs $name argument will be equal to array('Josh', 'T', Lockhart').

$authenticateForRole = function ( $role = 'member' ) {
    return function () use ( $role ) {
        $user = User::fetchFromDatabaseSomehow();
        if ( $user->belongsToRole($role) === false ) {
            $app = \Slim\Slim::getInstance();
            $app->flash('error', 'Login required');
            $app->redirect('/login');
        }
    };
};
$app = new \Slim\Slim();
$app->get('/foo', $authenticateForRole('admin'), function () {
    //Display admin control panel
});

// API group
$app->group('/api', function () use ($app) {

    // Library group
    $app->group('/library', function () use ($app) {

        // Get book with ID
        $app->get('/books/:id', function ($id) {

        });

        // Update book with ID
        $app->put('/books/:id', function ($id) {

        });

        // Delete book with ID
        $app->delete('/books/:id', function ($id) {

        });

    });

});

The routes defined above would be accessible at, respectively:

GET    /api/library/books/:id
PUT    /api/library/books/:id
DELETE /api/library/books/:id
*/
$app->run();

