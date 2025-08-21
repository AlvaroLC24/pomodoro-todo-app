import { renderTodoList } from "./tasksView.js";
import { saveToStorage } from "./tasksModel.js";

// Initialization of hide settings for the task list menu

const DEFAULT_HIDE_SETTINGS = {
  isHidingCompletedTasks: false,
  isHidingAllTasks: false,
  hideMode: 'none' // values: none, all, completed, incompleted
};

export let hideSettings = {
  ...DEFAULT_HIDE_SETTINGS,
  ...(JSON.parse(localStorage.getItem('hideSettings')) || {})
};

/**
 * Save the hide settings to localStorage.
 */
function saveHideSettingsToStorage() {
  localStorage.setItem('hideSettings', JSON.stringify(hideSettings));
}


const menu = document.querySelector('.js-hamburguer-menu-extend');

/**
 * Generates the HTML for the dropwdown menu for tasks.
 */
function expandHamburguerMenu() {
  const menuHTML = `
    <div class="menu-item">
      <img class="menu-icon"
        src=${hideSettings.isHidingCompletedTasks 
          ? "../assets/icons/eye-show-svgrepo-com.svg" 
          : "../assets/icons/hide-svgrepo-com.svg"}
        >
      <p class="menu-text">
        ${hideSettings.isHidingCompletedTasks ? 'Show' : 'Hide'} completed tasks
      </p>
    </div>

    <div class="menu-item">
      <img class="menu-icon"
        src=${hideSettings.isHidingAllTasks
          ? "../assets/icons/eye-show-svgrepo-com.svg" 
          : "../assets/icons/hide-svgrepo-com.svg"}
        >
      <p class="menu-text">
        ${hideSettings.isHidingAllTasks ? 'Show' : 'Hide'} all tasks
      </p>
    </div>

    <div class="menu-item">
      <img class="menu-icon" src="../assets/icons/trash-outline.svg">
      <p class="menu-text">Clear completed tasks</p>
    </div>
    <div class="menu-item">
      <img class="menu-icon" src="../assets/icons/trash-outline.svg">
      <p class="menu-text">Clear all tasks</p>
    </div>
  `
  menu.innerHTML = menuHTML;
}


// When the menu button is clicked, the dropdown opens.
document.querySelector('.js-hamburguer-menu-button')
  .addEventListener('click', (e) => {
    e.stopPropagation();
    expandHamburguerMenu();
    menu.classList.toggle('open');
  });

// When the menu is open and any part of the page is clicked,
// the menu closes.
document.addEventListener('click', () => {
    if (menu.classList.contains('open')) {
      menu.classList.remove('open');
    }
  })


/**
 * Handles the four options of the menu:
 * Hide/Show completed tasks
 * Hide/Show all tasks
 * Clear completed tasks
 * Clear all tasks
 */
function manageMenuTasks() {
  menu.addEventListener('click', (e) => {
    const clickedItem = e.target.closest('.menu-item');
    if (!clickedItem) return;

    const action = clickedItem.querySelector('.menu-text').textContent.trim();
    console.log('Clicked on menu item:', action);

    switch(action) {
      case `${hideSettings.isHidingCompletedTasks ? 'Show' : 'Hide'} completed tasks`:
        hideSettings.isHidingCompletedTasks = !hideSettings.isHidingCompletedTasks;
        if (hideSettings.isHidingCompletedTasks) {
          if (hideSettings.isHidingAllTasks) {
            hideSettings.hideMode = 'all';
          } else {
            hideSettings.hideMode = 'completed';
          }
        } else {
            if (!hideSettings.isHidingAllTasks) {
              hideSettings.hideMode = 'none'
            } else {
              hideSettings.hideMode = 'incompleted';
            }
        }
        saveHideSettingsToStorage();
        renderTodoList();
        break;

      case `${hideSettings.isHidingAllTasks ? 'Show' : 'Hide'} all tasks`:
        hideSettings.isHidingAllTasks = !hideSettings.isHidingAllTasks;
        if (hideSettings.isHidingAllTasks) {
          if (hideSettings.isHidingCompletedTasks) {
            hideSettings.hideMode = 'all';
          } else {
            hideSettings.hideMode = 'all'
            hideSettings.isHidingCompletedTasks = true;
          }
        } else {
          hideSettings.hideMode = 'none';
          hideSettings.isHidingCompletedTasks = false;
        }
        saveHideSettingsToStorage();
        renderTodoList();
        break;
        
      case 'Clear completed tasks':
        for (let i = todoList.length - 1; i >= 0; i--) {
          if (todoList[i].done) {
            todoList.splice(i, 1);
          }
        }
        saveToStorage();
        renderTodoList();
        break;
      
      case 'Clear all tasks':
        todoList.length = 0;
        saveToStorage();
        renderTodoList();
        break;
    }
  })
}

manageMenuTasks();
renderTodoList();