import { 
  switchMode,
  toggleStartPause,
  resetTimer } from './timerLogic.js';


const pomodoroButton = document.querySelector('.js-pomodoro-button');
const shortBreakButton = document.querySelector('.js-short-break-button');
const longBreakButton = document.querySelector('.js-long-break-button');

const startButton = document.querySelector('.js-start');
const resetButton = document.querySelector('.js-reset');

/*
Changes the mode when clicking one of the modes buttons
(pomodoro, short break, long break)
*/
pomodoroButton.addEventListener('click', () => {
  switchMode('pomodoro');
})

shortBreakButton.addEventListener('click', () => {
  switchMode('shortBreak');
})

longBreakButton.addEventListener('click', () => {
  switchMode('longBreak');
})


// Listener to start/pause the timer
startButton.addEventListener('click', () => {
  toggleStartPause();
})

// Listener to reset the timer in the current mode
resetButton.addEventListener('click', () => {
  resetTimer();
})

console.log(navigator.userAgent);