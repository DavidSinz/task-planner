<?php
require('database/db_connection.php');

session_start();

$planid = 0;
if (isset($_POST['planid'])) {
  $planid = $_POST['planid'];
  $_SESSION['planid'] = $planid;
} elseif (isset($_SESSION['planid'])) {
  $planid = $_SESSION['planid'];
} else {
  echo "Es ist kein Plan aktiv momentan!";
  exit();
}

$memo = NULL;
$startdate = NULL;
$enddate = NULL;
$task = array();
$persistence = array();

if (isset($_POST["ident"])) {
  if ($_POST["ident"] == "task") {
    $sql = "INSERT INTO task (planid, name, checked) VALUES (".$planid.", '".htmlentities($_POST["input"], ENT_QUOTES)."', 0)";
    if ($conn->query($sql) === FALSE) echo "Error: " . $sql . "<br>" . $conn->error;
  }

  if ($_POST["ident"] == "persistence") {
    $sql = "INSERT INTO persistence (planid, name, checked) VALUES (".$planid.", '".htmlentities($_POST["input"], ENT_QUOTES)."', 0)";
    if ($conn->query($sql) === FALSE) echo "Error: " . $sql . "<br>" . $conn->error;
  }

  if ($_POST["ident"] == "memo") {
    $sql = "UPDATE plan SET memo = '".nl2br(htmlentities($_POST["input"], ENT_QUOTES))."' WHERE id = $planid";
    if ($conn->query($sql) === FALSE) echo "Error updating record: " . $conn->error;
  }
}

if (isset($_POST["deleteTask"])) {
  $sql = "DELETE FROM task WHERE id = ".$_POST['deleteTask'];
  if ($conn->query($sql) === FALSE) echo "Error deleting record: " . $conn->error;
}

if (isset($_POST["checkTask"])) {
  $exploded = explode(",", $_POST["checkTask"]);
  $checked = 0;
  if ($exploded[1] == 0) $checked = 1;
  $sql = "UPDATE task SET checked = ".$checked." WHERE id = ".$exploded[0];
  if ($conn->query($sql) === FALSE) echo "Error updating record: " . $conn->error;
}

if (isset($_POST["deletePersistence"])) {
  $sql = "DELETE FROM persistence WHERE id = ".$_POST['deletePersistence'];
  if ($conn->query($sql) === FALSE) echo "Error deleting record: " . $conn->error;
}

if (isset($_POST["checkPersistence"])) {
  $exploded = explode(",", $_POST["checkPersistence"]);
  $checked = 0;
  if ($exploded[1] == 0) $checked = 1;
  $sql = "UPDATE persistence SET checked = ".$checked." WHERE id = ".$exploded[0];
  if ($conn->query($sql) === FALSE) echo "Error updating record: " . $conn->error;
}

$sql = "SELECT * FROM plan WHERE id = ".$planid;
$result = $conn->query($sql);
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $memo = html_entity_decode($row["memo"]);
    $startdate = $row["startdate"];
    $enddate = $row["enddate"];
  }
}

$sql = "SELECT * FROM task WHERE planid = ".$planid." ORDER BY name ASC";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    array_push($task, array("id" => $row["id"], "name" => html_entity_decode($row["name"]), "checked" => $row["checked"]));
  }
}

$sql = "SELECT * FROM persistence WHERE planid = ".$planid." ORDER BY name ASC";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    array_push($persistence, array("id" => $row["id"], "name" => html_entity_decode($row["name"]), "checked" => $row["checked"]));
  }
}

$conn->close();

