<template>

  <!-- 侧边栏 -->
  <div class="app-aside">

    <!-- 信息栏 -->
    <div class="aside-block list-info">
      <div class="block-title">列表信息</div>
      <div class="block-content">
        <p>
          <span class="label">列表编辑</span>
          <span class="text">{{ APP_CONFIG.LIST_AUTHOR || '无' }}</span>
        </p>
        <p>
          <span class="label">列表版本</span>
          <span class="text">{{ APP_CONFIG.LIST_VERSION || '无' }}</span>
        </p>
        <p>
          <span class="label">模组数量</span>
          <span class="text">{{ state.modList.length }}</span>
        </p>
      </div>
    </div>

    <!-- 页面导航 -->
    <div class="aside-block pages-nav">
      <div class="block-title">页面导航</div>
      <div class="block-content">

        <!-- 固定链接 -->
        <el-button
          type="primary"
          size="small"
          disabled
          plain
        >关于</el-button>

        <!-- 动态链接 -->
        <el-button
          v-for="(item, index) in APP_CONFIG.NAV_LINKS"
          :key="index"
          type="success"
          size="small"
          plain
          @click="openLink(item.url)"
        >{{ item.label }}</el-button>

      </div>
    </div>

    <!-- 模组类型列表 -->
    <div class="aside-block mod-types">
      <div class="block-title">模组类型</div>
      <div class="block-content">

        <el-checkbox
          v-model="state.checkAll"
          :border="true"
          :indeterminate="state.checkIndeterminate"
          @change="handleCheckAllChange"
        >全部</el-checkbox>

        <el-checkbox-group
          v-model="state.checkedTypes"
          @change="handleCheckItemsChange"
        >
          <el-checkbox
             v-for="(item, typeName) of mods.types"
            :key="typeName"
            :border="true"
            :label="typeName"
            class="mod-type-item"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>

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
        placeholder="搜索模组名称"
        :clearable="true"
        @blur="searchModList"
        @keydown.enter="searchModList"
      >
        <template #prefix>
          <span
            class="mdi mdi-magnify"
            @click="searchModList"
          ></span>
        </template>
      </el-input>
    </div>

    <!-- 模组项目列表 -->
    <div class="mod-list">
      <mod-item
        v-for="item of state.modList"
        :key="item.id"
        :data="item"
        @click="toggleDetail(item)"
      />
    </div>

  </div>

  <!-- 返回顶部 -->
  <to-top />

  <!-- 模组详情 -->
  <el-drawer
    v-model="state.showDetail"
    class="mod-detail"
    direction="rtl"
    append-to-body
  >
    <template #header>
      <h4>模组详情</h4>
    </template>
    <template #default>
      <el-descriptions v-if="modDetail" :column="1">

        <el-descriptions-item v-if="modDetail.fullName" label="模组 ID">
          <i>{{ modDetail.id }}</i>
        </el-descriptions-item>

        <el-descriptions-item v-if="modDetail.fullName" label="模组名称">
          <i>{{ modDetail.fullName }}</i>
        </el-descriptions-item>

        <el-descriptions-item v-if="modDetail.description" label="模组简介">
          <i>{{ modDetail.description }}</i>
        </el-descriptions-item>

        <el-descriptions-item
          v-if="modDetail.links"
          label="模组链接"
        >
          <el-link
            v-for="(url, index) in modDetail.links"
            :key="index"
            :href="url"
            :underline="false"
            target="_blank"
            type="primary"
          >{{ url }}</el-link>
        </el-descriptions-item>

        <el-descriptions-item v-if="modDetail.version" label="模组版本">
          <i>{{ modDetail.version }}</i>
        </el-descriptions-item>

        <el-descriptions-item v-if="modDetail.authors" label="模组作者">
          <i>{{ modDetail.authors.join(', ') }}</i>
        </el-descriptions-item>

        <el-descriptions-item v-if="modDetail.license" label="许可证">
          <i>{{ modDetail.license }}</i>
        </el-descriptions-item>

        <el-descriptions-item v-if="modDetail.update" label="更新时间">
          <i>{{ modDetail.update }}</i>
        </el-descriptions-item>

        <el-descriptions-item v-if="modDetail.file" label="文件名称">
          <i>{{ modDetail.file }}</i>
        </el-descriptions-item>

        <el-descriptions-item label="是否必需">
          <i>{{ modDetail.required ? '是' : '否' }}</i>
        </el-descriptions-item>

      </el-descriptions>
    </template>
  </el-drawer>

</template>

<script setup>
import { computed, ref, shallowReactive, onMounted } from 'vue';

import { APP_CONFIG } from './assets/js/config';
import { $message, loadScript } from './assets/js/utils';

