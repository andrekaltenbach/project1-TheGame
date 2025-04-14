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
    console.log('update UI');
    const playerElement = document.getElementById('player');
    console.log(playerElement);
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

const player = new Player();

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
