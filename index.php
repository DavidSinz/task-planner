<?php
require('database/db_connection.php');

$plan = array();

if (isset($_POST["add-plan"])) {
  $sql = "INSERT INTO plan (memo, startdate, enddate) VALUES ('".nl2br(htmlentities($_POST["memo"], ENT_QUOTES))."','".$_POST["startdate"]."','".$_POST["enddate"]."')";
  if ($conn->query($sql) === FALSE) echo "Error: " . $sql . "<br>" . $conn->error;
}

if (isset($_POST["deleteplan"])) {
  $sql = "DELETE FROM task WHERE planid = ".$_POST["deleteplan"];
  if ($conn->query($sql) === FALSE) echo "Error deleting record: " . $conn->error;
  $sql = "DELETE FROM persistence WHERE planid = ".$_POST["deleteplan"];
  if ($conn->query($sql) === FALSE) echo "Error deleting record: " . $conn->error;
  $sql = "DELETE FROM plan WHERE id = ".$_POST["deleteplan"];
  if ($conn->query($sql) === FALSE) echo "Error deleting record: " . $conn->error;
}

$sql = "SELECT * FROM plan ORDER BY startdate DESC";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $memo = html_entity_decode($row["memo"]);
    if (strlen($memo) > 183) $memo = substr($memo, 0, 180)."...";
    array_push($plan, array("id"=>$row["id"], "memo"=>$memo, "startdate"=>$row["startdate"], "enddate"=>$row["enddate"]));
  }
}



$conn->close();

require("template/header.php");
?>
<div class="container">
  <div class="row">
    <?php foreach ($plan as $x) { ?>
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Vom <?php echo date("d F Y", strtotime($x["startdate"])); ?> bis <?php echo date("d F Y", strtotime($x["enddate"])); ?></h5>
          <p class="card-text"><?php echo $x["memo"]; ?></p>
        </div>
        <div class="card-footer">
          <div class="row">
            <div>
              <form action="plan-list.php" method="post">
                <button type="submit" name="planid" value="<?php echo $x['id']; ?>" class="btn btn-outline-primary align-self-baseline">Öffnen</button>
              </form>
            </div>
            <div>
              <button type="button" class="btn btn-outline-danger align-self-baseline" data-toggle="modal" data-target="#deleteModal" data-id="<?php echo $x['id']; ?>" data-date="<?php echo date('d F Y', strtotime($x['startdate'])); ?>"><i class="fas fa-trash-alt"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <?php } ?>
    <div class="col-12">
      <form class="text-center" action="add-plan.php" method="post">
        <button type="submit" class="btn btn-outline-primary">Plan hinzufügen <i class="fas fa-plus"></i></button>
      </form>
    </div>
  </div>

  <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Plan löschen</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Bist du dir sicher, dass du den Plan vom <span id="modal-date"></span> mit all den Aufgaben und Zielen löschen willst?
        </div>
        <div class="modal-footer">
          <form id="formDelete" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button id="submitDelete" type="submit" name="deleteplan" value="" class="btn btn-danger">Löschen</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
<?php require("template/footer.php"); ?>