<template>
  <div class="mod-item" :class="{ required: data.required }">

    <!-- 模组图标 -->
    <div class="mod-icon" :data-t="iconText"></div>

    <!-- 模组信息 -->
    <div class="mod-info">
      <div class="mod-name">
        <span v-text="primaryName"></span>
        <span v-show="secondaryName">（{{ secondaryName }}）</span>
      </div>
      <div class="mod-desc">{{ data.description || '...' }}</div>
      <div class="mod-version">
        <span v-show="data.version">V{{ data.version }}</span>
        <span v-show="data.update"> ({{ data.update }})</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({

  /** 模组信息 */
  data: {
    default() {
      return {};
    },
    type: Object
  },

});

/** 模组主要名称 */
const primaryName = computed(() => {
  return props.data.names?.[0] || 'Unknown';
});

/** 模组次要名称 */
const secondaryName = computed(() => {
  return props.data.names?.[1] || '';
});

/** 模组图标文本 */
const iconText = computed(() => {
  return String(primaryName.value).substring(0, 2).toUpperCase();
});
</script>

<style lang="less" scoped>
.mod-item {
  display: flex;
  position: relative;
  padding: var(--block-padding);
  border-radius: var(--block-radius);
  background-color: #FFF;
  font-size: 1rem;

  &:not(:first-child) {
    margin-top: var(--block-margin);
  }

  &.required::before {
    content: "";
    display: block;
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    background-color: var(--color-red);
    font-size: 0.5rem;
  }
}

.mod-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
  margin-right: var(--block-margin);
  width: 5em;
  height: 5em;
  border-radius: calc(var(--block-radius) * 1.5);
  background-color: var(--color-gray-light);
  color: #D2D2D2;

  &&::after {
    content: attr(data-t);
    font-size: 2.5em;
    font-weight: bold;
  }
}

.mod-info {
  width: 0;
  flex-grow: 1;

  > div:not(:first-child) {
    margin-top: 0.375em;
  }
}

.mod-name {
  font-size: 1.25em;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mod-desc {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  height: calc(2em * var(--line-height));
  overflow: hidden;
  text-overflow: ellipsis;
}

.mod-version {
  height: calc(1em * var(--line-height));
  font-size: 0.875em;
  opacity: 0.8;
}
</style>
