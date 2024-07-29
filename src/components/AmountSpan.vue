<template>
  <span>×{{ amountText }}</span>
</template>

<script setup lang="ts">
import { useConfig } from "@/stores/config";
import { computed } from "vue";

const config = useConfig();

const props = defineProps<{
  amount: number;
}>();

const amountText = computed(() => {
  if (config.amountStyle) {
    const stack = ~~(props.amount / 64);
    const remain = props.amount % 64;
    return `${stack ? `${stack}组` : ""}${remain ? `${remain}个` : ""}`;
  } else {
    return `${props.amount}`;
  }
});
</script>
