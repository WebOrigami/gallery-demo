import sharp from "sharp";

export default function thumbnail(imageBuffer, width = 200) {
  if (!(imageBuffer instanceof Buffer)) {
    return undefined;
  }
  return sharp(imageBuffer).resize({ width }).toBuffer();
}
