import sharp from "sharp";

export default function thumbnail(imageBuffer) {
  return imageBuffer
    ? sharp(imageBuffer).resize(200, 143).rotate().toBuffer()
    : undefined;
}
