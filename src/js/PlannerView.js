
AufgabenPlanner.PlannerView = function () {
  'use strict';



  /**
   * declaring all the constants and variables for tha app view
   */

  const CONTENT = document.getElementById('content'),
    TASK_TABLE_EL = document.getElementById('Aufgaben_table'),
    PLAN_MGR_VIEW = CONTENT.querySelector('.plan_manager-view'),
    PLAN_MGR_EDIT = CONTENT.querySelector('.plan_manager-edit'),
    MOTIVA_PANELS = CONTENT.querySelectorAll('.Motivation_panel'),

    PLAN_MGR_DEFAULT = PLAN_MGR_VIEW.querySelector('.plan_mgr-default'),
    PLAN_MANAGER_LIST = PLAN_MGR_VIEW.querySelector('.plan_manager-list'),
    PLAN_MGR_ADD_BTN = PLAN_MGR_VIEW.querySelector('.plan_manager-add_plan'),

    PLAN_EL_SKEL = '<div class="col s12 m6 l4">'
      + '<div class="mgr_card section card-panel">'
      + '<span class="date"></span>'
      + '<span class="goal truncate"></span>'
      + '<span class="reward truncate"></span>'
      + '<a class="small-del-btn btn-floating btn-tiny">'
      + '<i class="material-icons">close</i>'
      + '</a></div></div>',

    PLAN_DATE_LABEL = 'Aufgaben ab dem ',
    PLAN_GOAL_LABEL = 'Ziel: ',
    PLAN_REWARD_LABEL = 'Belohnung: ',
    PLAN_INDEX_LABEL = 'planId_',

    DISPLAY_NONE = 'display-none';

  var that = new MMEventTarget(),
    taskTable,
    taskChart;



  /**
   * the next few functions display the plan-list and also the 
   * default version of it on the plan_manager-view 
   */

  function displayPLAN_MGR_VIEW(state) {
    if (state === 'default' && PLAN_MGR_DEFAULT.className.includes(DISPLAY_NONE)) {
      PLAN_MGR_DEFAULT.classList.remove(DISPLAY_NONE);
      PLAN_MANAGER_LIST.classList.add(DISPLAY_NONE);
      PLAN_MGR_ADD_BTN.children[0].classList.add('pulse');
    }
    if (state === 'list' && PLAN_MANAGER_LIST.className.includes(DISPLAY_NONE)) {
      PLAN_MGR_DEFAULT.classList.add(DISPLAY_NONE);
      PLAN_MANAGER_LIST.classList.remove(DISPLAY_NONE);
      PLAN_MGR_ADD_BTN.children[0].classList.remove('pulse');
    }
  }

  function setPlanManagerView(planList) {
    displayPLAN_MGR_VIEW('list');
    PLAN_MANAGER_LIST.innerHTML = '';
    for (let i = 0; i < planList.length; i++) {
      PLAN_MANAGER_LIST.innerHTML += PLAN_EL_SKEL;
      let planEl = PLAN_MANAGER_LIST.lastChild;
      planEl.querySelector('.mgr_card').id = PLAN_INDEX_LABEL + planList[i].id;
      planEl.querySelector('.date').innerHTML = PLAN_DATE_LABEL + planList[i].date_str;
      planEl.querySelector('.goal').innerHTML = PLAN_GOAL_LABEL + planList[i].goal;
      planEl.querySelector('.reward').innerHTML = PLAN_REWARD_LABEL + planList[i].reward;
      if (planList[i].active) planEl.querySelector('.mgr_card').classList.add('active');
      else planEl.querySelector('.mgr_card').classList.remove('active');
    }
  }

  function setPLAN_MGR_VIEWBack() {
    displayPLAN_MGR_VIEW('default');
    PLAN_MANAGER_LIST.innerHTML = '';
  }



  /**
   *
   *
   */

  function initMotivationView(planList) {
    try {
      let plan = {}
      for (let i = 0; i < planList.length; i++) {
        if (planList[i].active === true) plan = planList[i];
      }
      let con = [plan.goal, plan.reward, plan.note];
      for (let i = 0; i < MOTIVA_PANELS.length; i++) {
        let str = con[i].replace(/(?:\r\n|\r|\n)/g, '<br />');
        MOTIVA_PANELS[i].innerHTML = str;
      }
    } catch (error) {console.log('handle error');}
  }



  /**
   *
   *
   */

  function showDeletePlanView(event) {
    $('#delete_plan').modal('open');
  }



  /**
   * changes between plan_manager-view and plan_manager-edit
   * when the user clicked on a button
   */

  function changePlanMgrState() {
    PLAN_MGR_VIEW.classList.toggle(DISPLAY_NONE);
    PLAN_MGR_EDIT.classList.toggle(DISPLAY_NONE);
  }



  /**
   * this functiondisplays the clicked menu from the
   * side-navigation
   */

  function displayClickedMenu(event) {
    for (let i = 0; i < CONTENT.children.length; i++) {
      CONTENT.children[i].classList.add(DISPLAY_NONE);
      if (event.menu.target.className.includes(CONTENT.children[i].id))
        CONTENT.children[i].classList.remove(DISPLAY_NONE);
    }
  }



  /**
   * this function reacts on changes from the planModel and 
   * changes then the view or makes other changes 
   */

  function handleModelChanges(event) {
    switch (event.event) {
      case 'displayClickedMenu':
        displayClickedMenu(event);
        break;
      case 'changePlanMgrState':
        changePlanMgrState(event);
        break;
      case 'onDeletePlanElement':
        showDeletePlanView(event);
        break;
      default:
    }
  }



  /**
   * the next two functions manage the default and not default 
   * view of the hole app when the user logs in or out.
   */

  function setPlanViewDefault() {
    try {
      setPLAN_MGR_VIEWBack();
      taskTable.removeTable();
      taskChart.removeChart();
    } catch (error) {}
  }

  function setAufgPlannerView(planList = [], taskList = [], taskTableData = []) {
    setPlanViewDefault();
    if (planList.length > 0) {
      setPlanManagerView(planList);
      initMotivationView(planList);
      taskTable = new Table(TASK_TABLE_EL, taskTableData);
      taskChart = new TaskChart(taskList);
    }
  }



  /**
   * function to initialize the components of materialize
   */

  function initMaterializeView() {
    // side navigation
    $(".button-collapse").sideNav({closeOnClick: true});
    $('.collapsible').collapsible();

    // date-picker
    $('.datepicker').pickadate({
      selectMonths: true,
      selectYears: 15,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: false
    });

    $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });
  }



  function init() {
    initMaterializeView();
  }

  init();

  that.handleModelChanges = handleModelChanges;
  that.setPlanViewDefault = setPlanViewDefault;
  that.setAufgPlannerView = setAufgPlannerView;
  return that;
};