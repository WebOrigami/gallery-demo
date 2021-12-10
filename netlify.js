import { ExplorableGraph } from "@explorablegraph/explorable";

/**
 * Expose index.html and keys.json (no initial dot) for Netlify.
 *
 * Netlify won't deploy files that start with a dot like .keys.json. As a
 * workaround, we expose a `keys.json` key that contains the same content as
 * .keys.json. A separate rewrite rule in the _redirects file will redirect
 * requests for .keys.json (which won't be available) to keys.json (which will
 * be available).
 */
export default async function netlify(variant) {
  const graph = ExplorableGraph.from(variant);
  return {
    async *[Symbol.asyncIterator]() {
      const keys = new Set();
      for await (const key of graph) {
        keys.add(key);
        yield key;
      }
      if (!keys.has("index.html")) {
        yield "index.html";
      }
      if (!keys.has("keys.json")) {
        yield "keys.json";
      }
    },

    async get(key) {
      if (key === "keys.json") {
        // Special case; see note above.
        return await this.get(".keys.json");
      }
      const value = await graph.get(key);
      return ExplorableGraph.isExplorable(value) ? netlify(value) : value;
    },
  };
}
