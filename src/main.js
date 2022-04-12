'use strict';
import Modal from './modal.js';

const gameDisplay = document.querySelector('.game-display');
const btnStart = document.querySelector('.btn-start');
const carrotLeft = document.querySelector('.carrot-left');
const gameRect = gameDisplay.getBoundingClientRect();

// sound
const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const bgSound = new Audio('./sound/bg.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const alertSound = new Audio('./sound/alert.wav');

// timer
let timeText = document.querySelector('.time-left');
let timeLeft = 10;
let timer;

function pauseTimer() {
  console.log('timer pause');
  clearInterval(timer);
}

function startTimer() {
  console.log('timer start');
  timeText.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
  timer = setInterval(() => {
    timeLeft--;
    timeText.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      loseGame();
    }
  }, 1000);
}

// game
let isGameOn = false;
let isGameOver = false;
let haveBeenPaused = false;
let numCarrotLeft = 10;

btnStart.addEventListener('click', () => {
  if (!isGameOn) { // 게임이 정지되어 있을 때 (맨 처음)
    if (!haveBeenPaused)
      initGame();
    startGame();
  } else { // 게임이 실행중일 때
    pauseGame();
  }
});

function startGame() {
  bgSound.play();

  isGameOn = true;
  btnStart.textContent = '◼';
  showBtnStart();
  gameDisplay.addEventListener('click', handleClickBugAndCarrot);
  showCarrot();
  startTimer();
}

function initGame() {
  bgSound.currentTime = 0;
  isGameOver = false;
  haveBeenPaused = false;

  numCarrotLeft = 10;
  updateCarrotText();
  timeLeft = 10;
  removeCarrotAndBug();
  spreadCarrotAndBug();
}

function pauseGame() {
  alertSound.play();
  bgSound.pause();

  isGameOn = false;
  haveBeenPaused = true;
  gameDisplay.removeEventListener('click', handleClickBugAndCarrot);

  hideBtnStart();
  modal.show('Replay?');
  hideCarrot();
  pauseTimer();
}

function hideBtnStart() {
  btnStart.style.visibility = 'hidden';
}

function showBtnStart() {
  btnStart.style.visibility = 'visible';
}

const modal = new Modal();

modal.setClickListener(() => {
  if (isGameOver) initGame();
  startGame();
});

// carrot, bug
function handleClickBugAndCarrot(e) {
  if (e.target.className === 'bug') {
    bugSound.play();
    loseGame();
  } else if (e.target.className === 'carrot') {
    e.target.remove();
    carrotSound.play();
    numCarrotLeft--;
    updateCarrotText();
    if (numCarrotLeft === 0)
      winGame();
  }  
}

function updateCarrotText() {
  carrotLeft.textContent = numCarrotLeft;
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
    carrot.style.left = `${x}px`;
    carrot.style.top = `${y}px`;
    gameDisplay.appendChild(carrot);
  }

  // spread bugs
  for (let i=0; i<10; i++) {
    let bug = document.createElement('div');
    bug.className = 'bug';
    let x = Math.random() * (gameRect.width - 50);
    let y = Math.random() * (gameRect.height/2 - 50) + gameRect.height/2;
    bug.style.left = `${x}px`;
    bug.style.top = `${y}px`;
    gameDisplay.appendChild(bug);
  }
}

function loseGame() {
  bgSound.pause();
  bugSound.play();
  isGameOver = true;
  pauseTimer();
  modal.show('YOU LOSE 😭');
  gameDisplay.removeEventListener('click', handleClickBugAndCarrot);
}

function winGame() {
  bgSound.pause();
  winSound.play();
  isGameOver = true;
  pauseTimer();
  modal.show('YOU WIN 🎉');
  gameDisplay.removeEventListener('click', handleClickBugAndCarrot);
}