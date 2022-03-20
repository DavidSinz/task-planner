<?php
require('database/db_connection.php');

$conn->close();

require("template/header.php");
?>
<div class="container">
  <div class="row">
    <div class="col-12">
      <div class="card text-center">
        <form id="form" action="index.php" method="post">
          <div class="form-group">
            <div class="card-header"><label for="inputTask">Plan hinzufügen</label></div>
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <input class="form-control" type="date" name="startdate" aria-describedby="descrBegin" required>
                  <small id="descrBegin" class="form-text text-muted">Beginn des Zeitraums ...</small>
                </div>
                <div class="col-6">
                  <input class="form-control" type="date" name="enddate" aria-describedby="descrEnd" required>
                  <small id="descrEnd" class="form-text text-muted">Ende des Zeitraums ...</small>
                </div>
                <div class="col-12">
                  <textarea class="form-control" id="inputMemo" name="memo" aria-describedby="descrMemo" placeholder="Notizen hinzufügen" rows="15"></textarea>
                  <small id="descrMemo" class="form-text text-muted">Hier kann man beliebige Notizen eintragen, welche wichtig sind ...</small>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-outline-secondary" onclick="window.location.href = 'index.php';">Zurück <i class="fas fa-arrow-alt-circle-left"></i></button>
            <button type="submit" name="add-plan" class="btn btn-primary">Bestätigen</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
<?php require("template/footer.php"); ?>