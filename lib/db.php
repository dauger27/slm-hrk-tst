<?php 
//DB Class (returns Array/throws DBException)
class DB {
    private $conn = NULL;
    private static $instance = NULL;

    public function __construct() {
        if (is_null($this->conn)) {
            $this->conn = $this->db_connect();

            if (is_string($this->conn)) {
                throw new DBException($this->conn, 500);
            }
        }
    } // __construct

    public static function getInstance() {
	//Create instance if necessary
	if(self::$instance === NULL) {
	    self::$instance = new self();
	}

	return self::$instance;
    } // getInstance

    public function __destruct() {
        $this->conn->close();
        $this->conn = NULL;
        self::$instance = NULL;
    } // __destruct

    private function db_connect() {
        $conn = mysqli_init();

        if ($conn->real_connect(DB_HOST, DB_USER, DB_PASSWORD) === false) {
            $conn->close();
            return 'Could not connect to MySQL server';
        } else {
            if ($conn->select_db(DB_DB) === false) {
                $conn->close();
                return 'Could not connect to MySQL database';
            } else {
                return $conn;
            }
        }
    } // db_connect

    private function compile_binds($sql, $binds) {
	foreach ((array) $binds as $val) {
	    // If the SQL contains no more bind marks ("?"), we're done
	    if (($next_bind_pos = strpos($sql, '?')) === FALSE)
		break;

	    // Properly escape the bind value
	    $val = "'".$this->conn->escape_string($val)."'";

	    // Temporarily replace possible bind marks ("?"), in the bind value itself, with a placeholder
	    $val = str_replace('?', '{%B%}', $val);

	    // Replace the first bind mark ("?") with its corresponding value
	    $sql = substr($sql, 0, $next_bind_pos).$val.substr($sql, $next_bind_pos + 1);
	}


	// Restore placeholders
	return str_replace('{%B%}', '?', $sql);
    } // compile_binds

    public function query($sql) {
	//if we have more than one argument ($sql)
	if (func_num_args() > 1) {
	    $argv = func_get_args();
	    $binds = (is_array(next($argv))) ? current($argv) : array_slice($argv, 1);
	    $sql = $this->compile_binds($sql, $binds);
	}

        $mysqliresult = $this->conn->query($sql);

	if ($mysqliresult === FALSE) {
	    throw new DBException($this->conn->error.' ('.$this->conn->errno.')');
	} else {
	    if ($this->conn->insert_id) {
                //Return insert_id if one exists (INSERT/UPDATE)
                return $this->conn->insert_id;
	    } elseif (strpos($sql,'SELECT') === false) {
		//DELETE
		return true;
	    } else {
		//SELECT
		$results = array();
		while ($row = $mysqliresult->fetch_assoc()) {
		    $result = array();

		    foreach ($row as $k=>$v) {
			$result[$k] = $v;
		    }

		    $results[] = $result;
		}

		return $results;  
	    }
	}   
    } // query
} // DB

//DBException Class (thrown by DB class)
class DBException extends Exception {}
?>