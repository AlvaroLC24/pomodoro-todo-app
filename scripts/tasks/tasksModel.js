// const todoList = [{
//   name: 'Create Basic Pomodoro Timer',
//   estimatedPomodoros: 6,
//   completedPomodoros: 0,
//   done: false
// }, {
//   name: 'Write a Short Story',
//   estimatedPomodoros: 4,
//   completedPomodoros: 0,
//   done: false
// }];

// ----------------------------
// Initialization of the ToDo list
// ----------------------------

// The ToDo list is loaded from localStorage or empty if there is no previous data
export let todoList = JSON.parse(localStorage.getItem('todoList')) || [];

// Indicates if a new task is being added (value = 'add')
// or an existing one is being edited (value = task index)
export let currentEditContext = null;

// Total counter of completed pomodoros, stored in localStorage
let totalCompletedPomodoros = JSON.parse(localStorage.getItem('totalCompletedPomodoros')) || 0;

// Index of the selected task (only one can be selected at a time)
export let selectedTaskIndex;

/**
 * Save the task list and the total completed pomodoros to localStorage
 */
export function saveToStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
  localStorage.setItem('totalCompletedPomodoros', JSON.stringify(totalCompletedPomodoros));

}


/**
 * Add a new task to the list
 * @param {string} name 
 * @param {number} estimatedPomodoros 
 */
export function addTask(name, estimatedPomodoros) {
  todoList.push({
    name,
    estimatedPomodoros: parseInt(estimatedPomodoros),
    completedPomodoros: 0,
    done: false
  });
  saveToStorage();
}


/**
 * Edit an existing task.
 * Create alerts if the estimated number of pomodoros
 * is negative or less than completed pomodoros.
 * @param {number} index
 * @param {string} updatedName 
 * @param {number} updatedEstimatedPomodoros 
 * @returns 
 */
export function editTask(index, updatedName, updatedEstimatedPomodoros) {
  const task = todoList[index]
  const completedPomodoros = task.completedPomodoros;
  if (updatedEstimatedPomodoros < 0) {
    alert('Estimated pomodoros cannot be negative.');
    return;
  }
  if (updatedEstimatedPomodoros < completedPomodoros) {
    alert(`Estimated pomodoros cannot be less than completed ones (${completedPomodoros}).`);
    return;
  }

  task.name = updatedName;
  task.estimatedPomodoros = parseInt(updatedEstimatedPomodoros);
  if (task.estimatedPomodoros > task.completedPomodoros) {
    task.done = false;
  } else {
    task.done = true;
  }
  saveToStorage();
}


/**
 * Remove a task
 * @param {number} index 
 */
export function removeTask(index) {
  if (selectedTaskIndex === index) {
    selectedTaskIndex = null;
  } else if (selectedTaskIndex > index) {
    selectedTaskIndex--;
  }
  todoList.splice(index, 1);
  saveToStorage();
}


/**
 * Clears the editing state of a new or existing task.
 */
export function clearEditingState() {
  if(currentEditContext === 'add') {
    document.querySelector('.js-add-new-task-container')
      .innerHTML = '';
    document.querySelector('.js-add-task-container')
      .classList.remove('hidden');
    
  } else if (typeof currentEditContext === 'number') {
    document.querySelector(`.js-individual-task-edit-${currentEditContext}`)
      .innerHTML = '';
    document.querySelector(`.js-individual-task-${currentEditContext}`)
      .classList.remove('hidden');
  }
  currentEditContext = null;
}

/**
 * Sets the new value depending on whether a new task
 * is being added or an existing one is being edited.
 * @param {string|number} newEditContext - new value to currentEditContext
 */
export function setEditingState(newEditContext) {
  currentEditContext = newEditContext;
}

/**
 * Sets the index of the currently selected task.
 * @param {number} index 
 */
export function setSelectedTaskIndex(index) {
  selectedTaskIndex = index;
}

/**
 * Updates the number of completed pomodoros for the selected task.
 * If the estimated number of pomodoros is completed, sets the "done"
 * attribute of that task to true, and checks the task.
 * @param {number} selectedTaskIndex - Index of the selected task
 */
export function updateCompletedPomodoros(selectedTaskIndex) {
  const taskObject = todoList[selectedTaskIndex];
  if (selectedTaskIndex !== null) {
    const selectedTask = document.querySelector(`.js-individual-task-${selectedTaskIndex}`);
    if (selectedTask) {
      if (taskObject.completedPomodoros < taskObject.estimatedPomodoros) {
        taskObject.completedPomodoros++;
      }
      if (taskObject.completedPomodoros >= taskObject.estimatedPomodoros) {
        taskObject.done = true;
      }
    }
  }
  totalCompletedPomodoros++;
  console.log(totalCompletedPomodoros);
  
  saveToStorage();}