require("template/header.php");
?>
<div class="container">
  <div class="row">
    <div class="col-12 col-md-2 text-center"><button class="btn btn-outline-primary btn-lg" onclick="window.location.href = 'index.php';">Zurück <i class="fas fa-arrow-alt-circle-left"></i></button></div>
    <div class="col-12 col-md-10"><h2 class="text-center">Aufgaben Planner vom <?php echo date("d F Y", strtotime($startdate)); ?> - <?php echo date("d F Y", strtotime($enddate)); ?></h2></div>

    <div class="col-12 col-md-6 col-xl-4">
      <div class="card">
        <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
          <input type="text" name="planid" value="<?php echo $planid; ?>" style="display: none;">
          <div class="card-header text-center"><h3>Aufgaben</h3></div>
          <ul class="list-group list-group-flush">
            <?php 
              foreach ($task as $x) {
                if ($x['checked'] == 0) {
            ?>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div><?php echo $x['name']; ?></div>
              <div>
                <div class="btn-group" role="group" aria-label="group 1.1">
                  <button type="submit" name="checkTask" value="<?php echo $x['id']; ?>,<?php echo $x['checked']; ?>" class="btn btn-outline-success"><i class="fas fa-check"></i></button>
                  <button type="submit" name="deleteTask" value="<?php echo $x['id']; ?>" class="btn btn-outline-secondary"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </li>
            <?php
                } else {
            ?>
            <li class="list-group-item list-group-item-success d-flex justify-content-between align-items-center">
              <div><?php echo $x['name']; ?></div>
              <div>
                <div class="btn-group" role="group" aria-label="group 1.2">
                  <button type="submit" name="checkTask" value="<?php echo $x['id']; ?>,<?php echo $x['checked']; ?>" class="btn btn-success"><i class="fas fa-check"></i></button>
                  <button type="submit" name="deleteTask" value="<?php echo $x['id']; ?>" class="btn btn-secondary"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </li>
            <?php
                }
              }
            ?>
          </ul>
        </form>
        <div class="card-footer text-center"><button type="button" class="btn btn-outline-primary" onclick="window.location.href = 'add-task.php';">Aufgabe hinzufügen</button></div>
      </div>
    </div>

    <div class="col-12 col-md-6 col-xl-4">
      <div class="card">
        <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
          <input type="text" name="planid" value="<?php echo $planid; ?>" style="display: none;">
          <div class="card-header text-center"><h3>Ziele</h3></div>
          <ul class="list-group list-group-flush">
            <?php 
              foreach ($persistence as $x) {
                if ($x['checked'] == 0) {
            ?>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div><?php echo $x['name']; ?></div>
              <div>
                <div class="btn-group" role="group" aria-label="group 2.1">
                  <button type="submit" name="checkPersistence" value="<?php echo $x['id']; ?>,<?php echo $x['checked']; ?>" class="btn btn-outline-danger"><i class="fas fa-times"></i></button>
                  <button type="submit" name="deletePersistence" value="<?php echo $x['id']; ?>" class="btn btn-outline-secondary"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </li>
            <?php
                } else {
            ?>
            <li class="list-group-item list-group-item-danger d-flex justify-content-between align-items-center">
              <div><?php echo $x['name']; ?></div>
              <div>
                <div class="btn-group" role="group" aria-label="group 2.2">
                  <button type="submit" name="checkPersistence" value="<?php echo $x['id']; ?>,<?php echo $x['checked']; ?>" class="btn btn-danger"><i class="fas fa-times"></i></button>
                  <button type="submit" name="deletePersistence" value="<?php echo $x['id']; ?>" class="btn btn-secondary"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </li>
            <?php
                }
              }
            ?>
          </ul>
        </form>
        <div class="card-footer text-center"><button type="button" class="btn btn-outline-primary" onclick="window.location.href = 'add-pers.php';">Ziel hinzufügen</button></div>
      </div>
    </div>

    <div class="col-12 col-xl-4">
      <div class="card">
        <div class="card-header text-center"><h3>Notizen</h3></div>
        <div class="card-body text-left"><p><?php echo $memo; ?></p></div>
        <div class="card-footer text-center">
          <form id="form" action="update-memo.php" method="post">
            <input type="text" name="planid" value="<?php echo $planid; ?>" style="display: none;">
            <input type="text" name="memo" value="<?php echo $memo; ?>" style="display: none;">
            <button type="submit" class="btn btn-outline-primary">Notiz bearbeiten</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
<?php require("template/footer.php"); ?>