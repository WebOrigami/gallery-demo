import { ExplorableGraph } from "@explorablegraph/explorable";

/**
 * Expose index.html and keys.json (no initial dot) for Netlify.
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
        return await this.get(".keys.json");
      }
      const value = await graph.get(key);
      return ExplorableGraph.isExplorable(value) ? netlify(value) : value;
    },
  };
}
