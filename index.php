<?php
require 'vendor/autoload.php';


$app = new \Slim\Slim;
 
$app->get('/', function(){
    echo "Hello, World";
}); 
 
$app->get('/testPage', function() use ($app) {
    $app->render('testpage.php');
});
 
$app->run();