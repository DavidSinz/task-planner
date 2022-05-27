
function TaskChart (data) {
  'use strict';

  const STATISTIC_EL = document.getElementById('Statistiken'),
    HOME_STATISTIC_EL = document.querySelector('.home_statistic'),
    STATISTIC_ROW_EL = STATISTIC_EL.querySelector('.row'),

    CHART_ID_NAMES = ['line-chart', 'pie-chart', 'bar-chart-grouped'],

    COMPLETED_LABEL = 'Erledigte Aufgaben',
    UNFINISHED_LABEL = 'Unerledigte Aufgaben',

    CHART_SKELETON1 = '<div class="col s12 m12 l6"><div class="card-panel"><canvas id="',
    CHART_SKELETON2 = '" width="800" height="450"></canvas></div></div>',

    // if you try to logout and login again, an error occurs
    // without the div around the canvas. That is so, because
    // while logging out, the dom element canvas does not get
    // fully removed without the divs around it. While logging
    // in again the element is still there and it throws an
    // error. (I'm guessing so far!)
    HOME_CHART_SKEL = '<div><canvas id="home-pie" width="800" height="450"></canvas></div>',

    LINE_CHART_TITLE = 'Anzahl der erledigten und unerledigten Aufgaben pro Tag',
    PIE_CHART_TITLE = 'Summe aller erledigten und unerledigten Aufgaben',
    BAR_CHART_TITLE = 'Anzahl der erledigten und unerledigten Aufgaben pro Tag',

    COMPLETED_COLOR = '#455C7B',
    UNFINISHED_COLOR = '#DA727E';

  var labels = [],
    completed = [],
    unfinished = [],
    sumCompleted = 0,
    sumUnfinished = 0,
    completedCount = 0,
    unfinishedCount = 0;

  function buildChartSkeleton() {
    let rowElInnerHTML = '';
    for (var i = 0; i < CHART_ID_NAMES.length; i++) 
      rowElInnerHTML += CHART_SKELETON1 + CHART_ID_NAMES[i] + CHART_SKELETON2;
    STATISTIC_ROW_EL.innerHTML = rowElInnerHTML;
  }

  function createChartData() {
    for (var i = 0; i < data.length; i++) {
      labels.push(data[i].date);
      completedCount = 0;
      unfinishedCount = 0;
      for (var j = 0; j < data[i].maintask.length; j++) {
        if (data[i].maintask[j].completed) completedCount++;
        else unfinishedCount++;
      }
      sumCompleted += completedCount;
      sumUnfinished += unfinishedCount;
      completed.push(completedCount);
      unfinished.push(unfinishedCount);
    }
  }

  function newLineChart(element) {
    new Chart(element, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{ 
            data: completed,
            label: COMPLETED_LABEL,
            borderColor: COMPLETED_COLOR,
            fill: false
          }, { 
            data: unfinished,
            label: UNFINISHED_LABEL,
            borderColor: UNFINISHED_COLOR,
            fill: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: LINE_CHART_TITLE
        }
      }
    });
  }

  function newPieChart(element) {
    new Chart(element, {
      type: 'pie',
      data: {
        labels: [COMPLETED_LABEL, UNFINISHED_LABEL],
        datasets: [{
          backgroundColor: [COMPLETED_COLOR, UNFINISHED_COLOR],
          data: [sumCompleted, sumUnfinished]
        }]
      },
      options: {
        title: {
          display: true,
          text: PIE_CHART_TITLE
        }
      }
    });
  }

  function newBarChart(element) {
    new Chart(element, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: COMPLETED_LABEL,
            backgroundColor: COMPLETED_COLOR,
            data: completed
          }, {
            label: UNFINISHED_LABEL,
            backgroundColor: UNFINISHED_COLOR,
            data: unfinished
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: BAR_CHART_TITLE
        }
      }
    });
  }

  

  function init() {
    buildChartSkeleton();
    createChartData();
    newLineChart(document.getElementById("line-chart"));
    newPieChart(document.getElementById("pie-chart"));
    newBarChart(document.getElementById("bar-chart-grouped"));
  }

  init();

  this.removeChart = function () {
    STATISTIC_ROW_EL.innerHTML = '';
  }
}