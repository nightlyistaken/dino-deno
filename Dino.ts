import { Rect, Surface, Texture } from "deno_sdl2";
import { Entity } from "./Entity.ts";
import { canvas } from "./main.ts";
import getImage from "./utils/sprites.ts";

export class Dino extends Entity {
  textures: Texture[];
  animationCycle: number;
  playerImgJumpRun1: Texture;
  playerImgJumpRun2: Texture;
  playerImgJump: Texture;
  canvas: import("deno_sdl2").Canvas;
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
    this.playerImgJumpRun1 = getImage("./sprites/dino-run1.png", creator);
    this.playerImgJumpRun2 = getImage("./sprites/dino-run2.png", creator);
    this.playerImgJump = getImage("./sprites/dino.png", creator);

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
