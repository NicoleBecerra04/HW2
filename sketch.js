// sketch.js (p5.js)
let bgMusic;
function preload() {
  soundFormats('mp3', 'ogg'); // preferred formats
  bgMusic = loadSound('Subwoofer.mp3');
}


const START = 0;
const PLAYING = 1;
const GAMEOVER = 2;
let gameState = START;

let player1, player2;
let twoPlayer = false;

let blocks = [];
let blockSpawnTimer = 0;

// two-player scores/lives example (optional)
let p1Score = 0, p2Score = 0;
let p1Lives = 3, p2Lives = 3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player1 = new Player(width / 2 - 40, height - 90, color(0, 150, 255)); // blue
  player2 = new Player(width / 2 + 10, height - 90, color(255, 100, 100)); // red

  file = loadSound('Subwoofer.mp3', () => {
    file.loop();
  });
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw() {
  background(135, 206, 235);

  if (gameState === START) {
    drawStartScreen();
  } else if (gameState === PLAYING) {
    drawGame();
  } else if (gameState === GAMEOVER) {
    drawGameOver();
  }
}

function drawStartScreen() {
  fill(0);
  textAlign(CENTER);
  textSize(32);
  text("Minecraft Skyblock", width/2, height/2 - 60);
  textSize(18);
  text("Press 1 for Single Player", width/2, height/2 - 10);
  text("Press 2 for Two Players", width/2, height/2 + 20);
}

function drawGame() {
  // draw background/ground here (you can port your drawMinecraftBackground function)
  drawMinecraftBackground();
function drawMinecraftBackground() {
  // Grass layer
  fill(95, 159, 53);
  rect(0, height - 60, width, 30);

  // Dirt layer
  fill(139, 69, 19);
  rect(0, height - 30, width, 30);

  // Trees
  for (let i = 0; i < width; i += 200) {
    fill(101, 67, 33);
    rect(i + 80, height - 120, 20, 60); // trunk
    fill(34, 139, 34);
    rect(i + 60, height - 160, 60, 50); // leaves
  }

  // Clouds
  fill(255);
  rect(100, 100, 120, 30);
  rect(140, 80, 80, 30);
  rect(400, 60, 150, 40);
  rect(650, 120, 130, 35);
}

  // spawn
  blockSpawnTimer++;
  if (blockSpawnTimer > 40) {
    spawnBlock();
    blockSpawnTimer = 0;
  }

  // update and draw blocks (iterate backwards)
  for (let i = blocks.length - 1; i >= 0; i--) {
    let b = blocks[i];
    b.update();
    b.display();

    let hit = false;
    if (checkCollision(player1, b)) {
      handleCollision(1, b.type);
      hit = true;
    }
    if (twoPlayer && checkCollision(player2, b)) {
      handleCollision(2, b.type);
      hit = true;
    }

    if (hit) {
      blocks.splice(i, 1);
      continue;
    }

    if (b.y > height) {
      blocks.splice(i, 1);
    }
  }

  // players
  player1.update1();
  player1.display();

  if (twoPlayer) {
    player2.update2();
    player2.display();
  }

  // HUD
  fill(0);
  textAlign(LEFT);
  textSize(20);
  text("P1 Score: " + p1Score, 20, 30);
  text("P1 Lives: " + p1Lives, 20, 55);
  if (twoPlayer) {
    textAlign(RIGHT);
    text("P2 Score: " + p2Score, width - 20, 30);
    text("P2 Lives: " + p2Lives, width - 20, 55);
  }

  // gameover condition (example: either player 0 -> immediate)
  if ((!twoPlayer && p1Lives <= 0) || (twoPlayer && (p1Lives <= 0 || p2Lives <= 0))) {
    gameState = GAMEOVER;
  }
}

function drawGameOver() {
  fill(0);
  textAlign(CENTER);
  textSize(30);
  text("Game Over!", width/2, height/2);
  textSize(18);
  if (twoPlayer) {
    text("P1 Final: " + p1Score, width/2, height/2 + 40);
    text("P2 Final: " + p2Score, width/2, height/2 + 70);
  } else {
    text("Final Score: " + p1Score, width/2, height/2 + 40);
  }
  text("Press R to Restart", width/2, height/2 + 100);
}

function keyPressed() {
  if (gameState === START) {
    if (key === '1') {
      twoPlayer = false;
      startGame();
    } else if (key === '2') {
      twoPlayer = true;
      startGame();
    }
  } else if (gameState === GAMEOVER) {
    if (key === 'r' || key === 'R') {
      gameState = START;
      blocks = [];
      p1Score = p2Score = 0;
      p1Lives = p2Lives = 3;
    }
  }
}

function startGame() {
  // required to unlock audio in some browsers
  userStartAudio().then(() => {
    if (bgMusic && !bgMusic.isPlaying()) {
      bgMusic.setLoop(true);
      bgMusic.play(); // or bgMusic.loop();
      bgMusic.setVolume(0.5); // adjust
    }
  }).catch((e) => {
    // fallback: try to play anyway
    if (bgMusic && !bgMusic.isPlaying()) {
      bgMusic.loop();
    }
  });

  gameState = PLAYING;
  player1.x = width/2 - 40;
  player2.x = width/2 + 10;
  blocks = [];
  blockSpawnTimer = 0;

  p1Score = 0;
  p2Score = 0;
  p1Lives = 3;
  p2Lives = 3;
}


function spawnBlock() {
  let type = floor(random(1,5)); // 1..4
  let x = random(0, width - 30);
  blocks.push(new Block(x, type));
}

function checkCollision(p, b) {
  return (p.x < b.x + b.size &&
          p.x + p.size > b.x &&
          p.y < b.y + b.size &&
          p.y + p.size > b.y);
}

function handleCollision(playerNum, blockType) {
  if (playerNum === 1) {
    if (blockType === 3 || blockType === 4) p1Score += 10;
    else if (blockType === 1 || blockType === 2) p1Lives--;
  } else if (playerNum === 2) {
    if (blockType === 3 || blockType === 4) p2Score += 10;
    else if (blockType === 1 || blockType === 2) p2Lives--;
  }
}

// example background (port your own)
function drawMinecraftBackground() {
  // sky
  background(135, 206, 235);
  // ground
  fill(95,159,53);
  rect(0, height - 60, width, 30);
  fill(139,69,19);
  rect(0, height - 30, width, 30);
  // clouds / trees - copy your Processing drawing logic
  fill(255);
  rect(100, 100, 120, 30);
  rect(140, 80, 80, 30);
}
