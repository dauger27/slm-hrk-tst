<?php
class Game {
    private $db;
    private $error;
    private static $instance = NULL;

    public function __construct() {
	if (self::$instance === NULL) {
	    self::$instance = $this;
        }

	$this->error = '';
	$this->db = DB::getInstance();
    }

    public static function getInstance() {
	//Create instance if necessary
	if(self::$instance === NULL) {
	    self::$instance = new self();
	}
	
	return self::$instance;
    }

    //Return games for player
    public function get_games($player_id) {
	try {
	    $result = $this->db->query("SELECT * FROM player_game WHERE FK_player_id=?", $player_id);
	    if (count($result) == 0) {
		$this->error = 'No games exist';
		return FALSE;
	    }
	} catch (DBException $e) {
	    $this->error = $e->getMessage();
	    return FALSE;
	}

	return $result;
    } // get_games

    //Return all games
    public function get_all_games() {
	try {
	    $result = $this->db->query("SELECT * FROM game");
	    if (count($result) == 0) {
		$this->error = 'No games exist';
		return FALSE;
	    }
	} catch (DBException $e) {
	    $this->error = $e->getMessage();
	    return FALSE;
	}

	return $result;
    } // get_games

    // Get the last error that occurred
    public function last_error() {
	$error = $this->error;
	$this->error = '';
	return $error;
    } // last_error
} // Game
?>