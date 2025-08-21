import {
  selectedTaskId,
  updateCompletedPomodori
} from "../tasks/tasksModel.js";

import { renderTodoList } from "../tasks/tasksView.js";

// Configuration of modes/phases
const modes = {
  pomodoro: {
    minutes: 25,
    seconds: 0
  },
  shortBreak: {
    minutes: 5,
    seconds: 0
  },
  longBreak: {
    minutes: 15,
    seconds: 0
  }
}

const pomodoriBeforeLongBreak = 4;

let minutes;
let seconds;
let isCounting = false;
let intervalId;

let currentMode = 'pomodoro';
let timeLeft = modes[currentMode];
let pomodoroCount = 0;

let delayTimeoutId;


// Using the DOM to select HTML elements
const pomodoroButton = document.querySelector('.js-pomodoro-button');
const shortBreakButton = document.querySelector('.js-short-break-button');
const longBreakButton = document.querySelector('.js-long-break-button');
const timerDisplay = document.querySelector('.js-timer');
const progressBar = document.querySelector('.js-progress-bar');
const timerMessage = document.querySelector('.js-timer-message');
const startButton = document.querySelector('.js-start');
const audio = document.querySelector('.js-audio');


applyModeSettings(currentMode);

/**
 * Starts de timer if it is stopped, and updates the screen every second.
 * Stops it if it is running.
 * @returns {void}
 */
function startCountdown() {
  if (isCounting) {
    clearInterval(intervalId);
    isCounting = false;
    return;
  }

  isCounting = true;
  intervalId = setInterval(() => {
    if (seconds === 1 && minutes == 0) {
      audio.play();
    }

    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(intervalId);
        console.log(`${currentMode} completed!`);
        isCounting = false;

        handlePhaseEnd(); // It handles what happens when the phase ends
        return;
      } else {
        minutes--;
        seconds = 59;
      }
    } else {
      seconds--;
    }

    updateScreen();
  }, 1000);
}


/**
 * Stops the timer.
 */
export function stopCountdown() {
  clearInterval(intervalId);
  intervalId = null;
  isCounting = false;

  if (delayTimeoutId) {
    cancelDelay();
  }
}

/**
 * Creates an asynchronous pause of a specified duration.
 * @param {number} ms - Waiting time in miliseconds
 * @returns {Promise<void>} Promise that resolves once the time has passed
 */
function delay(ms) {
  return new Promise((resolve) => {
    delayTimeoutId = setTimeout(resolve, ms);
  });
}

/**
 * Cancel the pause started by delay() and hides the timer message.
 * Used when pausing during the two-seconds wait between timer phases.
 */
function cancelDelay() {
  clearTimeout(delayTimeoutId);
  timerMessage.classList.add('message-hidden');
}

/**
 * Updates the screen, specifically the time display and progress bar.
 */
export function updateScreen() {
  // Time Display
  timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Progress Bar
  let totalSeconds = (modes[currentMode].minutes * 60) + modes[currentMode].seconds;
  let secondsLeft = (minutes * 60) + seconds;
  let secondsPassed = totalSeconds - secondsLeft;
  let secondsPercent = (secondsPassed / totalSeconds) * 100;

  progressBar.style.width = `${secondsPercent}%`;
}

/**
 * Handles the end of a timer phase. Changes the phase,
 * shows a message for two seconds if not cancelled,
 * and increases the number of completed pomodori when necessary.
 */
async function handlePhaseEnd() {
  if (currentMode === 'pomodoro') {
    updateCompletedPomodori(selectedTaskId);
    renderTodoList();
    pomodoroCount++;
    if (pomodoroCount === pomodoriBeforeLongBreak) {
      pomodoroCount = 0;
      applyModeSettings('longBreak');
      showPhaseMessage('Get a long break!', 'longBreak');
    } else {
      applyModeSettings('shortBreak');
      showPhaseMessage('Get a short break!', 'shortBreak');
    }

  } else {
    applyModeSettings('pomodoro');
    showPhaseMessage('Back to work!', 'pomodoro');
  }

  updateScreen();

  // Handles the two-second wait between phases
  try {
    await delay(2000);
    timerMessage.classList.add('message-hidden');
    clearInterval(intervalId);
    startCountdown();
  } catch (err) {
    console.log("Two seconds wait between phases canceled. Continue when you feel ready!")
  }
}


/**
 * Displays a message indicating the start of a new phase
 * (pomodoro, short break, long break) with corresponding styles.
 * @param {string} message - Message to display on the timer
 * @param {string} mode - Next phase
 */
function showPhaseMessage(message, mode) {
  timerMessage.innerText = message;
  timerMessage.className = `js-timer-message timer-message ${mode}`;
  timerMessage.classList.remove('message-hidden');
}

/**
 * Adds styles corresponding the the timer phase that is about to start.
 * @param {string} mode - Next phase
 */
export function applyModeSettings(mode) {
  currentMode = mode;
  timeLeft = modes[currentMode];
  minutes = timeLeft.minutes;
  seconds = timeLeft.seconds;

  clearInterval(intervalId);
  
  pomodoroButton.classList.remove('pomodoro-button-selected');
  shortBreakButton.classList.remove('short-break-button-selected');
  longBreakButton.classList.remove('long-break-button-selected');

  timerDisplay.classList
    .remove('pomodoro-color', 'short-break-color', 'long-break-color');
  progressBar.classList
    .remove('pomodoro-color-bar', 'short-break-color-bar', 'long-break-color-bar');
  

  if (mode === 'pomodoro') {
    pomodoroButton.classList.add('pomodoro-button-selected');
    timerDisplay.classList.add('pomodoro-color');
    progressBar.classList.add('pomodoro-color-bar');
  } else if (mode === 'shortBreak') {
    shortBreakButton.classList.add('short-break-button-selected');
    timerDisplay.classList.add('short-break-color');
    progressBar.classList.add('short-break-color-bar');
  } else if (mode === 'longBreak') {
    longBreakButton.classList.add('long-break-button-selected');
    timerDisplay.classList.add('long-break-color');
    progressBar.classList.add('long-break-color-bar');
  }
}


/**
 * Resets the Start/Pause button to its initial "Start" state.
 */
export function resetStartPauseButton() {
  const toggleButton = document.querySelector('.js-start');
  toggleButton.innerHTML = 'Start';
  toggleButton.classList.remove('stop-button');
}

/**
 * Changes the current mode to the specified one:
 * Changes the styles
 * Stops de countdown
 * Resets the Start/Pause button
 * Updates the screen
 * @param {string} mode 
 */
export function switchMode(mode) {
  applyModeSettings(mode);
  stopCountdown();
  resetStartPauseButton();
  updateScreen();
}

/**
 * Toggles the timer between started and paused states.
 */
export function toggleStartPause() {
  if (startButton.innerText === 'Start') {
    startCountdown();
    startButton.innerHTML = 'Pause';
    startButton.classList.add('stop-button')
    timerMessage.classList.add('message-hidden');
  } else {
    stopCountdown();
    startButton.innerHTML = 'Start';
    startButton.classList.remove('stop-button');
  }
}

/**
 * Resets the timer of the current mode.
 * The Pause button is set back to Start.
 */
export function resetTimer() {
  applyModeSettings(currentMode);
  stopCountdown();
  resetStartPauseButton();
  updateScreen();
}

updateScreen();