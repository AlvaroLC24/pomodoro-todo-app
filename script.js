import {
  selectedTaskIndex,
  updateCompletedPomodoros
} from "./tasks.js";

let minutes;
let seconds;
let isCounting = false;
let intervalId;
let isWorkPhase = true;
//let num = Number(10).toFixed(2);

// console.log(new Date(minutes=2, seconds=0));

const modes = {
  pomodoro: {
    minutes: 0,
    seconds: 10
  },
  shortBreak: {
    minutes: 0,
    seconds: 5
  },
  longBreak: {
    minutes: 0,
    seconds: 15
  }
}

const pomodoroButton = document.querySelector('.js-pomodoro-button');
const shortBreakButton = document.querySelector('.js-short-break-button');
const longBreakButton = document.querySelector('.js-long-break-button');
const timerElement = document.querySelector('.js-timer');
const progressBar = document.querySelector('.js-progress-bar');

let currentMode = 'pomodoro';
let timeLeft = modes[currentMode];
// console.log(timeLeft.minutes);

// minutes = timeLeft.minutes;
// seconds = timeLeft.seconds;
switchMode(currentMode);

let timer = null;
let pomodoroCount = 0;
const pomodorosBeforeLongBreak = 4;


function startCountdown() {
  if (isCounting) {
    clearInterval(intervalId);
    isCounting = false;
    return;
  }

  isCounting = true;
  intervalId = setInterval(() => {
    if (seconds === 1 && minutes == 0) {
      document.querySelector('.js-audio').play();
    }

    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(intervalId);
        console.log('¡Cuenta finalizada!');
        isCounting = false;

        handlePhaseEnd2(); // Maneja lo que pasa cuando termina la fase
        return;
      } else {
        minutes--;
        seconds = 59;
      }
    } else {
      const startTime = Date.now()
      seconds--;
    }

    updateScreen();
  }, 1000);
}


