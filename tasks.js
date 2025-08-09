// const todoList = [{
//   name: 'Create Basic Pomodoro Timer',
//   estimatedPomodoros: 3,
//   completedPomodoros: 0,
//   done: false
// }, {
//   name: 'Write a Short Story',
//   estimatedPomodoros: 2,
//   completedPomodoros: 0,
//   done: false
// }];

export const todoList = JSON.parse(localStorage.getItem('todoList')) || [];

let currentEditContext;

export let selectedTaskIndex;
let totalCompletedPomodoros = JSON.parse(localStorage.getItem('totalCompletedPomodoros')) || 0;

renderTodoList();

function saveToStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function addTodo() {
  clearEditingState();
  currentEditContext = 'add';

  document.querySelector('.js-add-task-container')
    .classList.add('hidden');

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
  

  document.querySelector('.js-save-button')
    .addEventListener('click', () => {
      const name = document.querySelector('.js-new-task-input').value;
      const estimatedPomodoros = document
        .querySelector('.js-num-estimated-pomodoros').value;

      todoList.push({
        name,
        estimatedPomodoros,
        completedPomodoros: 0,
        done: false
      });
      
      saveToStorage();
      renderTodoList();
      
      document.querySelector('.js-add-new-task-container')
        .innerHTML = '';
      document.querySelector('.js-add-task-container')
        .classList.remove('hidden');

      clearEditingState();
    })
  

  document.querySelector('.js-cancel-button')
    .addEventListener('click', () => {
      document.querySelector('.js-add-new-task-container')
        .innerHTML = '';
      document.querySelector('.js-add-task-container')
        .classList.remove('hidden');

      clearEditingState();
    });
}


document.querySelector('.js-add-task-container')
  .addEventListener('click', () => {
    addTodo();
})


function renderTodoList() {
  let todoListHTML = '';

  todoList.forEach((todoObject, index) => {
    const {name, estimatedPomodoros, completedPomodoros, done} = todoObject;
    // const checkClass = todoObject.done ? 'check-button-checked' : '';
    const html = `
      <div class="individual-task js-individual-task js-individual-task-${index}"
        draggable="true">
        <button class="check-button js-check-button-${index}">
          ${todoObject.done ? '✔' : ''}
        </button>
        <p class="task-text js-task-text-${index}">${name}</p>
        <p class="task-estimation
                  js-task-estimation-${index}">${completedPomodoros}/${estimatedPomodoros}</p>
        <img class="tomato-icon" src="icons/tomato-svgrepo-com.svg">
        <button class="edit-button js-edit-button"
          data-index="${index}">
          <img class="edit-icon" src="icons/pencil.svg">
        </button>
        <button class="remove-button js-remove-button">
          <img class="remove-icon" src="icons/trash-outline.svg">
        </button>
      </div>
      <div class="js-individual-task-edit-${index}"></div>
    `;
    todoListHTML += html;
  });

  document.querySelector('.js-tasks').innerHTML = todoListHTML;

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
          selectedTaskIndex = null;
        } else {
          document.querySelectorAll('.js-individual-task')
            .forEach(t => {
              t.classList.remove('task-selected');
            });
          taskElement.classList.add('task-selected');
          selectedTaskIndex = index;
        }
      });
    });

  // Remove task
  document.querySelectorAll('.js-remove-button')
    .forEach((removeButton, index) => {
      removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (selectedTaskIndex === index) {
          selectedTaskIndex = null;
        } else if (selectedTaskIndex > index) {
          selectedTaskIndex--;
        }
        todoList.splice(index, 1);
        saveToStorage();
        renderTodoList();
      });
    });
  
  
  // Edit task
  document.querySelectorAll('.js-edit-button')
    .forEach((editButton) => {
      editButton.addEventListener('click', (e) => {
        e.stopPropagation();

        clearEditingState();

        const index = editButton.dataset.index;
        const name = todoList[index].name;
        const estimatedPomodoros = todoList[index].estimatedPomodoros;
        const completedPomodoros = todoList[index].completedPomodoros;
      
        currentEditContext = parseInt(index);

        document.querySelector(`.js-individual-task-${index}`)
          .classList.add('hidden');

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
        
        document.querySelector('.js-edit-save-button')
          .addEventListener('click', () => {
            const updatedName = document
              .querySelector('.js-edit-task-input').value;
            const updatedEstimatedPomodoros = document
              .querySelector('.js-edit-num-estimated-pomodoros').value;
            

            // Alertas cuando el número estimado editaro no puede ser
            const completedPomodoros = todoList[index].completedPomodoros;

            if (updatedEstimatedPomodoros < 0) {
              alert('Estimated pomodoros cannot be negative.');
              return;
            }
            
            if (updatedEstimatedPomodoros < completedPomodoros) {
              alert(`Estimated pomodoros cannot be less than completed ones (${completedPomodoros}).`);
              return;
            }

            todoList[index].name = updatedName;
            todoList[index].estimatedPomodoros = parseInt(updatedEstimatedPomodoros);
            if (todoList[index].estimatedPomodoros > todoList[index].completedPomodoros) {
              todoList[index].done = false;
            } else {
              todoList[index].done = true;
            }
            
            saveToStorage();
            renderTodoList();
            
            document.querySelector('.js-add-new-task-container')
              .innerHTML = '';
            document.querySelector('.js-add-task-container')
              .classList.remove('hidden');
            console.log(todoList);

            clearEditingState();
          })
        

        document.querySelector('.js-edit-cancel-button')
          .addEventListener('click', () => {
            document.querySelector(`.js-individual-task-edit-${index}`)
              .innerHTML = '';
            document.querySelector(`.js-individual-task-${index}`)
              .classList.remove('hidden');

            clearEditingState();
          });
      })
    })
  
}


function clearEditingState() {
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


export function updateCompletedPomodoros(selectedTaskIndex) {
  const taskObject = todoList[selectedTaskIndex];
  if (selectedTaskIndex !== null) {
    // console.log('Selected');
    // console.log(selectedTaskIndex);
    const selectedTask = document.querySelector(`.js-individual-task-${selectedTaskIndex}`);
    if (selectedTask) {
      if (taskObject.completedPomodoros < taskObject.estimatedPomodoros) {
        taskObject.completedPomodoros++;
      }
      if (taskObject.completedPomodoros >= taskObject.estimatedPomodoros) {
        taskObject.done = true;
        // Poner el tick en el círculo de la tarea -> arriba en el html
        // const checkButton = document.querySelector(`.js-check-button-${selectedTaskIndex}`);
        // checkButton.innerHTML = '✔';
        // checkButton.classList.add('check-button-checked');
      }
    }
  }
  totalCompletedPomodoros++;
  // console.log(taskObject);
  // console.log(typeof taskObject.completedPomodoros);
  // console.log(typeof taskObject.estimatedPomodoros);
  // console.log(taskObject.completedPomodoros);
  console.log(totalCompletedPomodoros);
  saveToStorage();
  localStorage.setItem('totalCompletedPomodoros', JSON.stringify(totalCompletedPomodoros));
  renderTodoList();
}