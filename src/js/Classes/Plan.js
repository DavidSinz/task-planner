
function Plan (id, start_date, length, goal, reward, note) {
  "use strict";

  const POINT = '.';

  function createNewDate() {
    let date = new Date();
    date.setFullYear(start_date.getFullYear());
    date.setMonth(start_date.getMonth());
    date.setDate(start_date.getDate());
    return date;
  }

  function createTaskData(date, index) {
    let taskData = {
      id: index,
      date: date.getDate() + POINT 
        + (date.getMonth() + 1),
      maintask: [],
      additionaltask: [],
      reward: []
    }
    return taskData;
  }

  function buildTaskList() {
    let list = [],
      date = createNewDate();
    for (let i = 0; i < length; i++) {
      list.push(createTaskData(date, i));
      date.setDate(date.getDate() + 1);
    }
    return list;
  }

  function buildDateStr() {
    let day = start_date.getDate(),
      month = start_date.getMonth() + 1,
      year = start_date.getFullYear();
    return day + POINT + month + POINT + year;
  }

  this.start_date = start_date;
  this.date_str = buildDateStr();
  this.id = id;
  this.length = length;
  this.task_list = buildTaskList();
  this.goal = goal;
  this.reward = reward;
  this.note = note;
  this.active = false;
}