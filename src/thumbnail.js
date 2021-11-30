import sharp from "sharp";

export default function thumbnail(imageBuffer) {
  if (!(imageBuffer instanceof Buffer)) {
    return undefined;
  }
  return sharp(imageBuffer).resize({ width: 200 }).toBuffer();
}