import ModItem from './components/ModItem.vue';
import ToTop from './components/ToTop.vue';

const state = shallowReactive({

  /** 选中全部模组类型 */
  checkAll: false,

  /** 选中部分模组类型 */
  checkIndeterminate: false,

  /**
   * @desc 已选中的模组类型名称
   * @type {string[]}
   */
  checkedTypes: [],

  /** 当前显示的模组列表 */
  modList: [],

  /** 搜索关键词 */
  searchKeyword: '',

  /** 显示模组详情 */
  showDetail: false,

});

const mods = shallowReactive({

  /** 模组项目列表 */
  list: [],

  /** 模组类型列表 */
  types: {},

});

/**
 * @desc 当前显示的模组详情信息
 * @type { import('vue').Ref<object> }
 */
const modDetail = ref(null);

/** 模组类型名称列表 */
const modTypeNames = computed(() => {
  const names = [];
  const types = mods.types;
  for (let typeName in types) {
    names.push(typeName);
  }
  return names;
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
          let pName = modInfo.names?.[0] || 'Unknown';
          let sName = modInfo.names?.[1] || '';
          if (!usedIds.includes(id)) {
            // 记录模组 ID
            usedIds.push(id);
            // 更新模组信息
            modInfo.fullName = (pName + (sName ? `（${sName}）` : ''));
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

/** 处理模组类型全选 */
function handleCheckAllChange(isAll = false) {
  const checked = [];
  if (isAll) {
    checked.push.apply(checked, modTypeNames.value);
  }
  if (state.checkAll !== isAll) {
    state.checkAll = isAll;
  }
  state.checkedTypes = checked;
  state.checkIndeterminate = false;
  updateModList();
}

/** 处理模组类型选择 */
function handleCheckItemsChange(names = []) {
  console.log(111);
  const checked = names.length;
  const itemSum = modTypeNames.value.length;
  state.checkAll = (checked === itemSum);
  state.checkIndeterminate = (checked > 0 && checked < itemSum);
  updateModList();
}

/**
 * @description 在新窗口中打开链接
 * @param {string} url
 */
function openLink(url) {
  if (url && typeof url === 'string') {
    window.open(url, '_blank');
  } else {
    $message({
      message: '打开失败：链接地址无效',
      type: 'error',
    });
  }
}

/** 搜索模组 */
function searchModList() {
  updateModList();
}

/** 切换模组详情显示 */
function toggleDetail(info = null) {
  if (info) {
    modDetail.value = info;
    state.showDetail = true;
  } else {
    modDetail.value = null;
    state.showDetail = false;
  }
}

/** 更新模组列表内容 */
function updateModList() {

  const all = state.checkAll;
  const types = state.checkedTypes;
  const kw = state.searchKeyword.toLocaleLowerCase();

  state.modList = mods.list.filter((item) => {
    const { fullName = '', type = '' } = item;
    return (
      (all || types.includes(type)) &&
      (!kw || fullName.toLocaleLowerCase().includes(kw))
    );
  });

}

onMounted(() => {

  // 初始化
  initModList().then((success) => {
    success && handleCheckAllChange(true);
  });

});
</script>

<style lang="less">
// 侧边栏
.app-aside {
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

// 页面导航
.pages-nav {
  .el-button {
    margin: 0.25em;
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
  .el-checkbox {
    display: flex;
    margin: 0;
    width: 100%;
  }

  .el-checkbox__label {
    flex-grow: 1;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

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

  .mod-type-item {
    margin-top: 0.5rem;
  }
}

// 内容区域
.app-content {
  margin-left: var(--block-margin);
  width: calc(100% - 16rem - var(--block-margin));
  max-width: 60rem;

  > div {
    width: 100%;
  }
}

// 操作栏
.actions {
  padding: var(--block-padding);
  box-shadow: var(--block-shadow);
  border-radius: var(--block-radius);
  background-color: #FFF;

  .search-input {
    max-width: 20rem;

    .el-input__prefix {
      font-size: 1.125rem;
      cursor: pointer;
    }
  }
}

// 模组列表
.mod-list {
  margin-top: var(--block-margin);
}

// 模组详情
.mod-detail {
  width: 32rem !important;
  max-width: 100%;

  .el-drawer__header,
  .el-drawer__body {
    text-align: left;
  }

  .el-drawer__header {
    margin-bottom: 0.5rem;
  }

  .el-descriptions__cell {
    display: flex;
  }

  .el-descriptions__label {
    flex-shrink: 0;
    width: 4.5em;
    text-align: right;
  }

  .el-descriptions__content {
    flex-grow: 1;
    user-select: text;

    i {
      font-style: normal;
    }
  }

  .el-link {
    word-break: break-all;
  }
}
</style>
