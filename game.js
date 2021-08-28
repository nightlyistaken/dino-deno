// Import deno_sdl2
import { Canvas } from "https://deno.land/x/sdl2@0.1-alpha.6/src/canvas.ts";

// In deno_sdl2, height and width is reverted in the system.
// There is a issue, will remove invert when fixed.
const invertHeight = 600;
const invertWidth = 150;

// Create canvas (window)
const canvas = new Canvas({
  title: "dino",
  height: invertHeight,
  width: invertWidth,
  centered: true,
  fullscreen: false,
  hidden: false,
  resizable: false,
  minimized: false,
  maximized: false,
});

// Set cursor to cursor.png in sprites folder
canvas.setCursor("sprites/cursor.png");

// Functions
function checkCollision(
  x1,
  y1,
  w1,
  h1,
  x2,
  y2,
  w2,
  h2,
) {
  return !(x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const playerSurfaceRun1 = canvas.loadSurface("sprites/dino-run1.png");
const playerImgJumpRun1 = canvas.createTextureFromSurface(playerSurfaceRun1);

const playerSurfaceRun2 = canvas.loadSurface("sprites/dino-run2.png");
const playerImgJumpRun2 = canvas.createTextureFromSurface(playerSurfaceRun2);

const playerSurfaceJump = canvas.loadSurface("sprites/dino.png");
const playerImgJump = canvas.createTextureFromSurface(playerSurfaceJump);

const rainSurface = canvas.loadSurface("sprites/rain.png");
const rainImg = canvas.createTextureFromSurface(rainSurface);


let animationCycle = 0;
let textures = [
  playerImgJumpRun1,
  playerImgJumpRun2,
];

function player(x, y) {

  animationCycle += 1;
  if (animationCycle >= 2) {
    animationCycle = 0;
  }
  const texture = y !== 100 - 28 ? playerImgJump : textures[animationCycle];
  canvas.copy(texture, {
    x: 0,
    y: 0,
    width: playerDimensions,
    height: playerDimensions,
  }, {
    x: x,
    y: y,
    width: 42,
    height: 42,
  });
}


// Variables

const fps = 10;
const gravity = 2;

const playerDimensions = 300;
let playerX = 300;
let playerY = 50;

const trackSurface = canvas.loadSurface("sprites/track.png");
const trackImg = canvas.createTextureFromSurface(trackSurface);

const cactusSurface1 = canvas.loadSurface("sprites/cactus.png");
const cactusImg1 = canvas.createTextureFromSurface(cactusSurface1);
const cactusDimensions = 54;
let cactusX = 600 + cactusDimensions;
let cactusY = 100 - 20;

const cactusSurface2 = canvas.loadSurface("sprites/cactus-2.png");
const cactusImg2 = canvas.createTextureFromSurface(cactusSurface2);

const cactusSurface3 = canvas.loadSurface("sprites/cactus-3.png");
const cactusImg3 = canvas.createTextureFromSurface(cactusSurface3);

const cactusSurface4 = canvas.loadSurface("sprites/cactus-4.png");
const cactusImg4 = canvas.createTextureFromSurface(cactusSurface4);

const cactusTextures = [
  cactusImg1,
  cactusImg2,
  cactusImg3,
  cactusImg4,
];

function cactus(c) {
  canvas.copy(c.texture, { x: 0, y: 0, width: c.width, height: c.height }, {
    x: c.x,
    y: c.y,
    width: 34,
    height: 34,
  });

}
const cactusList = [];
const rainList = [];

function generateCactus() {
  const texture1 = cactusTextures[Math.floor(Math.random() * (cactusTextures.length - 1))];
  // 1st cactus
  cactusList.push({ texture: texture1, x: 600 + cactusDimensions, y: cactusY, width: cactusDimensions, height: cactusDimensions });

  const texture2 = cactusTextures[Math.floor(Math.random() * (cactusTextures.length - 1))];
  // 2nd cactus
  cactusList.push({ texture: texture2, x: 600 + (cactusDimensions * 2) + 800, y: cactusY, width: cactusDimensions, height: cactusDimensions });

  // rainList.push({ x: 600 + (cactusDimensions * 2) + 800, y: cactusY, width: cactusDimensions, height: cactusDimensions });  

}
generateCactus();
const mainFont = canvas.loadFont(
  "./fonts/mainfont.ttf",
  12,
  { style: "normal" },
);
const titleFont = canvas.loadFont(
  "./fonts/titlefont.otf",
  93,
  { style: "normal" },
);

// Key press handlers
let is_space = false;
// Other handlers
let gameOver = false;
let intro = true;
let trackX = 20;
let score = 0;
let trackSpeed = 4;
let playing = false;
function gameLoop() {
  canvas.setDrawColor(255, 255, 255, 255);


  canvas.present();
  canvas.clear();
  if (intro) {
    canvas.renderFont(titleFont, "Dino Deno", {
      blended: { color: { r: 0, g: 0, b: 0, a: 255 } },
    }, {
      x: 100,
      y: 30,
    })
    return;
  }

  canvas.clear();

  player(playerX, playerY);

  for (let i = 0; i < cactusList.length; i++) {
    cactus(cactusList[i]);
    let { x, y, width, height } = cactusList[i];

    if (x <= 0 - cactusDimensions) {
      const loc = () => Math.round(Math.random()) * invertHeight;
      let gap = loc();
      while(gap > invertHeight) gap = loc();
      cactusList[i].x = invertHeight + gap;
      cactusList[i].texture = cactusTextures[Math.floor(Math.random() * (cactusTextures.length - 1))];
    }

    cactusList[i].x -= is_space ? trackSpeed + 10 : trackSpeed;

    if (checkCollision(playerX, playerY, 14, 14, x, y, width, height)) {
      canvas.playMusic("./audio/game_over.wav");
      gameOver = true;
      intro = true;
      score = 0;
      return;
    }
  }
  // Check if space bar is pressed and player is on the ground.
  if (is_space && playerY == 100 - 28) {
    playerY -= 70;
    is_space = false;
    canvas.playMusic("./audio/jump.wav");
  } else {
    // Give player downwards acceleration
    playerY += gravity;
  }
  // Reset space state
  is_space = false;
  canvas.copy(trackImg, { x: 0, y: 0, width: 600 * 2, height: 28 }, {
    x: trackX,
    y: 130 - 28,
    width: 600 * 2,
    height: 28,
  });
  trackX -= trackSpeed;
  if (trackX <= -130) {
    trackX = 0;
  }
  if (playerY >= 100 - 28) {
    playerY = 100 - 28;
  }

  if (score >= 100) {
    if (trackSpeed < 5) {
      canvas.playMusic("./audio/score.wav");
    }
    trackSpeed = 5;
  }

  score += 0.1;
  canvas.renderFont(mainFont, Math.round(score).toString(), {
    blended: { color: { r: 0, g: 0, b: 0, a: 255 } },
  }, {
    x: 550,
    y: 0,
  })
  canvas.present();
  Deno.sleepSync(fps);
}

// Basic Intro Screen

// Update the screen
canvas.present();

for await (const event of canvas) {
  switch (event.type) {
    case "draw":
      gameLoop();
      break;
    case "quit":
      canvas.quit();
      break;
    case "key_down":
      // Space
      if (event.keycode == 32 && !gameOver) {
        intro = false;
        if (!playing) {
          playing = true;
          canvas.playMusic("./audio/click.wav");
        }
        if (!is_space) is_space = true;
      }
      break;
    case "mouse_button_down":
      // Left click
      if (event.button == 1 && !gameOver) {
        intro = false;
        if (!is_space) is_space = true;
      }
      break;
    default:
      break;
  }
}