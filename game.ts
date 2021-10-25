import { Canvas } from "https://deno.land/x/sdl2@0.2-alpha.1/src/canvas.ts";
import { Dino } from "./Dino.ts";
import { Cacti } from "./Cactus.ts";
import { checkCollision } from "./utils/checkCollision.ts";
const canvasWidth = 600;
const canvasHeight = 150;

/** Game window */
export const canvas = new Canvas({
  title: "dino",
  height: canvasHeight,
  width: canvasWidth,
  centered: true,
  fullscreen: false,
  hidden: false,
  resizable: false,
  minimized: false,
  maximized: false,
  flags: null,
});

canvas.setCursor("sprites/cursor.png");
const dino = new Dino();
const cacti = new Cacti();

const fps = 10;
const gravity = 2;

const trackSurface = canvas.loadSurface("sprites/track.png");
const trackImg = canvas.createTextureFromSurface(trackSurface);

function cactus(c: {
  texture: number;
  width: number;
  height: number;
  x: number;
  y: number; 
}) {
  canvas.copy(
    c.texture,
    { x: 0, y: 0, width: c.width, height: c.height },
    {
      x: c.x,
      y: c.y,
      width: 34,
      height: 34,
    },
  );
}

cacti.generateCactus();
const mainFont = canvas.loadFont("./fonts/mainfont.ttf", 128, {
  style: "normal",
});

// Key press handlers
let isSpace = false;
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
    dino.canvas.copy(
      dino.playerImgJump,
      {
        x: 0,
        y: 0,
        width: dino.width,
        height: dino.height,
      },
      {
        x: dino.x,
        y: dino.y,
        width: 42,
        height: 42,
      },
    );
    return;
  }

  canvas.clear();

  dino.render();

  for (let i = 0; i < cacti.cactusList.length; i++) {
    cactus(cacti.cactusList[i]);
    const { x, y, width, height } = cacti.cactusList[i];

    if (x <= 0 - cacti.width) {
      const loc = () => Math.round(Math.random()) * canvasWidth;
      let gap = loc();
      while (gap > canvasWidth) gap = loc();
      cacti.cactusList[i].x = canvasWidth + gap;
      cacti.cactusList[i].texture = cacti.cactusTextures[
        Math.floor(Math.random() * (cacti.cactusTextures.length - 1))
      ];
    }
    cacti.cactusList[i].x -= isSpace ? trackSpeed + 10 : trackSpeed;
    if (
      checkCollision({
        x1: dino.x,
        y1: dino.y,
        w1: 14,
        h1: 14,
        x2: x,
        y2: y,
        w2: width,
        h2: height,
      })
    ) {
      canvas.playMusic("./audio/game_over.wav");
      intro = true;
      trackSpeed = 0;
      gameOver = true;
      score = 0;
      return;
    }
  }

  // Check if space bar is pressed and player is on the ground.
  if (isSpace && dino.y == 100 - 28) {
    dino.y -= 70;
    isSpace = false;
    canvas.playMusic("./audio/jump.wav");
  } else {
    // Give player downwards acceleration
    dino.y += gravity;
  }
  // Reset space state
  isSpace = false;
  canvas.copy(
    trackImg,
    { x: 0, y: 0, width: 600 * 2, height: 28 },
    {
      x: trackX,
      y: 130 - 28,
      width: 600 * 2,
      height: 28,
    },
  );
  trackX -= trackSpeed;
  if (trackX <= -130) {
    trackX = 0;
  }
  if (dino.y >= 100 - 28) {
    dino.y = 100 - 28;
  }

  if (score >= 100) {
    if (trackSpeed < 5) {
      canvas.playMusic("./audio/score.wav");
    }
    trackSpeed = 5;
  }

  score += 0.2;
  canvas.renderFont(
    mainFont,
    Math.round(score).toString(),
    {
      blended: { color: { r: 4, g: 0, b: 0, a: 255 } },
    },
    {
      x: 540,
      y: 0,
      width: 44,
      height: 40,
    },
  );
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
        if (!isSpace) isSpace = true;
      }
      break;
    case "mouse_button_down":
      // Left click
      if (event.button == 1 && !gameOver) {
        intro = false;
        if (!isSpace) isSpace = true;
      }
      break;
    default:
      break;
  }
}
