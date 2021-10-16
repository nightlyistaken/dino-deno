import { Entity } from "./Entity.ts";
import { canvas } from "./game.ts";
export class Cacti extends Entity {
  cactusTextures: number[];
  cactusList: {
    texture: number;
    y: number;
    x: number;
    width: number;
    height: number;
  }[];
  constructor() {
    super(654, 80, 54, 54);
    const cactusSurface1 = canvas.loadSurface("sprites/cactus.png");
    const cactusImg1 = canvas.createTextureFromSurface(cactusSurface1);

    const cactusSurface2 = canvas.loadSurface("sprites/cactus-2.png");
    const cactusImg2 = canvas.createTextureFromSurface(cactusSurface2);

    const cactusSurface3 = canvas.loadSurface("sprites/cactus-3.png");
    const cactusImg3 = canvas.createTextureFromSurface(cactusSurface3);

    const cactusSurface4 = canvas.loadSurface("sprites/cactus-4.png");
    const cactusImg4 = canvas.createTextureFromSurface(cactusSurface4);

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

    // rainList.push({ x: 600 + (cactusDimensions * 2) + 800, y: cactusY, width: cactusDimensions, height: cactusDimensions });
  }
}
