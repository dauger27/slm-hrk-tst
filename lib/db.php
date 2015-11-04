<?php 
//DB Class (creates DBQueryResult/throws DBException)
class DB {
    private $conn = NULL;
 
    public function __construct() {
        if (is_null($this->conn)) {
            $this->conn = $this->dbconnect();
            if (is_string($this->conn)) {
                throw new DBException ($this->conn, 500);
            }
        }
    } // __construct

    public function __destruct() {
        mysqli_close($this->conn);
        $this->conn = NULL;
    } // __destruct

    private function dbconnect() {
        $conn = mysqli_init();
        if (mysqli_real_connect($conn, DB_HOST, DB_USER, DB_PASSWORD) === false) {
            mysqli_close($conn);
            return 'Could not connect to MySQL server';
        } else {
            if (mysqli_select_db($conn, DB_DB) === false) {
                mysqli_close($conn);
                return 'Could not connect to MySQL database';
            } else {
                return $conn;
            }
        }
    } // dbconnect

    private function query($sql) {
//return $this->conn;
//return $sql;
        $res = mysqli_query($this->conn, $sql);
//return $res;
//return $this->conn;
        if ($res) {
            if (strpos($sql,'SELECT') === false) {
                return true;
            }
        } else {
            if (strpos($sql,'SELECT') === false) {
                return false;
            } else {
                return null;
            }
        }

        $results = array();

        while ($row = mysqli_fetch_array($res)) {
            $result = new DBQueryResult();
        
            foreach ($row as $k=>$v) {
                $result->$k = $v;
            }

            $results[] = $result;
        }

        return $results;        
    } // query

    //****PUBLIC FUNCTIONS FOR DB CLASS****//
    
    //Return players
    public function get_players() {
        $sql = 'SELECT * FROM player';
        return $this->query($sql);
    } // get_players
} // DB

//DBQueryResult (created by DB class)
class DBQueryResult {
    private $_results = array();
    
    public function __construct() {}
    
    public function __set($var,$val){
        $this->_results[$var] = $val;
    } // __set
    
    public function __get($var) {  
        if (isset($this->_results[$var])) {
            return $this->_results[$var];
        } else {
            return null;
        }
    } // __get
} // DBQueryResult

//DBException Class (thrown by DB class)
class DBException extends Exception {}
?>