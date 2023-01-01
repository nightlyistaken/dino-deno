interface checkCollisionable {
  x1: number;
  y1: number;
  w1: number;
  h1: number;
  x2: number;
  y2: number;
  w2: number;
  h2: number;
}

export function checkCollision(
  entity: checkCollisionable,
): boolean {
  return !(entity.x2 > entity.w1 + entity.x1 ||
    entity.x1 > entity.w2 + entity.x2 ||
    entity.y2 > entity.h1 + entity.y1 || entity.y1 > entity.h2 + entity.y2);
}
