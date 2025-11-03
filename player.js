// player.js
class Player {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.size = 30;
    this.c = c; // p5.Color or numeric
  }

  update1() {
    if (keyIsPressed) {
      if (keyCode === LEFT_ARROW) this.x -= this.speed;
      if (keyCode === RIGHT_ARROW) this.x += this.speed;
    }
    this.x = constrain(this.x, 0, width - this.size);
  }

  update2() {
    if (keyIsPressed) {
      if (key === 'a' || key === 'A') this.x -= this.speed;
      if (key === 'd' || key === 'D') this.x += this.speed;
    }
    this.x = constrain(this.x, 0, width - this.size);
  }

  display() {
    fill(this.c);
    rect(this.x, this.y, this.size, this.size);
  }
}
