import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { Item, MaterialGraph } from "@/calculator/core/types";

export const useRecipeStore = defineStore("calc", () => {
  const graph = ref<MaterialGraph>({});

  const work = async (item: Item) => {
    if (item.amount == 0) return;
    return new Promise<MaterialGraph>((resolve, reject) => {
      const worker = new Worker(
        new URL("../calculator/worker.ts", import.meta.url),
        {
          type: "module",
        }
      );

      worker.onmessage = (event: MessageEvent<MaterialGraph>) => {
        resolve(event.data);
        worker.terminate();
      };

      worker.onerror = (error) => {
        reject(error);
        worker.terminate();
      };

      worker.postMessage([{ ...item }]);
    }).then((data) => {
      graph.value = data;
    });
  };

  const materials = computed(() =>
    Object.entries(graph.value)
      .map((v) => v[1])
      .sort((a, b) => a.maxLayer - b.maxLayer)
  );

  return { graph, materials, work };
});
