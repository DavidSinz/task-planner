
function Table (element, content) {
  'use strict';

  const THEAD_SKELETON = '<thead></thead>',
    TBODY_SKELETON = '<tbody></tbody>',
    TR_SKELETON = '<tr></tr>',
    TD_SKELETON = '<td></td>';

  var that = new MMEventTarget(),
    tableEl,
    theadEl,
    tbodyEl;

  function convertTo2dArray(array) {
    if (Array.isArray(array[0]) == false) {
      let newArr = [];
      newArr.push(array);
      array = newArr;
    }
    return array;
  }

  function setRowContent(tr, content) {
    for (let i = 0; i < tr.children.length; i++) {
      tr.children[i].innerHTML = content[i];
    }
  }

  function setTableContent(element, content) {
    for (let i = 0; i < content.length; i++) {
      setRowContent(element.children[i], content[i]);
    }
  }

  function buildSkeleton(parent, tdLength, trLength) {
    for (let i = 0; i < trLength; i++) {
      parent.innerHTML += TR_SKELETON;
      parent.children[i].className = i;
      for (let j = 0; j < tdLength; j++) {
        parent.children[i].innerHTML += TD_SKELETON;
        parent.children[i].children[j].className = '' + j;
      }
    }
  }

  function initTableParts() {
    tableEl.innerHTML += THEAD_SKELETON;
    tableEl.innerHTML += TBODY_SKELETON;
    theadEl = tableEl.children[0];
    tbodyEl = tableEl.children[1];
  }

  function initTableSection(element, content) {
    if (content.length !== 0) {
      content = convertTo2dArray(content);
      buildSkeleton(element, content[0].length, content.length);
      setTableContent(element, content);
    }
  }

  function setTable(element, content) {
    tableEl = element;
    initTableParts();
    try {
      initTableSection(theadEl, content[0]);
      initTableSection(tbodyEl, content.slice(1, content.length));
    } catch (error) {}
  }

  setTable(element, content);

  this.removeTable = function () {
    try {
      theadEl.innerHTML = '';
      tbodyEl.innerHTML = '';
    } catch (error) {}
  }

  this.setContent = function (content) {
    this.removeTable();
    setTable(tableEl, content);
  }
}