import { Canvas, EventType, Rect, Surface, Texture, WindowBuilder } from "https://raw.githubusercontent.com/littledivy/deno_sdl2/main/mod.ts";
import { Dino } from "./Dino.ts";
import { Cacti } from "./Cactus.ts";
import { checkCollision } from "./utils/checkCollision.ts";
const canvasWidth = 600;
const canvasHeight = 150;

function sleepSync(timeout: number) {
  const sab = new SharedArrayBuffer(1024);
  const int32 = new Int32Array(sab);
  Atomics.wait(int32, 0, 0, timeout);
}
/** Game window */
const window = new WindowBuilder("Dino Game", canvasWidth, canvasHeight).build();
export const canvas = window.canvas();

const dino = new Dino();
const cacti = new Cacti();

const fps = 10;
const gravity = 2;

const trackSurface = Surface.fromFile("./sprites/track.png");
const creator = canvas.textureCreator();
const trackImg = creator.createTextureFromSurface(trackSurface);

function cactus(c: {
  texture: Texture;
  width: number;
  height: number;
  x: number;
  y: number;
}) {
  canvas.copy(
    c.texture,
    new Rect(0, 0, c.width, c.height),
    new Rect(c.x, c.y, 34, 34)
  );
}

cacti.generateCactus();
const mainFont = canvas.loadFont("./fonts/mainfont.ttf", 128);

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
      new Rect(0, 0, dino.width, dino.height),
      new Rect(dino.x, dino.y, 42, 42),
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
      // canvas.playMusic("./audio/game_over.wav");
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
    // canvas.playMusic("./audio/jump.wav");
  } else {
    // Give player downwards acceleration
    dino.y += gravity;
  }
  // Reset space state
  isSpace = false;
  canvas.copy(
    trackImg,
    new Rect(  0,  0,  600 * 2,  28 ),
    new Rect(
      trackX,
     130 - 28,
       600 * 2,
       28,
    ),
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
      // canvas.playMusic("./audio/score.wav");
    }
    trackSpeed = 5;
  }

  score += 0.2;
  // canvas.renderFont(
  //   mainFont,
  //   Math.round(score).toString(),
  //   {
  //     blended: { color: { r: 4, g: 0, b: 0, a: 255 } },
  //   },
  //   {
  //     x: 540,
  //     y: 0,
  //     width: 44,
  //     height: 40,
  //   },
  // );
  
  canvas.present();
  sleepSync(fps);
}

// Basic Intro Screen

// Update the screen
canvas.present();

for await (const event of window.events()) {
  switch (event.type) {
    case EventType.Draw:
      gameLoop();
      break;
    case EventType.Quit:
      Deno.exit(0);
      break;
    case EventType.KeyDown:
      // Space
      console.log(event)
      if (event.keysym.sym == 32 && !gameOver) {
        console.log(event)
        intro = false;
        if (!playing) {
          playing = true;
          // canvas.playMusic("./audio/click.wav");
        }
        if (!isSpace) isSpace = true;
      }
      break;
    case EventType.MouseButtonDown:
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
