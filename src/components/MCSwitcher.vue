<template>
  <div class="toggle-switch" :class="{ active: isActive }" @click="toggle">
    <div class="knob" :class="{ active: isActive }">
      <div class="mfloat h-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isActive = defineModel<boolean>();

function toggle() {
  isActive.value = !isActive.value;
}
</script>

<style scoped lang="postcss">
.toggle-switch {
  width: 40px;
  height: 24px;
  background-color: var(--dark-grey);
  border-color: var(--bd-color);
  @apply border-collapse border-solid border-4;
  padding: 2px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}
.toggle-switch.active {
  background-color: var(--grey);
}

.knob {
  width: 20px;
  height: 32px;
  border-color: var(--bd-color);
  @apply border-collapse border-solid border-4 -my-2 pb-1;
  position: absolute;
  top: 0;
  left: -4px;
  transition: all 0.3s;
}

.knob.active {
  left: 16px;
  background-color: green;
}
</style>
