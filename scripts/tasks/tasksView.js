import { hideMode } from './tasksMenu.js';
import {
  todoList,
  selectedTaskIndex,
  addTask,
  editTask,
  removeTask,
  clearEditingState,
  setEditingState,
  setSelectedTaskIndex} from './tasksModel.js';


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
        <span class="new-task-pomodoros">
          Estimated Pomodoros:
        </span>
        <input class="num-estimated-pomodoros
                js-num-estimated-pomodoros" type="number"
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
      const estimatedPomodoros = document
        .querySelector('.js-num-estimated-pomodoros').value;

      addTask(name, estimatedPomodoros);
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

  todoList.forEach((todoObject, index) => {
    const {name, estimatedPomodoros, completedPomodoros, done} = todoObject;

    if (hideMode === 'all') return;
    if (hideMode === 'completed' && done) return;
    if (hideMode === 'incompleted' && !done) return;

    // ----------------------------
    // Generates the HTML for each task
    // ----------------------------
    const html = `
      <div class="individual-task js-individual-task js-individual-task-${index}
                  ${done ? 'completed' : ''}"
        draggable="true">
        <button class="check-button js-check-button-${index}">
          ${done ? '✔' : ''}
        </button>
        <p class="task-text js-task-text-${index}">${name}</p>
        <p class="task-estimation
                  js-task-estimation-${index}">${completedPomodoros}/${estimatedPomodoros}</p>
        <img class="tomato-icon" src="assets/icons/tomato-svgrepo-com.svg">
        <button class="edit-button js-edit-button"
          data-index="${index}">
          <img class="edit-icon" src="assets/icons/pencil.svg">
        </button>
        <button class="remove-button js-remove-button">
          <img class="remove-icon" src="assets/icons/trash-outline.svg">
        </button>
      </div>
      <div class="js-individual-task-edit-${index}"></div>
    `;

    todoListHTML += html;
  });

  document.querySelector('.js-tasks').innerHTML = todoListHTML;

  // ----------------------------
  // Task selection management
  // ----------------------------
  /*
  This part of the code using the selectedTaskIndex variable
  allows the user to select only one task at a time.
  Clicking on the selected task again deselects it.
  */
  if (selectedTaskIndex !== null) {
    const selectedTask = document.querySelector(`.js-individual-task-${selectedTaskIndex}`);
    if (selectedTask) {
      selectedTask.classList.add('task-selected');
    }
  }
  document.querySelectorAll('.js-individual-task')
    .forEach((taskElement, index) => {
      taskElement.addEventListener('click', () => {
        if (selectedTaskIndex === index) {
          taskElement.classList.remove('task-selected');
          setSelectedTaskIndex(null);
        } else {
          document.querySelectorAll('.js-individual-task')
            .forEach(task => {
              task.classList.remove('task-selected');
            });
          taskElement.classList.add('task-selected');
          setSelectedTaskIndex(index);
        }
      });
    });

  // ----------------------------
  // Remove task
  // ----------------------------
  document.querySelectorAll('.js-remove-button')
    .forEach((removeButton, index) => {
      removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        
        removeTask(index);

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

        const index = editButton.dataset.index;
        openEditPopup(index);
      })
    })
}


/**
 * Opens the popup to edit a task.
 * Generates the HTML. If the "Save" button is clicked,
 * the task changes are saved. If the "Cancel" button is clicked,
 * the changes are discarded.
 * @param {number} index 
 */
function openEditPopup(index) {
  const name = todoList[index].name;
  const estimatedPomodoros = todoList[index].estimatedPomodoros;
  const completedPomodoros = todoList[index].completedPomodoros;

  setEditingState(parseInt(index));

  document.querySelector(`.js-individual-task-${index}`)
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
        <span class="new-task-pomodoros">
          Estimated Pomodoros:
        </span>
        <input class="num-estimated-pomodoros
                js-edit-num-estimated-pomodoros" type="number"
          min="${completedPomodoros}" value=${estimatedPomodoros} step="1">
      </div>
      <div class="add-task-buttons">
        <button class="save-button js-edit-save-button">Save</button>
        <button class="cancel-button js-edit-cancel-button">Cancel</button>
      </div>
    </div>
  `;

  document.querySelector(`.js-individual-task-edit-${index}`)
    .innerHTML = html;
  
  // ----------------------------
  // Save task changes
  // ----------------------------
  document.querySelector('.js-edit-save-button')
    .addEventListener('click', () => {
      const updatedName = document
        .querySelector('.js-edit-task-input').value;
      const updatedEstimatedPomodoros = document
        .querySelector('.js-edit-num-estimated-pomodoros').value;
      

      editTask(index, updatedName, updatedEstimatedPomodoros);

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
      document.querySelector(`.js-individual-task-edit-${index}`)
        .innerHTML = '';
      document.querySelector(`.js-individual-task-${index}`)
        .classList.remove('hidden');

      clearEditingState();
    });
}


/*
Tengo que manejar que los colores cambien a gris como diciendo
que no se puede clicar. Por ejemplo, cuando elimino las tareas
que no se pueda clicar en hide/show completed tasks (de color gris)
hasta que no añada una tarea nueva.
*/
/*
I need to handle changing the colors to gray to indicate
that they cannot be clicked. For example, when tasks are deleted,
the hide/show completed tasks buttons (gray color) should not
be clickable until a new task is added.
*/