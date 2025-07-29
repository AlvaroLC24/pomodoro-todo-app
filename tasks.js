const todoList = [{
  name: 'Create Basic Pomodoro Timer',
  estimatedPomodoros: 3
}, {
  name: 'Write a Short Story',
  estimatedPomodoros: 2
}];

let currentEditContext;

renderTodoList();


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
        estimatedPomodoros
      });
      
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
    const {name, estimatedPomodoros} = todoObject;

    const html = `
      <div class="individual-task js-individual-task-${index}">
        <button class="check-button"></button>
        <p class="task-text js-task-text-${index}">${name}</p>
        <p class="task-estimation
                  js-task-estimation-${index}">${estimatedPomodoros}</p>
        <img class="edit-icon js-edit-icon" src="icons/pencil-outline.svg"
             data-index="${index}">
        <img class="remove-icon js-remove-icon" src="icons/trash-outline.svg">
      </div>
      <div class="js-individual-task-edit-${index}"></div>
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
  
  
  // Edit task
  document.querySelectorAll('.js-edit-icon')
    .forEach((editButton) => {
      editButton.addEventListener('click', () => {

        clearEditingState();

        const index = editButton.dataset.index;
        const name = todoList[index].name;
        const estimatedPomodoros = todoList[index].estimatedPomodoros;
      
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
                min="0" value=${estimatedPomodoros} step="1">
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

            todoList[index].name = updatedName;
            todoList[index].estimatedPomodoros = parseInt(updatedEstimatedPomodoros);
            
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


