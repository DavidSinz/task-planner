<?php require("template/header.php"); ?>

<div class="container">
  <div class="row">
    <div class="col-12">
      <div class="card text-center">
        <form id="form" action="plan-list.php" method="post">
          <div class="form-group">
            <div class="card-header"><label for="inputMemo">Notiz hinzufügen</label></div>
            <div class="card-body">
              <textarea class="form-control" id="inputMemo" name="input" aria-describedby="description" placeholder="Notizen hinzufügen" rows="15"><?php
                  $text = $_POST["memo"];
                  $text = str_replace( "<br>", "\n", $text );
                  $text = str_replace( "<br/>", "\n", $text );
                  $text = str_replace( "<br />", "\n", $text );
                  $text = str_replace( "<BR>", "\n", $text );
                  $text = str_replace( "<BR/>", "\n", $text );
                  $text = str_replace( "<BR />", "\n", $text );
                  echo $text;
                ?></textarea>
              <input type="text" name="ident" value="memo" style="display: none;">
              <small id="description" class="form-text text-muted">Hier kann man beliebige Notizen eintragen, welche wichtig sind ... </small>
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