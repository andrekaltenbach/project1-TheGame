class Player {
  constructor() {
    this.width = 20;
    this.height = 20;
    this.positionX = 240;
    this.positionY = 240;
    this.intervalId = null;
    this.updateUi();
  }

  updateUi() {
    const playerElement = document.getElementById('player');
    playerElement.style.width = this.width + 'px';
    playerElement.style.height = this.height + 'px';
    playerElement.style.left = this.positionX + 'px';
    playerElement.style.bottom = this.positionY + 'px';
  }

  movePlayer(direction) {
    this.intervalId = setInterval(() => {
      if (direction === 'right') {
        this.positionX += 2;
      } else if (direction === 'left') {
        this.positionX -= 2;
      } else if (direction === 'up') {
        this.positionY += 2;
      } else if (direction === 'down') {
        this.positionY -= 2;
      }
      this.updateUi();
    }, 8);
  }
}

class Items {
  constructor(itemType) {
    this.width = 20;
    this.height = 20;
    this.positionX = Math.floor(Math.random() * 480 + 1);
    this.positionY = Math.floor(Math.random() * 480 + 1);
    this.itemElement = null;
    this.itemType = itemType;
    this.createItem(this.itemType);
    this.updateUi();
  }

  createItem() {
    this.itemElement = document.createElement('div');
    this.itemElement.className = this.itemType;
    const pitch = document.getElementById('pitch');
    pitch.appendChild(this.itemElement);
  }

  removeItem() {
    this.itemElement.remove();
  }

  updateUi() {
    this.itemElement.style.width = this.width + 'px';
    this.itemElement.style.height = this.height + 'px';
    this.itemElement.style.left = this.positionX + 'px';
    this.itemElement.style.bottom = this.positionY + 'px';
  }
}

const player = new Player();

// load highscore from localStorage
const highScore = document.getElementById('show-highscore');
if (localStorage.getItem('highscore')) {
  highScore.innerText = localStorage.getItem('highscore');
}

// Play game music only after user interaction
const gameMusic = document.querySelector('audio');
gameMusic.loop = true;
const handleFirstInteraction = () => {
  gameMusic.play().catch((error) => {
    console.error('Audio play failed:', error);
  });
  document.removeEventListener('click', handleFirstInteraction);
  document.removeEventListener('keydown', handleFirstInteraction);
};
document.addEventListener('click', handleFirstInteraction);
document.addEventListener('keydown', handleFirstInteraction);

// avoid player run out of pitch
setInterval(() => {
  const pitchElement = document.getElementById('pitch');
  if (player.positionX + player.width > pitchElement.offsetWidth) {
    player.positionX = 0;
  } else if (player.positionX < 0) {
    player.positionX = pitchElement.offsetWidth - 1;
  } else if (player.positionY + player.height > pitchElement.offsetHeight) {
    player.positionY = 0;
  } else if (player.positionY < 0) {
    player.positionY = pitchElement.offsetHeight - 1;
  }
}, 100);

// generate good items every 2s
const goodItemsArr = [];
let goodItemsArrMax = 3;
const createGoodIntervalId = setInterval(() => {
  createNewItem('goodItem', goodItemsArr, goodItemsArrMax, (attempt = 0), (maxAttempts = 10));
}, 2000);

// good items: collision detection + remove item
let gameScore = 0;
const goodCollisionIntervallId = setInterval(() => {
  goodItemsArr.forEach((goodItem, i) => {
    if (collisionDetection(player, goodItem)) {
      gameScore += 10000;
      goodItem.removeItem();
      goodItemsArr.splice(i, 1);
      const audio = new Audio('./sounds/collectGold.mp3');
      audio.play();
      const displayScore = document.getElementById('show-score');
      displayScore.innerText = gameScore;
    }
  });
}, 10);

// generate bad items every 2s
const badItemsArr = [];
let badItemsArrMax = 5;
let level = 0;
const levelSetIntervallId = setInterval(() => {
  badItemsArrMax++;
  level++;
  const setLevel = document.getElementById('level');
  setLevel.innerText = 'Level ' + level;
}, 90000);
const createBadIntervalId = setInterval(() => {
  createNewItem('badItem', badItemsArr, badItemsArrMax, (attempt = 0), (maxAttempts = 10));
}, 2000);

// bad items: collision detection + call gameover page
const badCollisionIntervallId = setInterval(() => {
  badItemsArr.forEach((badItem) => {
    if (collisionDetection(player, badItem)) {
      clearInterval(player.intervalId);
      clearInterval(createGoodIntervalId);
      clearInterval(createBadIntervalId);
      clearInterval(goodCollisionIntervallId);
      clearInterval(badCollisionIntervallId);
      clearInterval(levelSetIntervallId);
      gameMusic.pause();
      gameMusic.currentTime = 0;
      const audio = new Audio('./sounds/game-over-arcade.mp3');
      audio.play();
      const gameOverDiv = document.getElementById('gameover-div');
      gameOverDiv.style.display = 'block';
      if (gameScore > highScore.innerText) {
        highScore.innerText = gameScore;
        localStorage.setItem('highscore', gameScore);
        const newHighscoreDiv = document.getElementById('new-highscore');
        newHighscoreDiv.style.display = 'block';
        const showNewHighscore = document.querySelector('.show-new-highscore');
        showNewHighscore.innerText = gameScore;
      }
      document.addEventListener('keydown', (e) => {
        window.location.reload();
      });
    }
  });
}, 10);

// player keyboard control
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowRight') {
    clearInterval(player.intervalId);
    player.movePlayer('right');
  } else if (e.code === 'ArrowLeft') {
    clearInterval(player.intervalId);
    player.movePlayer('left');
  } else if (e.code === 'ArrowUp') {
    clearInterval(player.intervalId);
    player.movePlayer('up');
  } else if (e.code === 'ArrowDown') {
    clearInterval(player.intervalId);
    player.movePlayer('down');
  }
});

/*************/
/* functions */
/*************/

function collisionDetection(elementOne, elementTwo) {
  if (
    elementOne.positionX < elementTwo.positionX + elementTwo.width &&
    elementOne.positionX + elementOne.width > elementTwo.positionX &&
    elementOne.positionY < elementTwo.positionY + elementTwo.height &&
    elementOne.positionY + elementOne.height > elementTwo.positionY
  ) {
    return true;
  } else {
    return false;
  }
}

function avoidOverlay(element, arr) {
  return arr.some((arrElement) => {
    return collisionDetection(element, arrElement);
  });
}

function createNewItem(itemType, itemArr, maxArrLength, attempt = 0, maxAttempts = 10) {
  const newItem = new Items(itemType);

  if (avoidOverlay(newItem, goodItemsArr) || avoidOverlay(newItem, badItemsArr)) {
    newItem.removeItem();

    if (attempt < maxAttempts) {
      return createNewItem(itemType, itemArr, maxArrLength, attempt + 1, maxAttempts);
    }
  }
  itemArr.push(newItem);
  if (itemArr.length > maxArrLength) {
    itemArr[0].removeItem();
    itemArr.shift();
  }
}

function handler() {
  return function listener(e) {
    gameMusic.removeEventListener('ended', listener);
  };
}
