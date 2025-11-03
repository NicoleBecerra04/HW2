// block.js
class Block {
  constructor(x, type) {
    this.x = x;
    this.y = -30;
    this.size = 30;
    this.speed = random(3, 6);
    this.type = type;
    if (type === 1) this.c = color(120,72,48);     // dirt
    else if (type === 2) this.c = color(100);       // stone
    else if (type === 3) this.c = color(0,255,255); // diamond
    else if (type === 4) this.c = color(0,200,0);   // emerald
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(this.c);
    rect(this.x, this.y, this.size, this.size);
  }
}
