import { Rect, Surface, Texture } from "https://deno.land/x/sdl2/mod.ts";
import { Entity } from "./Entity.ts";
import { canvas } from "./game.ts";
export class Dino extends Entity {
  textures: Texture[];
  animationCycle: number;
  playerSurfaceRun1: Surface;
  playerImgJumpRun1: Texture;
  playerSurfaceRun2: Surface;
  playerImgJumpRun2: Texture;
  playerSurfaceJump: Surface;
  playerImgJump: Texture;
  canvas: import("https://deno.land/x/sdl2/mod.ts").Canvas;
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
    const creator = canvas.textureCreator();
    this.playerSurfaceRun1 = Surface.fromFile("./sprites/dino-run1.png");
    this.playerImgJumpRun1 = creator.createTextureFromSurface(
      this.playerSurfaceRun1,
    );

    this.playerSurfaceRun2 = Surface.fromFile("./sprites/dino-run2.png");
    this.playerImgJumpRun2 = creator.createTextureFromSurface(
      this.playerSurfaceRun2,
    );
    this.playerSurfaceJump = Surface.fromFile("./sprites/dino.png");
    this.playerImgJump = creator.createTextureFromSurface(
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
      new Rect(
        0,
         0,
         this.width,
         this.height,
      ),
      new Rect(this.x, this.y, 42, 42),
  
    );
  }
}
