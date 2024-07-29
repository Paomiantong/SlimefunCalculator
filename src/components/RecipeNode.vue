<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <div>{{ nodesData?.name }}</div>
    <p>{{ nodesData?.amount }} | {{ amountTrans[0] }}组+{{ amountTrans[1] }}</p>
  </div>
  <Handle id="a" type="source" :position="Position.Right" />
  <Handle id="b" type="target" :position="Position.Left" />
</template>

<script setup lang="ts">
import type Material from "@/calculator/model/material";
import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  useVueFlow,
} from "@vue-flow/core";
import { computed } from "vue";

const connections = useHandleConnections({
  type: "target",
});

const nodesData: Material | null = useNodesData(
  () => connections.value[0]?.target
).value?.data;

const amountTrans = computed(() => {
  if (nodesData) {
    return [
      parseInt((nodesData.amount / 64).toString()),
      nodesData.amount % 64,
    ];
  }
  return [0, 0];
});

// const { updateNodeData, getConnectedEdges } = useVueFlow();

// function onSelect(color) {
//   updateNodeData(props.id, { color, isGradient: false });

//   const connectedEdges = getConnectedEdges(props.id);
//   for (const edge of connectedEdges) {
//     edge.style = {
//       stroke: color,
//     };
//   }
// }

// function onGradient() {
//   updateNodeData(props.id, { isGradient: true });
// }
</script>
