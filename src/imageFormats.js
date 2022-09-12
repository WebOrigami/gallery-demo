import sharp from "sharp";

// Given a graph that contains some .jpg images, return a new graph with the
// images formatted at several sizes and in both AVIF and WebP formats.
export default function imageFormats(graph) {
  return {
    async *[Symbol.asyncIterator]() {
      for await (const key of graph) {
        if (key.endsWith(".jpg")) {
          // Each .jpg file generates a set of images at various sizes/types.
          const basename = key.slice(0, -4);
          yield `${basename}.avif`;
          yield `${basename}.webp`;
          yield `${basename}-w200.avif`;
          yield `${basename}-w200.webp`;
          yield `${basename}-w500.avif`;
          yield `${basename}-w500.webp`;
        } else {
          // Other file names are returned as is.
          yield key;
        }
      }
    },

    async get(key) {
      // Match the key against the format of the file names we support.
      // Example: image1-w200.avif
      const regex =
        /^(?<basename>.+?)(-w(?<width>\d+))?.(?<type>avif|gif|png|tiff|webp)$/;
      const match = key.match(regex);
      if (!match) {
        // Not a generated image file, return as is.
        return graph.get(key);
      } else {
        // Generate the image in the requested format.
        const { width, basename, type } = match.groups;

        // Get the original image.
        const jpgKey = `${basename}.jpg`;
        const jpegBuffer = await graph.get(jpgKey);
        const jpegSharp = sharp(jpegBuffer);

        // Resize if requested.
        const resized = width ? jpegSharp.resize(parseInt(width)) : jpegSharp;

        // If not resizing, use higher quality.
        const quality = width ? 50 : 60;

        // Invoke the avif or webp formatter.
        const formatted = resized[type]({ quality });
        const outputBuffer = await formatted.toBuffer();
        return outputBuffer;
      }
    },
  };
}
