interface EntityOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}
export class Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(options: EntityOptions) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
  }
}
