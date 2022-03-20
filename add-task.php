<?php require("template/header.php"); ?>

<div class="container">
  <div class="row">
    <div class="col-12">
      <div class="card text-center">
        <form id="form" action="plan-list.php" method="post">
          <div class="form-group">
            <div class="card-header"><label for="inputTask">Aufgabe hinzufügen</label></div>
            <div class="card-body">
              <input type="text" class="form-control" id="inputTask" name="input" aria-describedby="description" placeholder="Aufgabe hinzufügen" required>
              <input type="text" name="ident" value="task" style="display: none;">
              <small id="description" class="form-text text-muted">Hier kann man eine Aufgabe eintragen und diese wird dann im Plan angezeigt ...</small>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-outline-secondary" onclick="window.location.href = 'plan-list.php';">Zurück <i class="fas fa-arrow-alt-circle-left"></i></button>
            <button type="submit" class="btn btn-primary">Bestätigen</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<?php require("template/footer.php"); ?>