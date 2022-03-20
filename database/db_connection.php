<?php

$servername = "127.0.0.1";
$username = "root";
$password = "";
$dbname = "test";
/*
$servername = "rdbms.strato.de";
$username = "U3911630";
$password = "UC3KS4IJ1u";
$dbname = "DB3911630";
*/
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

?>