/* eslint-env browser */
(function(context) {
  "use strict";
  var JsonHelper = {};

  function requestFile(url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function(event) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          onSuccess(xhr.responseText, event);
        } else {
          onError(xhr.statusText);
        }
      }
    };
    xhr.onerror = function(event) {
      onError(xhr.statusText, event);
    };
    xhr.send(null);
  }

  function loadJSON(url, callback) {
    requestFile(url, function(result) {
      callback(JSON.parse(result));
    }, function() {
      callback(null);
    });
  }

  JsonHelper.loadJSON = loadJSON;

  context.JsonHelper = JsonHelper;
}(window));
