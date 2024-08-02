<template>
  <div class="h-screen mc m-0 w-full">
    <!-- Search -->
    <div class="flex flex-col gap-1 w-96 shrink-0">
      <div class="mfloat px-4 py-2 text-center">设置</div>
      <div class="mpanel px-4 py-2 flex items-center gap-2">
        <p class="flex justify-between items-center w-full">
          <span>数字显示为"N组+M个"格式</span
          ><MCSwithcer v-model="config.amountStyle" />
        </p>
      </div>
      <div class="mfloat px-4 py-2 text-center">要计算的物品</div>
      <div class="flex gap-1 w-full grow-0">
        <input
          class="dark-mpanel px-4 py-2 outline-none w-full"
          v-model="calcItem.name"
          @input="searchItem"
          placeholder="搜索..."
        />
        <input
          class="dark-mpanel px-2 py-2 outline-none w-20"
          placeholder="数量..."
          type="number"
          v-model="calcItem.amount"
        />
        <div class="mfloat px-2 py-0.5 shrink-0" @click="calc">计算</div>
      </div>
      <div class="mpanel h-full flex flex-col gap-1 overflow-y-auto">
        <div
          v-for="i in searchItemResult"
          class="px-4 py-2 cursor-pointer"
          @click="
            calcItem.id = i.id;
            calcItem.name = i.name;
          "
        >
          {{ i.name }}
        </div>
      </div>
    </div>

    <!-- List -->
    <div class="flex flex-col gap-1 w-96 shrink-0">
      <div class="mfloat px-4 py-2 text-center">材料列表</div>
      <input
        class="dark-mpanel px-4 py-2 outline-none"
        v-model="ingredientReserch"
        @input="searchIngredient"
        placeholder="搜索..."
      />
      <div
        v-if="loading"
        class="mpanel flex items-center justify-center h-full"
      >
        计算中... 请稍等
      </div>
      <div v-else class="overflow-auto">
        <div
          v-for="m in materials"
          class="mpanel px-4 py-2 flex justify-between cursor-pointer"
          @click="resetDetail(m.id)"
        >
          <span>{{ m.name }}</span> <AmountSpan :amount="m.amount" />
        </div>
      </div>
    </div>

    <!-- Detail -->
    <div class="w-full flex flex-col gap-1">
      <div class="mfloat px-4 py-2 flex items-center gap-2">
        <img
          v-if="detailItemStack.size > 1"
          :src="backIcon"
          class="shrink-0 w-[32px] h-[32px] my-[-8px]"
          @click="detailItemStack.pop()"
        />
        {{ detailItem ? detailItem.name : "请选择一个物品" }}
      </div>
      <div class="dark-mpanel px-4 py-2">
        所需材料
        <span class="text-gray-400">
          <AmountSpan :amount="detailItem?.amount" />
        </span>
      </div>
      <div class="mpanel px-4 py-2">
        <ul>
          <li
            class="cursor-pointer"
            v-for="i in detailItem?.recipe?.ingredients"
            @click="changeDetail(i[0].id)"
          >
            {{ i[0].name }}
            <AmountSpan
              :amount="
                i[1] * Math.ceil(detailItem.amount/ detailItem.recipe!.resultAmount)
              "
            />
          </li>
        </ul>
      </div>
      <div class="dark-mpanel px-4 py-2">被需要于</div>
      <div class="mpanel px-4 py-2 h-full">
        <ul>
          <li
            class="cursor-pointer"
            v-for="(amount, id) in detailItem?.fathers"
            @click="changeDetail(id as string)"
          >
            {{ recipeStore.graph[id].name }} 所需
            <AmountSpan
              :amount="
                Math.ceil(
                  amount * detailItem.amount /
                    recipeStore.graph[id].recipe!.resultAmount
                )
                * amount
              "
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRecipeStore } from "./stores/counter";
import { debounce } from "lodash-es";
import Fuse from "fuse.js";
import type Material from "./calculator/model/material";
import { Stack } from "./calculator/utils/stack";
import backIcon from "./assets/back.svg";
import { searchRecipe } from "./calculator";
import AmountSpan from "./components/AmountSpan.vue";
import { useConfig } from "./stores/config";
import MCSwithcer from "./components/MCSwitcher.vue";

const recipeStore = useRecipeStore();
const config = useConfig();

const loading = ref(false);
const calcItem = reactive({
  id: "",
  name: "",
  amount: 0,
});
const searchItemResult = ref<{ id: string; name: string }[]>([]);
const searchItem = debounce(() => {
  searchItemResult.value = searchRecipe(calcItem.name);
}, 300);

const materialsFuse = computed(
  () =>
    new Fuse(recipeStore.materials, { keys: ["name", "pinyin", "shortPinyin"] })
);
const materials = ref(recipeStore.materials);

const detailItemStack = ref(new Stack<Material>([]));
const detailItem = computed(() => detailItemStack.value.peek());

const ingredientReserch = ref("");
const searchIngredient = debounce(() => {
  if (!ingredientReserch.value) {
    materials.value = recipeStore.materials;
    return;
  }
  materials.value = materialsFuse.value
    .search(ingredientReserch.value)
    .map((m) => m.item);
}, 300);

const changeDetail = (id: string) => {
  detailItemStack.value.push(recipeStore.graph[id]);
};

const resetDetail = (id: string) => {
  detailItemStack.value.clear();
  detailItemStack.value.push(recipeStore.graph[id]);
};

const calc = () => {
  loading.value = true;
  recipeStore.work(calcItem).then(() => {
    loading.value = false;
    resetDetail(calcItem.id);
    materials.value = recipeStore.materials;
  });
};
</script>