function stopCountdown() {
  clearInterval(intervalId);
  intervalId = null;
  isCounting = false;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function updateScreen() {
  document.querySelector('.js-timer')
    .innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Progress bar

  let totalSeconds = (modes[currentMode].minutes * 60) + modes[currentMode].seconds;
  let secondsToGo = (minutes * 60) + seconds;
  let secondsLeft = totalSeconds - secondsToGo;

  let secondsPercent = (secondsLeft / totalSeconds) * 100;

  // const progressBarHTML = `
  //   <div class="progress-bar" style="width: ${secondsPercent}%;"></div>
  // `;

  // document.querySelector('.js-progress-bar-container')
  //   .innerHTML = progressBarHTML;

  const progressBar = document.querySelector('.js-progress-bar');
  progressBar.style.width = `${secondsPercent}%`;

  // const timerDisplay = document.querySelector('.js-timer');
  // // const timerMessage = document.querySelector('.rest-message')
  // if (minutes === 0 && seconds === 0) {
  // //   timerMessage.innerText = '';
  //   timerDisplay.innerText = "Get some rest!";
  //   timerDisplay.classList.add('rest-message');
  // //   timerDisplay.classList.add('set-timer-invisible')
  // //   timerMessage.classList.add('rest-message-visible')
  //   //clearTimeout(timeoutId);
  //   const timeoutId = setTimeout(() => {
  //     timerDisplay.classList.remove('rest-message');
  //     // timerDisplay.classList.remove('set-timer-invisible');
  //     // timerMessage.classList.remove('rest-message-visible');
  //     minutes = 5;
  //     seconds = 0;
  //     updateScreen();
  //   }, 2000);
  // }
}

async function handlePhaseEnd2() {

  // await delay(2000); // Pausa 2 segundos antes de cambiar de fase

  const timerDisplay = document.querySelector('.js-timer');
  const message = document.querySelector('.js-timer-message');

  if (currentMode === 'pomodoro') {
    updateCompletedPomodoros(selectedTaskIndex);
    pomodoroCount++;
    if (pomodoroCount === pomodorosBeforeLongBreak) {
      pomodoroCount = 0;
      switchMode('longBreak');
      showPhaseMessage('Get a long break!', 'longBreak');
    } else {
      switchMode('shortBreak');
      showPhaseMessage('Get a short break!', 'shortBreak');
    }
    // timerDisplay.classList.add('rest-message');
    // timerDisplay.innerText = 'Get some rest!'
    // message.innerText = 'Get some rest!';
    // message.classList.remove('hidden');
    // showPhaseMessage('Get a short break!', 'shortBreak');
    // minutes = 0;
    // seconds = 5;
  } else {
    switchMode('pomodoro');
    // timerDisplay.classList.add('work-message');
    // timerDisplay.innerText = 'Back to work!'
    // message.innerText = 'Back to work!';
    // message.classList.remove('hidden');
    showPhaseMessage('Back to work!', 'pomodoro');

    // minutes = 0;
    // seconds = 10;
  }
  updateScreen();
  await delay(2000); // Pausa 2 segundos antes de cambiar de fase
  // timerDisplay.classList.remove('work-message','rest-message');
  message.classList.add('message-hidden');

  // if (currentMode === 'pomodoro') {
  //   if (pomodoroCount === 0) {
  //     switchMode('longBreak');
  //   } else {
  //     switchMode('shortBreak');
  //   }
  // } else {
  //   switchMode('pomodoro');
  // }
  // isWorkPhase = !isWorkPhase;
  clearInterval(intervalId);
  // updateScreen();
  startCountdown(); // Comienza el siguiente periodo
}


function showPhaseMessage(msg, mode) {
  const message = document.querySelector('.js-timer-message');
  message.innerText = msg;
  message.className = `js-timer-message timer-message ${mode}`;
  message.classList.remove('message-hidden');
}

function switchMode(mode) {
  currentMode = mode;
  timeLeft = modes[currentMode];
  minutes = timeLeft.minutes;
  seconds = timeLeft.seconds;

  clearInterval(intervalId);
  
  pomodoroButton.classList.remove('pomodoro-button-selected');
  shortBreakButton.classList.remove('short-break-button-selected');
  longBreakButton.classList.remove('long-break-button-selected');

  timerElement.classList
    .remove('pomodoro-color', 'short-break-color', 'long-break-color');
  progressBar.classList
    .remove('pomodoro-color-bar', 'short-break-color-bar', 'long-break-color-bar');
  

  if (mode === 'pomodoro') {
    pomodoroButton.classList.add('pomodoro-button-selected');
    timerElement.classList.add('pomodoro-color');
    progressBar.classList.add('pomodoro-color-bar');
  } else if (mode === 'shortBreak') {
    shortBreakButton.classList.add('short-break-button-selected');
    timerElement.classList.add('short-break-color');
    progressBar.classList.add('short-break-color-bar');
  } else if (mode === 'longBreak') {
    longBreakButton.classList.add('long-break-button-selected');
    timerElement.classList.add('long-break-color');
    progressBar.classList.add('long-break-color-bar');
  }
}

function resetStartPauseButton() {
  const toggleButton = document.querySelector('.js-start');
  toggleButton.innerHTML = 'Start';
  toggleButton.classList.remove('stop-button');
}

pomodoroButton.addEventListener('click', () => {
  switchMode('pomodoro')
  resetStartPauseButton();
  updateScreen();
})

shortBreakButton.addEventListener('click', () => {
  switchMode('shortBreak');
  resetStartPauseButton();
  updateScreen();
})

longBreakButton.addEventListener('click', () => {
  switchMode('longBreak');
  resetStartPauseButton();
  updateScreen();
})



async function handlePhaseEnd() {
  const timerDisplay = document.querySelector('.js-timer');

  if (isWorkPhase) {
    timerDisplay.innerText = 'Get some rest!'
    minutes = 0;
    seconds = 5;
  } else {
    timerDisplay.innerText = 'Back to work!'
    minutes = 0;
    seconds = 10;
  }

  await delay(2000); // Pausa 2 segundos antes de cambiar de fase

  isWorkPhase = !isWorkPhase;

  updateScreen();
  startCountdown(); // Comienza el siguiente periodo
}


function start() {
  const startButton = document.querySelector('.js-start');

  if (startButton.innerText === 'Start') {
    startCountdown();
    startButton.innerHTML = 'Pause';
    startButton.classList.add('stop-button')
  } else {
    stopCountdown();
    startButton.innerHTML = 'Start';
    startButton.classList.remove('stop-button');
  }
}

document.querySelector('.js-start')
  .addEventListener('click', () => {
    start();
  })


// if (document.quertSelector('.js-start').innerText === 'Start') {
//   document.querySelector('.js-start')
//     .addEventListener('click', () => {
//       startCountdown();
//     })
// }


// if (document.quertSelector('.js-start').innerText === 'Stop') {
//   document.querySelector('.js-stop')
//     .addEventListener('click', () => {
//       stopCountdown()
//     })
// }

document.querySelector('.js-reset')
  .addEventListener('click', () => {
    stopCountdown();
    timeLeft = modes[currentMode];
    minutes = timeLeft.minutes;
    seconds = timeLeft.seconds;

    resetStartPauseButton();
    updateScreen();
  })

updateScreen();