// Drag tasks
const tasksList = document.querySelector('.js-tasks')
const taskContainer = document.querySelectorAll('.js-individual-task')

taskContainer.forEach((task) => {
  task.addEventListener('dragstart', () => {
    // It allows the task container to be visible when dragging
    // And with opacity:0 in css to make the container blank
    setTimeout(() => {
      task.classList.add("is-dragging")
    }, 0);
  });
  task.addEventListener('dragend', () => {
    task.classList.remove("is-dragging");
  });
});



const initTasksList = (e) => {
  e.preventDefault();

  const draggingTask = tasksList.querySelector('.is-dragging');

  // Getting all tasks except the one we are dragging.
  // And making array of them with [... ]
  const siblings = [...tasksList
    .querySelectorAll('.js-individual-task:not(.is-dragging)')];
  
    // Finding the next sibling just below the cursor
  let nextSibling = siblings.find(sibling => {
    const rect = sibling.getBoundingClientRect();
    const siblingMiddle = rect.top + rect.height / 2;
    return e.clientY <= siblingMiddle;
    // return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
  });

  // Inserting the dragging task before the found sibling
  // or at the end if there is none
  tasksList.insertBefore(draggingTask, nextSibling || null);
}

tasksList.addEventListener('dragover', initTasksList);
tasksList.addEventListener('dragenter', e => e.preventDefault());



// OPCIÓN 2

// tasksList.addEventListener('dragover', (e) => {
//   e.preventDefault();

//   const bottomTask = insertAboveTask(tasksList, e.clientY);
//   const currentTask = document.querySelector('.is-dragging');

//   if (!bottomTask) {
//     tasksList.appendChild(currentTask);
//   } else {
//     tasksList.insertBefore(currentTask, bottomTask);
//   };
// });

// const insertAboveTask = (tasksList, mouseY) => {
//   const els = tasksList.querySelectorAll('.js-individual-task:not(.is-dragging)');

//   let closestTask = null;
//   let closestOffset = Number.NEGATIVE_INFINITY;

//   els.forEach((task) => {
//     const { top } = task.getBoundingClientRect();

//     const offset = mouseY - top;

//     if (offset < 0 && offset > closestOffset) {
//       closestOffset = offset;
//       closestTask = task;
//     }
//   });
// };
