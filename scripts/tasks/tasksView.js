import { hideSettings } from './tasksMenu.js';
import {
  todoList,
  selectedTaskId,
  addTask,
  editTask,
  removeTask,
  clearEditingState,
  setEditingState,
  setSelectedTaskId} from './tasksModel.js';


renderTodoList();

/**
 * Opens the popup to add a new task.
 * Generates the HTML. If the "Save" button is clicked,
 * the task is added to the list. If the "Cancel" button is clicked,
 * it is discarded.
 */
function openAddPopup() {
  clearEditingState();
  setEditingState('add');

  document.querySelector('.js-add-task-container')
    .classList.add('hidden');
  
  // ----------------------------
  // Generate the HTML for the pop-up window to add a task
  // ----------------------------
  const html = `
    <div class="pop-up-add-task">
      <div class="add-task-title">
        <input placeholder="New Task"
                class="new-task-input js-new-task-input">
      </div>
      <div class="add-task-estimated-pomodoro">
        <span class="new-task-pomodori">
          Estimated Pomodori:
        </span>
        <input class="num-estimated-pomodori
                js-num-estimated-pomodori" type="number"
          min="0" value="1" step="1">
      </div>
      <div class="add-task-buttons">
        <button class="save-button js-save-button">Save</button>
        <button class="cancel-button js-cancel-button">Cancel</button>
      </div>
    </div>
  `;

  document.querySelector('.js-add-new-task-container')
    .innerHTML = html;
  
  // ----------------------------
  // Save task when clicking "Save"
  // ----------------------------
  document.querySelector('.js-save-button')
    .addEventListener('click', () => {
      const name = document.querySelector('.js-new-task-input').value;
      const estimatedPomodori = document
        .querySelector('.js-num-estimated-pomodori').value;

      addTask(name, estimatedPomodori);
      renderTodoList();
      
      document.querySelector('.js-add-new-task-container')
        .innerHTML = '';
      document.querySelector('.js-add-task-container')
        .classList.remove('hidden');

      clearEditingState();
    })
  
  // ----------------------------
  // Cancel task creation when clicking "Cancel"
  // ----------------------------
  document.querySelector('.js-cancel-button')
    .addEventListener('click', () => {
      document.querySelector('.js-add-new-task-container')
        .innerHTML = '';
      document.querySelector('.js-add-task-container')
        .classList.remove('hidden');

      clearEditingState();
    });
}

// Listener to add task
document.querySelector('.js-add-task-container')
  .addEventListener('click', () => {
    openAddPopup();
})


/**
 * Renders the task list.
 * Generated the HTML for each task. Each task can be edited,
 * displaying the pop-up window for that specific task.
 * Tasks can also be removed.
 */
