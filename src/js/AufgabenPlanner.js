
var AufgabenPlanner = AufgabenPlanner || (function () {

  var that = new MMEventTarget(),
      planModel,
      planView,
      planContr;

  function onPlanDataChanged(event) {
    //localStorage.setItem('AufgPlanner-plan_list', JSON.stringify(event.planList));
    localStorage.setItem('AufgPlanner-plan_list', JSON.stringify(event.planList));
    planView.setAufgPlannerView(event.planList, event.taskList, event.taskTableData);
    planContr.setPlannerControls();
  }

  function onLogin() {
    //console.log(localStorage.getItem('AufgPlanner-plan_list'));
    //console.log(JSON.parse(localStorage.getItem('AufgPlanner-plan_list--copy')));
    planModel.setAufgPlannerData(JSON.parse(localStorage.getItem('AufgPlanner-plan_list')));
  }

  function onLogout() {
    planContr.removePlanControls();
    planView.setPlanViewDefault();
  }

  function initEventListeners() {
    planModel.addEventListener('onModelDataChanged', onPlanDataChanged);
    planModel.addEventListener('onScreenViewChange', planView.handleModelChanges);
    planContr.addEventListener('aufgPlanContrEvent', planModel.handlePlannerContr);
  }

  function init() {
    planModel = new AufgabenPlanner.PlannerModel();
    planView = new AufgabenPlanner.PlannerView();
    planContr = new AufgabenPlanner.PlannerController();
    initEventListeners();

    onLogin();
  }

  that.init = init;
  return that;
}());