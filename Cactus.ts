import {
  Surface,
  Texture,
} from "deno_sdl2";
import { Entity } from "./Entity.ts";
import { canvas } from "./game.ts";
export class Cacti extends Entity {
  cactusTextures: Texture[];
  cactusList: {
    texture: Texture;
    y: number;
    x: number;
    width: number;
    height: number;
  }[];
  // 654, 80, 54, 54
  constructor() {
    super({
      x: 654,
      y: 80,
      width: 54,
      height: 54,
    });
    const creator = canvas.textureCreator();
    const cactusSurface1 = Surface.fromFile("./sprites/cactus.png");
    const cactusImg1 = creator.createTextureFromSurface(cactusSurface1);

    const cactusSurface2 = Surface.fromFile("./sprites/cactus-2.png");
    const cactusImg2 = creator.createTextureFromSurface(cactusSurface2);

    const cactusSurface3 = Surface.fromFile("./sprites/cactus-3.png");
    const cactusImg3 = creator.createTextureFromSurface(cactusSurface3);

    const cactusSurface4 = Surface.fromFile("./sprites/cactus-4.png");
    const cactusImg4 = creator.createTextureFromSurface(cactusSurface4);

    this.cactusTextures = [cactusImg1, cactusImg2, cactusImg3, cactusImg4];
    this.cactusList = [];
  }
  generateCactus() {
    const texture1 = this.cactusTextures[
      Math.floor(Math.random() * (this.cactusTextures.length - 1))
    ];
    // 1st cactus
    this.cactusList.push({
      texture: texture1,
      x: 600 + this.width,
      y: this.y,
      width: this.width,
      height: this.height,
    });

    const texture2 = this.cactusTextures[
      Math.floor(Math.random() * (this.cactusTextures.length - 1))
    ];
    // 2nd cactus
    this.cactusList.push({
      texture: texture2,
      x: 600 + this.width * 2 + 800,
      y: this.y,
      width: this.width,
      height: this.height,
    });
  }
}
