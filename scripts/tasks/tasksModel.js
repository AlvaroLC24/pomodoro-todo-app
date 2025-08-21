// const todoList = [{
//   id: crypto.randomUUID(),
//   name: 'Create Basic Pomodoro Timer',
//   estimatedPomodori: 6,
//   completedPomodori: 0,
//   done: false
// }, {
//   id: crypto.randomUUID(),
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
// or an existing one is being edited (value = task id)
export let currentEditContext = null;

// Total counter of completed pomodori, stored in localStorage
let totalCompletedPomodori = JSON.parse(localStorage.getItem('totalCompletedPomodori')) || 0;

// Id of the selected task (only one can be selected at a time)
export let selectedTaskId;

/**
 * Save the task list and the total completed pomodori to localStorage.
 */
export function saveToStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
  localStorage.setItem('totalCompletedPomodori', JSON.stringify(totalCompletedPomodori));
}


/**
 * Get the task by its id.
 * @param {string} taskId - The unique identifier of the task
 * @returns {Object|null} The matching task object if found, otherwise null
 */
export function getTask(taskId) {
  let matchingTask;
  
  todoList.forEach((task) => {
    if (task.id === taskId) {
      matchingTask = task;
    }
  });
  return matchingTask;
}


/**
 * Add a new task to the list.
 * @param {string} name 
 * @param {number} estimatedPomodori 
 */
export function addTask(name, estimatedPomodori) {
  todoList.push({
    id: crypto.randomUUID(),
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
 * @param {string} id
 * @param {string} updatedName 
 * @param {number} updatedEstimatedPomodori
 * @returns {void}
 */
export function editTask(id, updatedName, updatedEstimatedPomodori) {
  const task = getTask(id);
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
 * Remove a task.
 * @param {number} id 
 */
export function removeTask(id) {
  const confirmDelete = confirm('Are you sure you want to delete this task?');
  if (confirmDelete) {
    if (selectedTaskId === id) {
      selectedTaskId = null;
    } else if (selectedTaskId > id) {
      selectedTaskId--;
    }
    todoList.splice(id, 1);
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
 * Sets the id of the currently selected task.
 * @param {number} id 
 */
export function setSelectedTaskId(id) {
  selectedTaskId = id;
}

/**
 * Updates the number of completed pomodori for the selected task.
 * If the estimated number of pomodori is completed, sets the "done"
 * attribute of that task to true, and checks the task.
 * @param {number} selectedTaskId - Id of the selected task
 */
export function updateCompletedPomodori(selectedTaskId) {
  const taskObject = getTask(selectedTaskId);
  if (selectedTaskId !== null) {
    const selectedTask = document.querySelector(`.js-individual-task-${selectedTaskId}`);
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