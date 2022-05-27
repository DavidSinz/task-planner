
AufgabenPlanner.PlannerController = function () {
  'use strict';

  const PLAN_MANAGER = document.getElementById('Verwalten'),
    SIDE_NAVIGATION = document.querySelector('.side-nav'),
    TASK_TABLE_EL = document.getElementById('Aufgaben_table');

  var that = new MMEventTarget(),
    tbodyEl;



  /**
   * sends a click event to the planModel if a planMgr-card was
   * clicked. Then either the card gets deleted or the card
   * gets activated and its data will be shown in the hole app.
   */

  function planMgrCardClicked(event) {
    let element = event.target;
    if (!event.target.className.includes('mgr_card'))
      element = event.target.parentNode;
    if (element.className.includes('mgr_card'))
      that.dispatchEvent({
        type: 'aufgPlanContrEvent',
        data: 'onInvokePlanElement',
        id: element.id
      });
    if (element.className.includes('small-del-btn'))
      that.dispatchEvent({
        type: 'aufgPlanContrEvent',
        data: 'onDeletePlanElement',
        id: element.parentNode.id
      });
  }



  /**
   * the next three functions handle the events, when a task
   * table data is clicked. Furthermore, the event listeners
   * can be assigned and removed.
   */

  function onTaskTableClicked(event) {
    that.dispatchEvent({
      type: 'aufgPlanContrEvent', 
      data: 'onTaskTableClicked',
      rowIdx: event.target.parentNode.className,
      dataIdx: event.target.className
    });
  }

  function initTaskTableContr() {
    try {
      tbodyEl  = TASK_TABLE_EL.children[1];
      for (let i = 0; i < tbodyEl.children.length; i++) 
        tbodyEl.children[i].addEventListener('click', onTaskTableClicked);
    } catch (error) {}
  }

  function eraseTableControls() {
    try {
      for (let i = 0; i < tbodyEl.children.length; i++) 
        tbodyEl.children[i].removeEventListener('click', onTaskTableClicked);
    } catch (error) {}
  }



  /**
   * the next two functions set and remove the event listeners
   * on the card elements. It is important for the login or
   * logout.
   */

  function setPlanMgrControls() {
    try {
      let planMgrCards = PLAN_MANAGER.querySelectorAll('.mgr_card');
      for (var i = 0; i < planMgrCards.length; i++) 
        planMgrCards[i].addEventListener('click', planMgrCardClicked);
    } catch (error) {}
  }

  function removePlanMgrContr() {
    try {
      let planMgrCards = PLAN_MANAGER.querySelectorAll('.mgr_card');
      for (var i = 0; i < planMgrCards.length; i++) 
        planMgrCards[i].removeEventListener('click', planMgrCardClicked);
    } catch (error) {}
  }



  /**
   * the next two functions set and remove the event listeners
   * on all clickable elements. It is important for the login 
   * or logout.
   */

  function removePlanControls() {
    removePlanMgrContr();
    eraseTableControls();
  }

  function setPlannerControls() {
    removePlanControls();
    setPlanMgrControls();
    initTaskTableContr();
  }



  /**
   * sets the event listeners on the buttons at the planMgr-view.
   */

  function planManagerButtons() {
    const ADD_PLAN_BTN = PLAN_MANAGER.querySelector('.plan_manager-add_plan'),
      SAVE_PLAN_BTN = PLAN_MANAGER.querySelector('.plan_manager-save_plan'),
      ERASE_PLAN_BTN = PLAN_MANAGER.querySelector('.plan_manager-erase_plan');
    ADD_PLAN_BTN.addEventListener('click', function () {
      that.dispatchEvent({type: 'aufgPlanContrEvent', data: 'onAddPlanClicked'});
    });
    SAVE_PLAN_BTN.addEventListener('click', function () {
      that.dispatchEvent({type: 'aufgPlanContrEvent', data: 'onSavePlanClicked'});
    });
    ERASE_PLAN_BTN.addEventListener('click', function () {
      that.dispatchEvent({type: 'aufgPlanContrEvent', data: 'onAgreeErasingPlan'});
    });
  }



  /**
   * sets the event listeners on the side navigation
   */

  function initSideNavigation() {
    for (let i = 0; i < SIDE_NAVIGATION.children.length; i++) {
      if (SIDE_NAVIGATION.children[i].children[0].tagName === 'A')
        SIDE_NAVIGATION.children[i].addEventListener('click', function (event) {
          that.dispatchEvent({type: 'aufgPlanContrEvent', data: 'onMenuClicked', menu: event});
        });
    }
  }

  

  function initPlannerButtons() {
    planManagerButtons();
  }

  function init() {
    initSideNavigation();
    initPlannerButtons();
  }

  init();

  that.removePlanControls = removePlanControls;
  that.setPlannerControls = setPlannerControls;
  return that;
};