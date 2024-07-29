import { ref } from "vue";
import { defineStore } from "pinia";

export const useConfig = defineStore("config", () => {
  const amountStyle = ref<boolean>(true);
  return { amountStyle };
});
