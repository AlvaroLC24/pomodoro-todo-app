// const todoList = [{
//   name: 'Create Basic Pomodoro Timer',
//   estimatedPomodori: 6,
//   completedPomodori: 0,
//   done: false
// }, {
//   name: 'Write a Short Story',
//   estimatedPomodori: 4,
//   completedPomodori: 0,
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

// Total counter of completed pomodori, stored in localStorage
let totalCompletedPomodori = JSON.parse(localStorage.getItem('totalCompletedPomodori')) || 0;

// Index of the selected task (only one can be selected at a time)
export let selectedTaskIndex;

/**
 * Save the task list and the total completed pomodori to localStorage
 */
export function saveToStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
  localStorage.setItem('totalCompletedPomodori', JSON.stringify(totalCompletedPomodori));

}


/**
 * Add a new task to the list
 * @param {string} name 
 * @param {number} estimatedPomodori 
 */
export function addTask(name, estimatedPomodori) {
  todoList.push({
    name,
    estimatedPomodori: parseInt(estimatedPomodori),
    completedPomodori: 0,
    done: false
  });
  saveToStorage();
}


/**
 * Edit an existing task.
 * Create alerts if the estimated number of pomodori
 * is negative or less than completed pomodori.
 * @param {number} index
 * @param {string} updatedName 
 * @param {number} updatedEstimatedPomodori
 * @returns 
 */
export function editTask(index, updatedName, updatedEstimatedPomodori) {
  const task = todoList[index]
  const completedPomodori = task.completedPomodori;
  if (updatedEstimatedPomodori < 0) {
    alert('Estimated pomodori cannot be negative.');
    return;
  }
  if (updatedEstimatedPomodori < completedPomodori) {
    alert(`Estimated pomodori cannot be less than completed ones (${completedPomodori}).`);
    return;
  }

  task.name = updatedName;
  task.estimatedPomodori = parseInt(updatedEstimatedPomodori);
  if (task.estimatedPomodori > task.completedPomodori) {
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
  const confirmDelete = confirm('Are you sure you want to delete this task?');
  if (confirmDelete) {
    if (selectedTaskIndex === index) {
      selectedTaskIndex = null;
    } else if (selectedTaskIndex > index) {
      selectedTaskIndex--;
    }
    todoList.splice(index, 1);
    saveToStorage();
  }
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
 * Updates the number of completed pomodori for the selected task.
 * If the estimated number of pomodori is completed, sets the "done"
 * attribute of that task to true, and checks the task.
 * @param {number} selectedTaskIndex - Index of the selected task
 */
export function updateCompletedPomodori(selectedTaskIndex) {
  const taskObject = todoList[selectedTaskIndex];
  if (selectedTaskIndex !== null) {
    const selectedTask = document.querySelector(`.js-individual-task-${selectedTaskIndex}`);
    if (selectedTask) {
      if (taskObject.completedPomodori < taskObject.estimatedPomodori) {
        taskObject.completedPomodori++;
      }
      if (taskObject.completedPomodori >= taskObject.estimatedPomodori) {
        taskObject.done = true;
      }
    }
  }
  totalCompletedPomodori++;
  console.log(totalCompletedPomodori);
  
  saveToStorage();}