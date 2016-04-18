<?php
class Player {
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

    // Return players
    public function get_players() {
	try {
	    $result = $this->db->query("SELECT player_id, email_address, username FROM player");
	    if (count($result) == 0) {
		$this->error = 'No players exist';
		return FALSE;
	    }
	} catch (DBException $e) {
	    $this->error = $e->getMessage();
	    return FALSE;
	}
        
    return $result;
    } // get_players

        
    // Return a single player
    public function get_player($player) {
	try {
	    $result = $this->db->query("SELECT email_address, username FROM player WHERE player_id=?", $player);
	    if (count($result) == 0) {
		$this->error = 'No players exist';
		return FALSE;
	    }
	} catch (DBException $e) {
	    $this->error = $e->getMessage();
	    return FALSE;
	}

	return $result;
    } // get_player

    // Authentication method
    public function login($email_address, $password) {
	try {
	    $result = $this->db->query("SELECT player_id, username FROM player WHERE email_address=? AND secret=?", $email_address, $password); // TODO: passwords should eventually be hashed
	    if (count($result) == 0) {
		$this->error = 'Invalid email/password';
		return FALSE;
	    }
	} catch (DBException $e) {
	    $this->error = $e->getMessage();
	    return FALSE;
	}

	return $result[0];
    }
    
    // Create account
    public function create_account($email, $name, $password) {
	try {
	    $result = $this->db->query("INSERT INTO player (email_address,secret,username) VALUES (?,?,?)", $email, $name, $password); // TODO: passwords should eventually be hashed
	    if (count($result) == 0) {
		$this->error = 'Account cannot be created';
		return FALSE;
	    }
	} catch (DBException $e) {
	    $this->error = $e->getMessage();
	    return FALSE;
	}

	return $result[0];
    }

    // Get the last error that occurred
    public function last_error() {
	$error = $this->error;
	$this->error = '';
	return $error;
    } // last_error
} // Player
?>