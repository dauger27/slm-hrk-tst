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
    $player = Player::getInstance();
    $game = Game::getInstance();
} catch (DBException $e) {
    http_response_code($e->getCode());
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
$app->group('/api/v1', $authenticate, function () use ($app, $player, $game) {
    
   $app->get('/hello/:name', function ($name) {
        echo json_encode("{'name':$name}");
    })->name("route with params");
    
    $app->map('/players', function() use ($player) {
        $players = $player->get_players();
        if ($players) {
            echo json_encode($players);
        } else {
            echo $player->last_error();
        }
    })->via('GET', 'POST');
    
    $app->get('/getgame/:id', function () use ($app, $game) {
        //serve up mock data for game
        $board = file_get_contents("./monopolyData.json");
        $mockData = Array(
            "title"=>"Mock Game",
            "turn"=>10,
            "balance"=>524,
            "currentPlayerTurn"=>"Stuart",
            "board"=>json_decode($board)
        );
        
        echo json_encode($mockData);

    })->name("get the current state of a game by id");
    
    $app->get('/getgames', function () use ($app, $game) {
        $header = json_decode($app->request->headers->get('x-auth-token'));
        
        $games = $game->get_games(intval($header->player_id));
        echo json_encode($games);
    })->name("get all games by a particular player");
    
    $app->get('/getallgames', function () use ($app, $game) {
        $header = json_decode($app->request->headers->get('x-auth-token'));
        
        $games = $game->get_all_games();
        echo json_encode($games);
    })->name("get all games available");
    
    $app->post('/creategame', function() use ($app, $game) {
        $postData = json_decode($app->request->getBody(), true);

        // Validate POST variables
        if ($postData['name'] === NULL) {
            echo "Missing information";
        } else {

            $newGame = $game->create_game($postData['name']);

            if ($newGame) {
                echo $newGame;
            } else {
                echo $game->last_error();
            }

        }
    });
    
});

$app->get('/', function () {
    include 'index.html';
});

$app->get('/apiDocs', function () use ($app) {
    class RouteDumper extends \Slim\Router {
        public static function getAllRoutes() {
            $slim = \Slim\Slim::getInstance();
            return $slim->router->routes;
        }
    }
    
    class ParamNames extends \Slim\Route {
        public static function getParamNames($index){
            return $index->paramNames;
        }
    }
    
    $routes = RouteDumper::getAllRoutes();
    $array = Array();
    for($i = 0; $i < count($routes); $i++){

        $element = Array("pattern"=>$routes[$i]->getPattern(),
                        "params"=>ParamNames::getParamNames($routes[$i]),
                        "name"=>$routes[$i]->getName(),
                        "callable"=>$routes[$i]->getCallable(),
                        "middleware"=>$routes[$i]->getMiddleware(),
                        "methods"=>$routes[$i]->getHttpMethods());
        array_push($array,$element);
    }
    echo json_encode($array);
});

$app->post('/login', function() use ($app, $player) {
    $header = $app->request->headers->get('login');
    $decoded = base64_decode($header);
    $authArray = explode(":",$decoded);

    // Validate POST variables
    if ($authArray[0] === NULL || $authArray[1] === NULL) {
        echo "Invalid email/password";
    } else {
        
        $login = $player->login($authArray[0], $authArray[1]);
        
        if ($login) {
            $key = "yourMom1969";
            $time = time() + 6000;
            $token = array(
                'username'=>$app->request->post('email_address'),
                'issued'=> time(),
                'expires'=> $time
            );
            $jwt = JWT::encode($token, $key);

            //now put the encoded token into another public json object
            $pubToken = array(
                'username'=>$app->request->post('email_address'),
                'token'=>$jwt,
                'player_id'=>$login['player_id'],
                'expires'=>$time
            );
            echo json_encode($pubToken);

        } else {
            echo $player->last_error();
        }
        
    }
})->name('Authenticates username and password and returns a json web token')->stuff="junk";

$app->post('/createacct', function() use ($app, $player) {
    $postData = json_decode($app->request->getBody(), true);
    
    // Validate POST variables
    if ($postData['email_address'] === NULL || $postData['password'] === NULL || $postData['username'] === NULL) {
        echo "Missing information";
    } else {
        
        $login = $player->create_account($postData['email_address'], $postData['password'],$postData['username']);
        
        if ($login) {
            echo "account created";

        } else {
            echo $player->last_error();
        }
        
    }
});

/* NOTES:
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

//Run application
$app->run();
?>
