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
    } // get_all_games
    
    //Create game
    public function create_game($name) {
	try {
	    $result = $this->db->query("INSERT INTO game (name) VALUES (?)", $name);
	    if (count($result) == 0) {
		$this->error = 'Cannot create game';
		return FALSE;
	    }
	} catch (DBException $e) {
	    $this->error = $e->getMessage();
	    return FALSE;
	}

	return $result;
    } // create_games
    
    //add players to game
    public function add_players($gameID, $playerID) {
	try {
	    $result = $this->db->query("INSERT INTO player_game (FK_game_id,FK_player_id) VALUES (?,?)", $gameID, $playerID);
	    if (count($result) == 0) {
		$this->error = 'Cannot create game';
		return FALSE;
	    }
	} catch (DBException $e) {
	    $this->error = $e->getMessage();
	    return FALSE;
	}

	return $result;
    } // add_players

    // Get the last error that occurred
    public function last_error() {
	$error = $this->error;
	$this->error = '';
	return $error;
    } // last_error
} // Game
?>