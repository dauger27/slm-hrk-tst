<?php
require 'vendor/autoload.php';
require_once('lib/config.php');

//http://docs.slimframework.com
//Load Slim Application
$app = new \Slim\Slim;

//Load Models
try {
    $player = Player::getInstance();
    $game = Game::getInstance();
} catch (DBException $e) {
    http_response_code($e->getCode());
    die($e->getMessage());
}

//Create route/controller functionality
$app->get('/', function () {
    header("Location: /login");
    exit;    
});

$app->map('/players', function() use ($player) {
    $players = $player->get_players();
    if ($players) {
        echo json_encode($players);
    } else {
        echo $player->last_error();
    }
})->via('GET', 'POST');

$app->get('/login', function() {
    include 'index.html'; // TODO: use slim view functionality?
});

$app->post('/login', function() use ($app, $player) {
    // Validate POST variables
    if ($app->request->post('email_address') === NULL || $app->request->post('password') === NULL) {
        echo "Invalid email/password";
    } else {
        $login = $player->login($app->request->post('email_address'), $app->request->post('password'));
        if ($login) {
            //TODO: Store login information in session/cookie?

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