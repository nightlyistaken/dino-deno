import { Entity } from "./Entity.ts";
import { canvas } from "./game.ts";
export class Dino extends Entity {
  textures: number[];
  animationCycle: number;
  playerSurfaceRun1: number;
  playerImgJumpRun1: number;
  playerSurfaceRun2: number;
  playerImgJumpRun2: number;
  playerSurfaceJump: number;
  playerImgJump: number;
  canvas: import("https://deno.land/x/sdl2@0.2-alpha.1/src/canvas.ts").Canvas;
  // 300, 50, 300, 300
  constructor() {
    super({
      x: 300,
      y: 50,
      width: 300,
      height: 300,
    });
    this.canvas = canvas;
    this.animationCycle = 0;
    this.playerSurfaceRun1 = canvas.loadSurface("sprites/dino-run1.png");
    this.playerImgJumpRun1 = canvas.createTextureFromSurface(
      this.playerSurfaceRun1,
    );

    this.playerSurfaceRun2 = canvas.loadSurface("sprites/dino-run2.png");
    this.playerImgJumpRun2 = canvas.createTextureFromSurface(
      this.playerSurfaceRun2,
    );
    this.playerSurfaceJump = canvas.loadSurface("sprites/dino.png");
    this.playerImgJump = canvas.createTextureFromSurface(
      this.playerSurfaceJump,
    );

    this.textures = [this.playerImgJumpRun1, this.playerImgJumpRun2];
  }
  render() {
    this.animationCycle += 1;
    if (this.animationCycle >= 2) {
      this.animationCycle = 0;
    }
    const texture = this.y !== 100 - 28
      ? this.playerImgJump
      : this.textures[this.animationCycle];
    this.canvas.copy(
      texture,
      {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
      },
      {
        x: this.x,
        y: this.y,
        width: 42,
        height: 42,
      },
    );
  }
}
