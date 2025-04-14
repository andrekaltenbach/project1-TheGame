class Player {
  constructor() {
    this.width = 20;
    this.height = 20;
    this.positionX = 240;
    this.positionY = 240;
    this.intervalId;
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
  constructor() {
    this.width = 20;
    this.height = 20;
    this.positionX = Math.floor(Math.random() * 480 + 1);
    this.positionY = Math.floor(Math.random() * 480 + 1);
    this.itemElement = null;
    this.createItem();
    this.updateUi();
  }

  createItem() {
    this.itemElement = document.createElement('div');
    this.itemElement.className = 'item';
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
    this.itemElement.style.backgroundColor = '#33FF00';
  }
}

const player = new Player();
// generate items every 2s
const itemsArr = [];
setInterval(() => {
  const item = new Items();
  itemsArr.push(item);
  if (itemsArr.length > 2) {
    itemsArr[0].removeItem();
    itemsArr.shift();
  }
}, 2000);

// collision detection + remove item
let gameScore = 0;
setInterval(() => {
  itemsArr.forEach((item) => {
    if (
      player.positionX < item.positionX + item.width &&
      player.positionX + player.width > item.positionX &&
      player.positionY < item.positionY + item.height &&
      player.positionY + player.height > item.positionY
    ) {
      gameScore += 10000;
      item.removeItem();
      itemsArr.shift();
      const displayScore = document.getElementById('showScore');
      displayScore.innerText = gameScore;
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
