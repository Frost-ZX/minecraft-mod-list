<template>
  <div ref="self" class="to-top" @click="backToTop">
    <span class="mdi mdi-arrow-up-bold"></span>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const self = ref(null);

/** 返回顶部 */
function backToTop() {
  let el = self.value;
  if (el instanceof HTMLElement) {
    el.parentElement.scrollTo({ behavior: 'smooth', top: 0 });
  }
}
</script>

<style lang="less" scoped>
.to-top {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1000;
  right: 2rem;
  bottom: 2rem;
  width: 1em;
  height: 1em;
  box-shadow: 0 0 0.25rem var(--color-blue);
  border-radius: calc(var(--block-radius) / 2);
  background-color: var(--color-blue);
  color: #FFF;
  font-size: 2.5rem;
  cursor: pointer;

  .mdi {
    font-size: 1.5rem;
  }

  &:hover .mdi {
    animation: up-and-down 1s infinite;
  }
}

@keyframes up-and-down {
  0%, 50%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(0.25rem);
  }
  75% {
    transform: translateY(-0.25rem);
  }
}
</style>
