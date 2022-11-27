<template>

  <!-- 侧边栏 -->
  <div class="app-aside">

    <!-- 信息栏 -->
    <div class="aside-block list-info">
      <div class="block-title">列表信息</div>
      <div class="block-content">
        <p>
          <span class="label">列表作者</span>
          <span class="text">{{ APP_CONFIG.LIST_AUTHOR || '无' }}</span>
        </p>
        <p>
          <span class="label">列表版本</span>
          <span class="text">{{ APP_CONFIG.LIST_VERSION || '无' }}</span>
        </p>
      </div>
    </div>

    <!-- 模组类型列表 -->
    <div class="aside-block mod-types">
      <div class="block-title">模组类型</div>
      <div class="block-content">
        <el-radio-group v-model="state.currModType">
          <el-radio
            :border="true"
            :label="'ALL'"
            class="mod-type-item"
          >全部</el-radio>
          <el-radio
            v-for="(item, typeName) of mods.types"
            :key="typeName"
            :border="true"
            :label="typeName"
            class="mod-type-item"
          >{{ item.label }}</el-radio>
        </el-radio-group>
      </div>
    </div>

  </div>

  <!-- 内容区域 -->
  <div class="app-content">

    <!-- 操作 -->
    <div class="actions">
      <el-input
        v-model="state.searchKeyword"
        class="search-input"
        placeholder="搜索..."
        disabled
      >
        <template #prefix>
          <span class="mdi mdi-magnify"></span>
        </template>
      </el-input>
    </div>

    <!-- 模组项目列表 -->
    <div class="mod-list">
      <mod-item
        v-for="item of state.modList"
        :key="item.id"
        :data="item"
      />
    </div>

  </div>

</template>

<script setup>
import { shallowReactive, watch, onMounted } from 'vue';

import { APP_CONFIG } from './assets/js/config';
import { $message, loadScript } from './assets/js/utils';

import ModItem from './components/ModItem.vue';

const state = shallowReactive({

  /** 当前模组类型名称 */
  currModType: 'ALL',

  /** 当前显示的模组列表 */
  modList: [],

  /** 搜索关键词 */
  searchKeyword: '',

});

const mods = shallowReactive({

  /** 模组项目列表 */
  list: [],

  /** 模组类型列表 */
  types: {},

});

// 切换模组类型
watch(() => state.currModType, (type) => {
  updateModList(type);
});

/** 初始化模组列表 */
async function initModList() {
  try {

    const { MOD_TYPES } = APP_CONFIG;

    const modList = [];
    const modTypes = {};

    for (let typeName in MOD_TYPES) {

      let typeInfo = MOD_TYPES[typeName];
      let jsURL = typeInfo.file; // JavaScript 文件地址
      let jsKey = typeInfo.key;  // 在 `window` 对象中的属性名

      let load = await loadScript(jsURL);
      let list = null;

      // 处理类型信息默认值
      typeInfo.label = typeInfo.label ?? '未知';
      typeInfo.required = typeInfo.required ?? false;

      if (load.success) {
        list = window[jsKey];
      } else {
        let { message: m, url: u } = load;
        $message({
          message: `加载失败：${m} - ${String(u)}`,
          type: 'error',
        });
      }

      if (Array.isArray(list)) {

        let isRequired = typeInfo.required;
        let usedIds = [];

        // 处理模组列表数据
        for (let i = list.length - 1; i >= 0; i--) {
          let modInfo = list[i];
          let id = modInfo.id || 'unknown';
          if (!usedIds.includes(id)) {
            // 记录模组 ID
            usedIds.push(id);
            // 同步类型信息
            modInfo.required = isRequired;
            modInfo.type = typeName;
          } else {
            // 提示重复信息
            $message({
              duration: 3000,
              message: `存在重复的模组信息，ID：${id}`,
              type: 'warning',
            });
            // 去除重复项
            list.splice(i, 1);
          }
        }

        // 写入列表和类型信息
        modList.push.apply(modList, list);
        modTypes[typeName] = typeInfo;

      }

    }

    // 更新数据
    mods.list = modList;
    mods.types = modTypes;

    return true;

  } catch (error) {
    console.error('初始化模组列表失败：');
    console.error(String(error));
    return false;
  }
}

/**
 * @description 切换模组列表
 * @param {string} type 模组类型名称
 */
function updateModList(type = 'ALL') {
  if (type === 'ALL') {
    // [全部模组]
    state.modList = mods.list;
  } else {
    // [指定类型]
    state.modList = mods.list.filter((item) => {
      return (item.type === type);
    });
  }
}

onMounted(() => {

  initModList().then((success) => {
    success && updateModList();
  });

});
</script>

<style lang="less">
// 侧边栏
.app-aside {
  flex-shrink: 0;
  margin-right: var(--block-margin);
  width: 16rem;

  .aside-block {
    padding: var(--block-padding);
    box-shadow: var(--block-shadow);
    border-radius: var(--block-radius);
    background-color: #FFF;

    &:not(:first-child) {
      margin-top: var(--block-margin);
    }
  }

  .block-title {
    margin-bottom: 1rem;
    font-size: 1.125rem;
    font-weight: bold;
  }

  .block-content {
    font-size: 0.875rem;
  }
}

// 信息栏
.list-info {
  p {
    display: flex;

    &:not(:first-child) {
      margin-top: 0.5em;
    }
  }

  .label {
    flex-shrink: 0;
    text-align: right;

    &::after {
      content: "\FF1A";
    }
  }

  .text {
    width: 0;
    flex-grow: 1;
  }
}

// 模组类型列表
.mod-types {
  .el-radio {
    margin: 0;
    width: 100%;

    &:not(:first-child) {
      margin-top: 0.5rem;
    }
  }

  .el-radio-group {
    flex-direction: column;
    width: 100%;
  }
}

// 内容区域
.app-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 0;
  max-width: 60rem;

  > div {
    width: 100%;
  }
}

// 操作栏
.actions {
  flex-shrink: 0;
  padding: var(--block-padding);
  box-shadow: var(--block-shadow);
  border-radius: var(--block-radius);
  background-color: #FFF;

  .search-input .el-input__prefix {
    font-size: 1.125rem;
  }
}

// 模组列表
.mod-list {
  flex-grow: 1;
  margin-top: var(--block-margin);
  height: 0;
  overflow-y: scroll;
}
</style>
