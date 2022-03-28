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
  console.log('timer start');
  timeLeft = 10;
  timeText.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
  timerId = setInterval(() => {
    timeLeft--;
    timeText.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      loseGame();
    }
  }, 1000);
}

function pauseTimer() {
  console.log('timer pause');
  clearInterval(timerId);
}

function resumeTimer() {
  console.log('timer resume');
  timeText.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
  timerId = setInterval(() => {
    timeLeft--;
    timeText.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      loseGame();
    }
  }, 1000);
}

/////////////////////////////////////////////////////////////////

let isGameOn = false;
let isGameOver = false;
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
  console.log('btnStart clicked');

  if (!isGameOn) { // 게임이 정지되어 있을 때 (맨 처음)
    isGameOn = true;
    if (!haveBeenPaused)
      startGame();
    else
      resumeGame();
  } else { // 게임이 실행중일 때
    isGameOn = false;
    pauseGame();
  }
});

function startGame() {
  isGameOn = true;
  isGameOver = false;
  haveBeenPaused = false;
  btnStart.textContent = '◼';
  btnStart.style.visibility = 'visible';
  numCarrotLeft = 10;
  carrotLeft.textContent = 10;
  timeLeft = 5;
  removeCarrotAndBug();
  spreadCarrotAndBug();
  gameDisplay.addEventListener('click', handleClickBugAndCarrot);
  startTimer();
}

function resumeGame() {
  isGameOn = true;
  btnStart.textContent = '◼';
  btnStart.style.visibility = 'visible';
  gameDisplay.addEventListener('click', handleClickBugAndCarrot);
  hideModal();
  showCarrot();
  resumeTimer();
}

function pauseGame() {
  isGameOn = false;
  haveBeenPaused = true;
  btnStart.textContent = '▶';
  btnStart.style.visibility = 'hidden';
  gameDisplay.removeEventListener('click', handleClickBugAndCarrot);

  hideCarrot();
  showModal('Replay?');
  pauseTimer();
}

btnRetry.addEventListener('click', () => {
  hideModal();
  if (isGameOver) {
    startGame();
  } else if (haveBeenPaused) {
    resumeGame();
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
  isGameOver = true;
  pauseTimer();
  showModal('YOU LOSE 😭');
  gameDisplay.removeEventListener('click', handleClickBugAndCarrot);
}

function winGame() {
  isGameOver = true;
  pauseTimer();
  showModal('YOU WIN 🎉');
  gameDisplay.removeEventListener('click', handleClickBugAndCarrot);
}