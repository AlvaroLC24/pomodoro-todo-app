let minutes = 0;
let seconds = 10;
let isCounting = false;
let intervalId;
//let num = Number(10).toFixed(2);

// console.log(new Date(minutes=2, seconds=0));


function startCountdown() {
  if (!isCounting) {
    intervalId = setInterval(() => {
      if (seconds === 0) {
        seconds = 60
        minutes--;
      }
      seconds--;
      if (minutes === 0 && seconds === 1) {
        document.querySelector('.js-audio').play();
      }

      if (minutes === 0 && seconds === 0) {
        //clearInterval(intervalId);
        console.log('¡Cuenta finalizada!')
        // const timerDisplay = document.querySelector('.js-timer')
        // timerDisplay.textContent = 'Get some rest!'
        // await delay(2000);

        minutes = 5;
        seconds = 0;
      }
      updateScreen();
    }, 1000);
    isCounting = true;

  } else {
    clearInterval(intervalId);
    isCounting = false;
  }
}


function stopCountdown() {
  clearInterval(intervalId);
  intervalId = null;
  isCounting = false;
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