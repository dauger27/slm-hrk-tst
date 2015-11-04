<?php
require 'vendor/autoload.php';
require_once('lib/config.php');

//http://docs.slimframework.com
//Load Slim Application
$app = new \Slim\Slim;

//Load DB
try {
    $db = new DB();
} catch (DBException $e) {
    http_response_code(500);
    die($e->getMessage());
}

/*
}
$app->get('/hello/:name', function ($name) {
    echo "Hello, $name";
});
*/
$app->get('/hello/:name', function ($name) {
    echo "Hello, $name";
});

$app->post('/hello', function () use ($app) {    
    //POST variable
    $name = $app->request->post('name');
    if (is_nuLL($name)) {
        echo "Hello, world";
    } else {
        echo "Hello, $name";
    }
});


$app->map('/players', function() use ($app, $db) {
    try {
        $players = $db->get_players();
        foreach ($players as $player) {
            echo "ID:\t\t\t".$player->player_id."\n";
            echo "Email:\t\t".$player->email_address."\n";
            echo "Secret:\t\t".$player->secret."\n";
            echo "Username:\t".$player->username."\n\n";
        }
    } catch (DBException $e) {
        http_response_code(500);
        die($e->getMessage());
    }
})->via('GET', 'POST');

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

