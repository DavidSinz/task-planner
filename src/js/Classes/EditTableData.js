
function EditTableData () {
  "use strict";

  const EDIT_DATA_EL = document.getElementById('Aufgaben_edit-mode'),
    ADD_BUTTON = EDIT_DATA_EL.querySelector('.add-btn'),
    SAVE_BUTTON = EDIT_DATA_EL.querySelector('.safe-btn'),
    INPUT_AREA = EDIT_DATA_EL.querySelector('.input-area'),

    UP_BUTTON = '<span class="up li-btn"><i class="material-icons">arrow_upward</i></span>',
    DOWN_BUTTON = '<span class="down li-btn"><i class="material-icons">arrow_downward</i></span>',
    CLOSE_BUTTON = '<span class="close li-btn"><i class="material-icons">close</i></span>';

  var that = new MMEventTarget(),
    list;

  function getEditModeData() {
    let editModeData = [];
    for (let i = 0; i < list.children.length; i++) {
      editModeData.push({
        title: list.children[i].firstChild.nodeValue,
        completed: list.children[i].classList == 'checked'
      });
    }
    return editModeData;
  }

  function createItem(title, checked = false) {
    if (title !== '') {
      let li = document.createElement('LI');
      li.append(document.createTextNode(title));
      list.append(li);
      if (checked) list.lastChild.classList = 'checked';
      initItem(list.lastChild);
    }
  }

  function initItemButtons(item) {
    item.innerHTML += UP_BUTTON;
    item.innerHTML += DOWN_BUTTON;
    item.innerHTML += CLOSE_BUTTON;
  }

  function initEventListener(item) {
    item.querySelector('.close').addEventListener('click', function() {
      this.parentElement.remove();
    });
    item.querySelector('.up').addEventListener('click', function() {
      let listItem = this.parentElement;
      if (listItem.previousSibling.tagName == 'LI') {
        listItem.parentElement.insertBefore(listItem, listItem.previousSibling);
      } // first item is a text Node. So we use if statement as control structure
    });
    item.querySelector('.down').addEventListener('click', function() {
      let listItem = this.parentElement;
      try {
        listItem.parentElement.insertBefore(listItem, listItem.nextSibling.nextSibling);
      } catch (error) {} // last item is null, so we use a try catch statement
    });
    item.addEventListener('click', function(event) {
      if (event.target.tagName === 'LI') 
        event.target.classList.toggle('checked');
    });
  }

  function initItem(item) {
    initItemButtons(item);
    initEventListener(item);
  }

  function newItem() {
    let inputValue = INPUT_AREA.querySelector('.input').value;
    createItem(inputValue);
    INPUT_AREA.querySelector('.input').value = '';
  }

  function start(data, rowIdx, dataIdx) {
    that.rowIdx = rowIdx;
    that.dataIdx = dataIdx;
    try {
      for (let i = 0; i < data.length; i++)
        createItem(data[i].title, data[i].completed);
      EDIT_DATA_EL.classList.toggle('display-none');
    } catch (error) {}
  }

  function end() {
    EDIT_DATA_EL.classList.toggle('display-none');
    INPUT_AREA.querySelector('.input').value = '';
    that.dispatchEvent({type: 'storeEditTableData', data: getEditModeData()});
    while (list.children[0]) list.children[0].remove();
  }

  function init() {
    list = EDIT_DATA_EL.querySelector('.list');
    for (let i = 0; i < list.children.length; i++)
      initItem(list.children[i]);
    ADD_BUTTON.addEventListener('click', newItem);
    SAVE_BUTTON.addEventListener('click', end);
  }

  init();

  that.start = start;
  return that;
}