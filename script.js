const gameDisplay = document.querySelector('.game-display');
const btnStart = document.querySelector('.btn-start');
const carrotLeft = document.querySelector('.carrot-left');
const modal = document.querySelector('.modal');
const modalMsg = modal.querySelector('p');
const btnRetry = modal.querySelector('button');
const gameRect = gameDisplay.getBoundingClientRect();

// console.log(gameRect);
// console.log(`y 위 : ${gameRect.y}`);
// console.log(`y 중간 : ${gameRect.y + gameRect.height / 2}`);
// console.log(`y 아래 : ${gameRect.y + gameRect.height}`);
// console.log(`x 왼쪽 : ${gameRect.x}`);
// console.log(`x 오른쪽 : ${gameRect.x + gameRect.width}`);

let isGameOn = false;
let haveBeenPaused = false;
let numCarrotLeft = 10;

// Timer
let timeText = document.querySelector('.time-left');
let timeLeft = 3;
let timerId;

function showModal(msg) {
  modal.style.display = 'block';
  modalMsg = msg;
}
function hideModal() {
  modal.style.display = 'none';
}

function startGame() {
  btnStart.textContent = '◼';
  numCarrotLeft = 10;
  timeLeft = 3;
  removeCarrotAndBug();
  spreadCarrotAndBug();
  gameDisplay.addEventListener('click', handleClickBugAndCarrot);
  startTimer();
}

function resumeGame() {
  btnStart.textContent = '◼';
  hideModal();
  showCarrot();
  resumeTimer();
}

function pauseGame() {
  haveBeenPaused = true;
  btnStart.textContent = '▶';

  hideCarrot();
  showModal('Replay?');
  pauseTimer();
}

btnStart.addEventListener('click', () => {
  if (!isGameOn) {
    isGameOn = true;
    startGame();
  } else {
    pauseGame();
  }
});

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
  for (let i=0; i<10; i++) {
    let bug = document.createElement('div');
    bug.className = 'bug';
    let x = Math.random() * (gameRect.width - 50);
    let y = Math.random() * (gameRect.height/2 - 50) + gameRect.height/2;
    bug.style.left = x + 'px';
    bug.style.top = y + 'px';
    gameDisplay.appendChild(bug);
  }

  for (let i=0; i<10; i++) {
    let carrot = document.createElement('div');
    carrot.className = 'carrot';
    let x = Math.random() * (gameRect.width - 50);
    let y = Math.random() * (gameRect.height/2 - 50) + gameRect.height/2;
    carrot.style.left = x + 'px';
    carrot.style.top = y + 'px';
    gameDisplay.appendChild(carrot);
  }
}

function loseGame() {
  showModal('YOU LOST');
}


// Timer
function startTimer() {
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
  btnStart.textContent = '▶';
}

function resumeTimer() {
  timerId = setInterval(() => {
    timeText.textContent = `00:${(timeLeft < 10) ? '0' : ''}${timeLeft}`;
    timeLeft--;
    if (timeLeft < 0) {
      clearInterval(timerId);
      hideModal();
      btnStart.textContent = '◼';
    }
  }, 1000);
}

