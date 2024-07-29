import { calculateIngredients } from "./core/calculate";
import { createMaterialGraph, createMaterialLayers } from "./core/recipe";
import type { Item } from "./core/types";

const work = (item: Item[]) => {
  const graph = createMaterialGraph(item);
  createMaterialLayers(item, graph);
  calculateIngredients(item, graph);
  return graph;
};

onmessage = (e) => {
  const graph = work(e.data);
  postMessage(graph);
};
