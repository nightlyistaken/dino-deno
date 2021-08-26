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
function player(x,y) {
  canvas.copy(playerImg, { x: 0, y: 0, width: playerDimensions, height: playerDimensions }, {
    x: x,
    y: y,
    width: playerDimensions,
    height: playerDimensions,
  });
}
function cactus(x,y) {
  canvas.copy(cactusImg, { x: 0, y: 0, width: cactusDimensions, height: cactusDimensions }, {
    x: x,
    y: y,
    width: 44,
    height: 44,
  });
}
// Variables

const fps = 9;
const gravity = 1;

const playerSurface = canvas.loadSurface("sprites/dino.png");
const playerImg = canvas.createTextureFromSurface(playerSurface);
const playerDimensions = 44;
let playerX = 300;
let playerY = 100;
let playerY_change = 0;


const cactusSurface = canvas.loadSurface("sprites/cactus.png");
const cactusImg = canvas.createTextureFromSurface(cactusSurface);
const cactusDimensions = 54;
let cactusX = invertHeight;
let cactusY = 100;

const font = canvas.loadFont(
  "./fonts/mainfont.ttf",
  128,
  { style: "normal" },
);

// Key press handlers
let is_space = false;
// Other handlers
let gameOver = false;
let intro = true;
 
function gameLoop() {
  canvas.setDrawColor(255,255,255,255);
  canvas.present();

  canvas.clear();
  if (intro) {
    return;
  } 
  canvas.clear();
  if (is_space) {
    playerY -= 100
    is_space = false;
  } else {
    // Give player downwards acceleration
    playerY += gravity;
  }
  
  if (playerY >= invertHeight - 24) {
    playerY = invertHeight - 24;
  }
  if (playerY >= 100) {
    playerY = 100;
  }
  if (cactusY >= invertWidth - 54) {
    cactusY = invertWidth - 54;
  }// size*
  cactusX -= 3;
  if (cactusX <= 0 - cactusDimensions) {
    cactusX = invertHeight + cactusDimensions;
  }
  if(checkCollision(playerX, playerY, playerDimensions, playerDimensions, cactusX, cactusY, cactusDimensions, cactusDimensions)) {
    // GAME OVER
    gameOver = true;
    intro = true;
    return;
  }
  // come here wtf is happening with m
  player(playerX, playerY);
  cactus(cactusX, cactusY);
  canvas.present();
  Deno.sleepSync(fps);
}

// Basic Intro Screen
canvas.clear();

// Update the screen
canvas.present();

for await (const event of canvas) {
  switch(event.type) {
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
        is_space = true;
      }
      // R
      if (event.keycode == 114 && gameOver) {
        intro = true;
        gameOver = false;
      }
      break;
    case "mouse_button_down":
      // Left click
      if(event.button == 1 && !gameOver) {
        intro = false;
        is_space = true;
      }
      break;
    default:
      break;
  }
}