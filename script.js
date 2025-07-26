let minutes = 0;
let seconds = 10;
let isCounting = false;
let intervalId;
let isWorkPhase = true;
//let num = Number(10).toFixed(2);

// console.log(new Date(minutes=2, seconds=0));


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

        handlePhaseEnd(); // Maneja lo que pasa cuando termina la fase
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
const toggleButton = document.querySelector('.js-start');

document.querySelector('.js-reset')
  .addEventListener('click', () => {
    stopCountdown();
    minutes = 0;
    seconds = 10;
    if (document.querySelector('.js-start').innerText === 'Pause') {
      toggleButton.innerHTML = 'Start';
      toggleButton.classList.remove('stop-button');
    }
    updateScreen();
  })

updateScreen();