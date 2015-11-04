<?php
 
// Include db file
require_once('db.php');

// Database Config settings
//$url = parse_url(getenv("CLEARDB_DATABASE_URL"));
$url = parse_url('mysql://bba93111933e01:dab33642@us-cdbr-iron-east-03.cleardb.net/heroku_53d9578092467d5?reconnect=true');
define ('DB_HOST', $url["host"]);
define ('DB_USER', $url["user"]);
define ('DB_PASSWORD', $url["pass"]);
define ('DB_DB', substr($url["path"], 1));
$HOST = $url["host"];
$USERNAME = $url["user"];
$PASSWORD = $url["pass"];
$DATABASE = substr($url["path"], 1);
?>

