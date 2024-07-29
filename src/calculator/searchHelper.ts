import { items } from "./datasource";
import { take } from "lodash-es";
import Fuse from "fuse.js";

const fuse = new Fuse(items, {
  keys: ["name"],
});

export function searchRecipe(name: string) {
  if (name.length > 15) return [];
  return take(fuse.search(name), 10).map((v) => v.item);
}
