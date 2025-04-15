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
        this.positionX += 1;
      } else if (direction === 'left') {
        this.positionX -= 1;
      } else if (direction === 'up') {
        this.positionY += 1;
      } else if (direction === 'down') {
        this.positionY -= 1;
      }
      this.updateUi();
    }, 1);
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
setInterval(() => {
  while (true) {
    const goodItem = new Items('goodItem');
    if (
      avoidOverlay(goodItem, goodItemsArr) ||
      avoidOverlay(goodItem, badItemsArr)
    ) {
      goodItem.removeItem();
    } else {
      goodItemsArr.push(goodItem);
      if (goodItemsArr.length > 2) {
        goodItemsArr[0].removeItem();
        goodItemsArr.shift();
      }
      return false;
    }
  }
}, 2000);

// good items: collision detection + remove item
let gameScore = 0;
setInterval(() => {
  goodItemsArr.forEach((goodItem, i) => {
    if (collisionDetection(player, goodItem)) {
      gameScore += 10000;
      goodItem.removeItem();
      goodItemsArr.splice(i, 1);
      const displayScore = document.getElementById('showScore');
      displayScore.innerText = gameScore;
    }
  });
}, 10);

// generate bad items every 2s
const badItemsArr = [];
setInterval(() => {
  while (true) {
    const badItem = new Items('badItem');
    if (
      avoidOverlay(badItem, goodItemsArr) ||
      avoidOverlay(badItem, badItemsArr)
    ) {
      badItem.removeItem();
    } else {
      badItemsArr.push(badItem);
      if (badItemsArr.length > 5) {
        badItemsArr[0].removeItem();
        badItemsArr.shift();
      }
      return false;
    }
  }
}, 2000);

// bad items: collision detection + call gameover page
setInterval(() => {
  badItemsArr.forEach((badItem) => {
    if (collisionDetection(player, badItem)) {
      clearInterval(player.intervalId);
      player.intervalId = null;
      location.href = 'gameover.html';
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
