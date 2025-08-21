import { saveToStorage, todoList, getTask } from "./tasksModel.js";

// ----------------------------
// This module handles dragging and sorting tasks in the list.
// ----------------------------

const tasksList = document.querySelector('.js-tasks')

// Detects when a task starts being dragged
tasksList.addEventListener('dragstart', (e) => {
  if (e.target.classList.contains('js-individual-task')) {
    // The setTimeout allows the browser to process the event
    // and correctly add the "is-dragging" class to the tasl
    setTimeout(() => {
      e.target.classList.add("is-dragging")
    }, 0);
  }
});

// Detects when a task is dropped
tasksList.addEventListener('dragend', (e) => {
  if (e.target.classList.contains('js-individual-task')) {
    e.target.classList.remove("is-dragging")
    saveTodoListOrderToStorage();
  }
});


/**
 * Calculates and updates the position of the task being dragged
 * withing the ToDo list based on the mouse cursor.
 * @param {DragEvent} e - The drag event triggered by the browser
 * @returns {void}
 */
const initTasksList = (e) => {
  // Prevents showing the "not-allowed" cursor while dragging a task.
  e.preventDefault();

  // Selects the task that is currently being dragged.
  const draggingTask = tasksList.querySelector('.is-dragging');
  if (!draggingTask) return;

  // Gets all tasks except the one we are dragging.
  // And making array of them with [... ]
  const otherTasks = [...tasksList
    .querySelectorAll('.js-individual-task:not(.is-dragging)')];
  
  // Finds the task over which the dragging task will be placed.
  // That task is the one directly below the cursor.
  let taskBelowCursor = otherTasks.find(otherTask => {
    const rect = otherTask.getBoundingClientRect();
    const otherTaskMiddle = rect.top + rect.height / 2;
    return e.clientY <= otherTaskMiddle;
  });

  // Inserts the dragging task before the found task
  // or at the end if there is none.
  tasksList.insertBefore(draggingTask, taskBelowCursor || null);
}

// Events to allow dropping withing the list
tasksList.addEventListener('dragover', initTasksList);
tasksList.addEventListener('dragenter', e => e.preventDefault());


/**
 * Saves the new order of the tasks in localStorage. If there are
 * hidden tasks and the visible tasks are reordered, the hidden
 * tasks will appear at the end of the list when shown again.
 */
function saveTodoListOrderToStorage() {
  const newOrderIds = [...tasksList.querySelectorAll('.js-individual-task')]
    .map(taskId => taskId.dataset.id);

  // Gets the visible tasks in the list in the new order
  const orderedVisibleTasks = newOrderIds.map(id => getTask(id));

  // Gets the tasks that were hidden (if any)
  const hiddenTasks = todoList.filter(task => !newOrderIds.includes(String(task.id)));
  console.log(hiddenTasks);

  // Combines all tasks (first the visible ones, then the hidden ones)
  const newOrderedList = [...orderedVisibleTasks, ...hiddenTasks];
  console.log(newOrderedList);

  // Replaces the list saved in storage with the new one
  todoList.splice(0, todoList.length, ...newOrderedList);
  saveToStorage();
}
