import { uniq } from "lodash-es";

import { receipes, skip } from "../datasource";
import Material from "../model/material";
import Recipe from "../model/recipe";
import { Queue } from "../utils";

import type { Item, MaterialGraph } from "./types";

export function createMaterialGraph(itemList: Item[]) {
  const materialGraph: MaterialGraph = {};

  for (const index in itemList) {
    loadRecipe(itemList[index].id as string, materialGraph);
  }
  return materialGraph;
}

/**
 * 生成材料层级
 * @param itemList 物品列表
 * @param materialGraph 物品图
 */
export function createMaterialLayers(
  itemList: Item[],
  materialGraph: MaterialGraph
) {
  const queue = new Queue<string>();
  const materialLayers: string[][] = [];
  let layer = 0;
  for (const item of itemList) {
    queue.enqueue(item.id as string);
  }
  queue.enqueue("#");

  while (!queue.isEmpty()) {
    const current = queue.front();
    queue.dequeue();
    if (current !== "#") {
      if (layer > 0) {
        materialLayers[layer - 1].push(current);
      }
      if (materialGraph[current].recipe === null) continue;
      for (const [ingredient] of materialGraph[current].recipe!.ingredients) {
        const id = ingredient.id;
        queue.enqueue(id);
      }
    } else {
      if (queue.isEmpty()) break;
      layer++;
      materialLayers[layer - 1] = [];
      queue.enqueue("#");
    }
  }
  for (const [i, layerItems] of materialLayers.entries()) {
    materialLayers[i] = uniq(layerItems);
    const layerBit = 0x01 << i;
    // 物品可能存在多个layer,用bitmap来存,并且存下最深的layer用于排序
    for (const itemId of layerItems) {
      const item = materialGraph[itemId];
      item.layer |= layerBit;
      item.maxLayer = Math.max(item.maxLayer, i);
    }
  }
  return materialLayers;
}

type QueueItem = [string, string, string | null, number];

export function loadRecipe(id: string, materialGraph: MaterialGraph) {
  // 初始化队列
  const queue = new Queue<QueueItem>();
  queue.enqueue([id, "", null, 1]);

  while (!queue.isEmpty()) {
    const [id, _name, fid, amount] = queue.dequeue()!;
    // console.log(id, _name, fid, amount);
    // 创建节点
    if (!materialGraph[id]) {
      if (receipes[id] !== undefined && !skip.has(id)) {
        // console.log(receipes[id]);
        // TODO: 有些物品有多个配方，暂时只取第一个
        const {
          name,
          output: resultAmount,
          recipe: _ingredients,
        } = receipes[id];
        const recipe = new Recipe(resultAmount);
        materialGraph[id] = new Material(id, name, false, recipe);
        const counter = new Map<string, QueueItem>();
        const ingredients = _ingredients.filter((v) => v !== null);
        ingredients.forEach((ingredient) => {
          if (counter.has(ingredient!.material)) {
            const [material, name, id, amount] = counter.get(
              ingredient!.material
            )!;
            const added =
              amount + (ingredient!.amount ? ingredient!.amount : 1);
            counter.set(ingredient!.material, [material, name, id, added]);
            return;
          }
          counter.set(ingredient!.material, [
            ingredient!.material,
            ingredient!.name,
            id,
            ingredient!.amount ? ingredient!.amount : 1,
          ]);
        });
        // 记录配方所需材料
        for (const ingredient of counter.values()) {
          queue.enqueue(ingredient);
        }
      } else {
        materialGraph[id] = new Material(id, _name, true, null);
      }
    }

    if (fid !== null) {
      // 标记该材料是谁的子材料,并表明数量
      materialGraph[id].fathers[fid] = amount;
      // 添加材料
      materialGraph[fid].recipe!.addIngredient(materialGraph[id], amount);
    }
  }
}
