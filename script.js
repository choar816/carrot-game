const gameDisplay = document.querySelector('.game-display');
const btnStart = document.querySelector('.btn-start');
const carrotLeft = document.querySelector('.carrot-left');
const modal = document.querySelector('.modal');
const modalMsg = modal.querySelector('p');
const btnRetry = modal.querySelector('button');
const gameRect = gameDisplay.getBoundingClientRect();

// Timer
let timeText = document.querySelector('.time-left');
let timeLeft = 10;
let timerId;

function startTimer() {
  timeLeft = 10;
  timerId = setInterval(() => {
    timeText.textContent = `00:${(timeLeft < 10) ? '0' : ''}${timeLeft}`;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timerId);
      loseGame();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerId);
}

function resumeTimer() {
  timerId = setInterval(() => {
    timeText.textContent = `00:${(timeLeft < 10) ? '0' : ''}${timeLeft}`;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timerId);
      loseGame();
    }
  }, 1000);
}

/////////////////////////////////////////////////////////////////

let isGameOn = false;
let haveBeenPaused = false;
let numCarrotLeft = 10;

function showModal(msg) {
  modalMsg.textContent = msg;
  modal.style.display = 'block';
}

function hideModal() {
  modal.style.display = 'none';
}

btnStart.addEventListener('click', () => {
  if (!isGameOn) {
    isGameOn = true;
    if (!haveBeenPaused)
      startGame();
    else
      resumeGame();
  } else {
    isGameOn = false;
    pauseGame();
  }
});

function startGame() {
  btnStart.textContent = '◼';
  numCarrotLeft = 10;
  carrotLeft.textContent = 10;
  timeLeft = 5;
  removeCarrotAndBug();
  spreadCarrotAndBug();
  gameDisplay.addEventListener('click', handleClickBugAndCarrot);
  startTimer();
}

function resumeGame() {
  btnStart.textContent = '◼';
  btnStart.style.visibility = 'visible';
  hideModal();
  showCarrot();
  resumeTimer();
}

function pauseGame() {
  haveBeenPaused = true;
  btnStart.textContent = '▶';
  btnStart.style.visibility = 'hidden';

  hideCarrot();
  showModal('Replay?');
  pauseTimer();
}


btnRetry.addEventListener('click', () => {
  hideModal();
  if (haveBeenPaused)
    resumeGame();
  else {
    startGame();
  }
});

function handleClickBugAndCarrot(e) {
  if (e.target.className === 'bug') {
    console.log('bug clicked');
    loseGame();
  } else if (e.target.className === 'carrot') {
    console.log('carrot clicked');
    e.target.remove();
    numCarrotLeft--;
    carrotLeft.textContent = numCarrotLeft;
    if (numCarrotLeft === 0)
      winGame();
  }  
}

function showCarrot() {
  for (let carrot of document.querySelectorAll('.carrot'))
    carrot.style.display = 'block';
}
function hideCarrot() {
  for (let carrot of document.querySelectorAll('.carrot'))
    carrot.style.display = 'none';
}

function removeCarrotAndBug() {
  for (let bug of document.querySelectorAll('.bug'))
    bug.remove();
  for (let carrot of document.querySelectorAll('.carrot'))
    carrot.remove();
}

function spreadCarrotAndBug() {
  // spread carrots
  for (let i=0; i<10; i++) {
    let carrot = document.createElement('div');
    carrot.className = 'carrot';
    let x = Math.random() * (gameRect.width - 50);
    let y = Math.random() * (gameRect.height/2 - 50) + gameRect.height/2;
    carrot.style.left = x + 'px';
    carrot.style.top = y + 'px';
    gameDisplay.appendChild(carrot);
  }

  // spread bugs
  for (let i=0; i<10; i++) {
    let bug = document.createElement('div');
    bug.className = 'bug';
    let x = Math.random() * (gameRect.width - 50);
    let y = Math.random() * (gameRect.height/2 - 50) + gameRect.height/2;
    bug.style.left = x + 'px';
    bug.style.top = y + 'px';
    gameDisplay.appendChild(bug);
  }
}

function loseGame() {
  pauseTimer();
  showModal('YOU LOST 😭');
  gameDisplay.removeEventListener('click', handleClickBugAndCarrot);
}

function winGame() {
  pauseTimer();
  showModal('YOU WIN 🎉');
  gameDisplay.removeEventListener('click', handleClickBugAndCarrot);
}