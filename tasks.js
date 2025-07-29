const todoList = [{
  name: 'Create Basic Pomodoro Timer',
  estimatedPomodoros: 3
}, {
  name: 'Write a Short Story',
  estimatedPomodoros: 2
}];

renderTodoList();

function addTodo() {
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
        estimatedPomodoros
      });
      
      renderTodoList();
      
      document.querySelector('.js-add-new-task-container')
        .innerHTML = '';
      document.querySelector('.js-add-task-container')
        .classList.remove('hidden');
    })
  
    
  document.querySelector('.js-cancel-button')
    .addEventListener('click', () => {
      document.querySelector('.js-add-new-task-container')
        .innerHTML = '';
      document.querySelector('.js-add-task-container')
        .classList.remove('hidden');
    });
}


document.querySelector('.js-add-task-container')
  .addEventListener('click', () => {
    addTodo();
})


function renderTodoList() {
  let todoListHTML = '';

  todoList.forEach((todoObject, index) => {
    const {name, estimatedPomodoros} = todoObject;

    const html = `
      <div class="individual-task">
        <button class="check-button"></button>
        <p class="task-text">${name}</p>
        <p class="task-estimation">${estimatedPomodoros}</p>
        <img class="edit-icon js-edit-icon" src="icons/pencil-outline.svg">
        <img class="remove-icon js-remove-icon" src="icons/trash-outline.svg">
      </div>
    `;
    todoListHTML += html;
  });

  document.querySelector('.js-tasks').innerHTML = todoListHTML;

  // Remove task
  document.querySelectorAll('.js-remove-icon')
    .forEach((removeButton, index) => {
      removeButton.addEventListener('click', () => {
        todoList.splice(index, 1);
        renderTodoList();
      });
    });
  
}



