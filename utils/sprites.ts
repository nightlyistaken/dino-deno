import { Surface, Texture, TextureCreator } from "deno_sdl2";

export default function getImage(
  image: string,
  creator: TextureCreator,
): Texture {
  const trackSurface = Surface.fromFile(image);
  return creator.createTextureFromSurface(trackSurface);
}
