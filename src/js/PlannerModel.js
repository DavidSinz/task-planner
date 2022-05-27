
AufgabenPlanner.PlannerModel = function () {
  'use strict';

  const MGR_DATE_INPUT = document.getElementById('mgr-input_date'),
    MGR_LENGTH_INPUT = document.getElementById('mgr-input_length'),
    MGR_GOAL_INPUT = document.getElementById('mgr-textarea_goal'),
    MGR_REWARD_INPUT = document.getElementById('mgr-textarea_reward'),
    MGR_NOTE_INPUT = document.getElementById('mgr-textarea_note'),

    HAEKCHEN = '<span class="haekchen">✔</span>',
    KREUZCHEN = '<span class="kreuzchen">✘</span>',
    LINE_BREAK = '<br>',

    TASK_TABLE_HEAD = ['Datum', 'Aufgabe', 'Zusatzaufgabe', 'Belohnung'],
    TABLE_DATA_GROUP = ['maintask', 'additionaltask', 'reward'];

  var that = new MMEventTarget(),
    editTable = new EditTableData(),
    planIndex = '';

  that.planList = [];
  that.taskList = [];



  /**
   * the next function tells the hole app that the model data
   * has changed and sends the changed data to the app
   */

  function plannerDataChanged() {
    that.dispatchEvent({
      type: 'onModelDataChanged',
      planList: that.planList,
      taskList: that.taskList,
      taskTableData: buildTaskTableData()
    });
  }



  /**
   * functions to edit the task table data
   */

  function editTaskTableField(event) {
    let group = TABLE_DATA_GROUP[event.dataIdx - 1],
      editData = that.taskList[event.rowIdx][group];
    editTable.start(editData, event.rowIdx, event.dataIdx);
  }

  function storeEditTableData(event) {
    let group = TABLE_DATA_GROUP[editTable.dataIdx - 1];
    that.taskList[editTable.rowIdx][group] = event.data;
    plannerDataChanged();
  }



  /**
   * the next few functions convert the taskList to tableData,
   * so the taskTable can display the data from the taskList
   */

  function tasksToTableData(tasks) {
    let tableData = [];
    for (let i = 0; i < tasks.length; i++) {
      let sign = '';
      if (tasks[i].completed) sign = HAEKCHEN;
      else sign = KREUZCHEN;
      tableData.push(tasks[i].title + ' ' + sign);
    }
    let tableDataStr = '';
    for (let i = 0; i < tableData.length; i++) 
      tableDataStr += tableData[i] + LINE_BREAK;
    return tableDataStr;
  }

  function buildTaskTableData() {
    let taskTableData = []
    taskTableData.push(TASK_TABLE_HEAD);
    for (let i = 0; i < that.taskList.length; i++) {
      taskTableData.push([]);
      taskTableData[i+1].push(that.taskList[i].date);
      taskTableData[i+1].push(tasksToTableData(that.taskList[i].maintask));
      taskTableData[i+1].push(tasksToTableData(that.taskList[i].additionaltask));
      taskTableData[i+1].push(tasksToTableData(that.taskList[i].reward));
    }
    return taskTableData;
  }



  /**
   * helper functions for the function savePlan()
   */

  function getFreePlanId() {
    let id = 0;
    for (var i = 0; i < that.planList.length; i++) {
      let planId = that.planList[i].id;
      if (planId === id) {
        id++;
        i = 0;
      }
    }
    return id;
  }

  function compare(previous, next) {
    if (previous.start_date < next.start_date) return -1;
    if (previous.start_date > next.start_date) return 1;
    return 0;
  }

  function emptyInput() {
    MGR_DATE_INPUT.value = '';
    MGR_LENGTH_INPUT.value = '';
    MGR_GOAL_INPUT.value = '';
    MGR_REWARD_INPUT.value = '';
    MGR_NOTE_INPUT.value = '';
  }

  function getInputDate() {
    let dateArr = MGR_DATE_INPUT.value.split(' ');
    let select = document.querySelector('.picker__select--month');
    let month = select.options[select.selectedIndex].getAttribute('value');
    let date = new Date();
    date.setFullYear(dateArr[2]);
    date.setMonth(month);
    date.setDate(dateArr[0]);
    return date;
  }



  /**
   * functions to handle the plan-list and all it's data in it
   */

  function savePlan() {
    let plan = new Plan(
      getFreePlanId(), 
      getInputDate(), 
      MGR_LENGTH_INPUT.value, 
      MGR_GOAL_INPUT.value,
      MGR_REWARD_INPUT.value,
      MGR_NOTE_INPUT.value
    );
    that.planList.push(plan);
    that.planList.sort(compare);
    plannerDataChanged();
    emptyInput();
  }

  function deletePlan(id) {
    id = id.split('_');
    id = parseInt(id[1]);
    that.planList.forEach(function (plan) {
      if (plan.id == id)
        that.planList.splice(that.planList.indexOf(plan), 1);
    });
    that.taskList = [];
    plannerDataChanged();
  }

  function activatePlan(idLabel) {
    let idArr = idLabel.split('_');
    that.planList.forEach(function (plan) {
      plan.active = false;
      if (plan.id == idArr[1]) {
        that.taskList = plan.task_list;
        plan.active = true;
      }
    });
    plannerDataChanged();
  }



  /**
   * handle controller events and change the screen-view
   */

  function handlePlannerContr(event) {
    switch (event.data) {
      case 'onMenuClicked':
        that.dispatchEvent({
          type: 'onScreenViewChange', 
          event: 'displayClickedMenu', 
          menu: event.menu
        });
        break;
      case 'onAddPlanClicked':
        that.dispatchEvent({
          type: 'onScreenViewChange', 
          event: 'changePlanMgrState'
        });
        break;
      case 'onSavePlanClicked':
        if (MGR_DATE_INPUT.value != '' 
          && MGR_LENGTH_INPUT.value != '') {
          savePlan();
          that.dispatchEvent({
            type: 'onScreenViewChange', 
            event: 'changePlanMgrState'
          });
        }
        break;
      case 'onInvokePlanElement':
        activatePlan(event.id);
        break;
      case 'onDeletePlanElement':
        planIndex = event.id;
        that.dispatchEvent({
          type: 'onScreenViewChange', 
          event: 'onDeletePlanElement'
        });
        break;
      case 'onAgreeErasingPlan':
        deletePlan(planIndex);
        break;
      case 'onTaskTableClicked':
        editTaskTableField(event);
        break;
      default:
    }
  }



  /**
   * functions to set and delete the model data
   */

  function setAufgPlannerData(data = []) {
    that.planList = data;
    that.planList.forEach(function (plan) {
      if (plan.active) that.taskList = plan.task_list;
    });
    plannerDataChanged();
  }

  function deleteAufgPlanData() {
    that.planList = [];
    that.taskList = [];
    plannerDataChanged();
  }



  function init() {
    editTable.addEventListener('storeEditTableData', storeEditTableData);
  }

  init();

  that.handlePlannerContr = handlePlannerContr;
  that.setAufgPlannerData = setAufgPlannerData;
  that.deleteAufgPlanData = deleteAufgPlanData;
  return that;
};