export function renderTodoList() {
  let todoListHTML = '';

  const visibleTasks = todoList.filter((todoObject) => {
    if (hideSettings.hideMode === 'all') return false;
    if (hideSettings.hideMode === 'completed' && todoObject.done) return false;
    if (hideSettings.hideMode === 'incompleted' && !todoObject.done) return false;
    return true;
  })

  visibleTasks.forEach((todoObject, index) => {
    const {id, name, estimatedPomodori, completedPomodori, done} = todoObject;

    // ----------------------------
    // Generates the HTML for each task
    // ----------------------------
    const html = `
      <div class="individual-task js-individual-task js-individual-task-${id}
                  ${done ? 'completed' : ''}"
        data-id="${id}"
        draggable="true">
        <button class="check-button js-check-button-${id}">
          ${done ? '✔' : ''}
        </button>
        <p class="task-text js-task-text-${id}">${name}</p>
        <p class="task-estimation
                  js-task-estimation-${id}">${completedPomodori}/${estimatedPomodori}</p>
        <img class="tomato-icon" src="assets/icons/tomato-svgrepo-com.svg">
        <button class="edit-button js-edit-button"
          data-id="${id}">
          <img class="edit-icon" src="assets/icons/pencil.svg">
        </button>
        <button class="remove-button js-remove-button"
          data-id="${id}">
          <img class="remove-icon" src="assets/icons/trash-outline.svg">
        </button>
      </div>
      <div class="js-individual-task-edit-${id}"></div>
    `;

    todoListHTML += html;
  });

  document.querySelector('.js-tasks').innerHTML = todoListHTML;

  // ----------------------------
  // Task selection management
  // ----------------------------
  /*
  This part of the code using the selectedTaskId variable
  allows the user to select only one task at a time.
  Clicking on the selected task again deselects it.
  */
  if (selectedTaskId !== null) {
    const selectedTask = document.querySelector(`.js-individual-task-${selectedTaskId}`);
    if (selectedTask) {
      selectedTask.classList.add('task-selected');
    }
  }
  document.querySelectorAll('.js-individual-task')
    .forEach((taskElement, index) => {
      const taskElementId = taskElement.dataset.id;
      taskElement.addEventListener('click', () => {
        if (selectedTaskId === taskElementId) {
          taskElement.classList.remove('task-selected');
          setSelectedTaskId(null);
        } else {
          document.querySelectorAll('.js-individual-task')
            .forEach(task => {
              task.classList.remove('task-selected');
            });
          taskElement.classList.add('task-selected');
          setSelectedTaskId(taskElementId);
        }
      });
    });

  // ----------------------------
  // Remove task
  // ----------------------------
  document.querySelectorAll('.js-remove-button')
    .forEach((removeButton, index) => {
      const removeButtonId = removeButton.dataset.id;
      removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        
        removeTask(removeButtonId);

        renderTodoList();
      });
    });
  
  // ----------------------------
  // Edit task
  // ----------------------------
  document.querySelectorAll('.js-edit-button')
    .forEach((editButton) => {
      editButton.addEventListener('click', (e) => {
        e.stopPropagation();

        clearEditingState();

        const id = editButton.dataset.id;
        openEditPopup(id);
      })
    })
}


/**
 * Opens the popup to edit a task.
 * Generates the HTML. If the "Save" button is clicked,
 * the task changes are saved. If the "Cancel" button is clicked,
 * the changes are discarded.
 * @param {number} id 
 */
function openEditPopup(id) {

  const task = getTask(id);

  const name = task.name;
  const estimatedPomodori = task.estimatedPomodori;
  const completedPomodori = task.completedPomodori;

  // const name = todoList[index].name;
  // const estimatedPomodori = todoList[index].estimatedPomodori;
  // const completedPomodori = todoList[index].completedPomodori;

  setEditingState(parseInt(id));

  document.querySelector(`.js-individual-task-${id}`)
    .classList.add('hidden');

  // ----------------------------
  // Generates the HTML for the edit pop-up window
  // ----------------------------
  const html = `
    <div class="pop-up-add-task">
      <div class="add-task-title">
        <input placeholder="Task"
                class="new-task-input js-edit-task-input"
                value="${name.replace(/"/g, '&quot;')}">
      </div>
      <div class="add-task-estimated-pomodoro">
        <span class="new-task-pomodori">
          Estimated Pomodori:
        </span>
        <input class="num-estimated-pomodori
                js-edit-num-estimated-pomodori" type="number"
          min="${completedPomodori}" value=${estimatedPomodori} step="1">
      </div>
      <div class="add-task-buttons">
        <button class="save-button js-edit-save-button">Save</button>
        <button class="cancel-button js-edit-cancel-button">Cancel</button>
      </div>
    </div>
  `;

  document.querySelector(`.js-individual-task-edit-${id}`)
    .innerHTML = html;
  
  // ----------------------------
  // Save task changes
  // ----------------------------
  document.querySelector('.js-edit-save-button')
    .addEventListener('click', () => {
      const updatedName = document
        .querySelector('.js-edit-task-input').value;
      const updatedEstimatedPomodori = document
        .querySelector('.js-edit-num-estimated-pomodori').value;
      

      editTask(id, updatedName, updatedEstimatedPomodori);

      renderTodoList();
      
      document.querySelector('.js-add-new-task-container')
        .innerHTML = '';
      document.querySelector('.js-add-task-container')
        .classList.remove('hidden');
      // console.log(todoList);

      clearEditingState();
    })
  
  // ----------------------------
  // Cancel task changes
  // ----------------------------
  document.querySelector('.js-edit-cancel-button')
    .addEventListener('click', () => {
      document.querySelector(`.js-individual-task-edit-${id}`)
        .innerHTML = '';
      document.querySelector(`.js-individual-task-${id}`)
        .classList.remove('hidden');

      clearEditingState();
    });
}