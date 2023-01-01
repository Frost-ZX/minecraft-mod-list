# Minecraft Mod List

用于编写相关配置文件后，展示 Minecraft 客户端中的模组名称、模组版本以及模组依赖关系等信息。

## 使用方法

### config.js

该文件为主配置文件，用于配置列表信息、模组类型信息等。

```javascript
window['APP_CONFIG'] = {

  // 列表作者、维护人员名称，以“,”分隔
  LIST_AUTHOR: '',

  // 列表版本、更新日期
  LIST_VERSION: '',

  // 导航链接配置
  NAV_LINKS: [
    {
      label: '', // 链接标题
      url: '',   // 链接地址
    },
    ...
  ],

  // 指定模组类型及其配置文件
  MOD_TYPES: {
    // 模组类型项，建议将属性名设为与“key”一致
    MODS_REQUIRED: {
      // 列表配置文件路径，例如：data/mods_required.js
      file: '',
      // 模组类型 key，例如：MODS_REQUIRED
      key: 'MODS_REQUIRED',
      // 模组类型名称，例如：必需模组
      label: '',
      // 是否为必需模组
      required: true,
    },
    ...
  },

};
```

### data/*.js

该文件为 `config.js` 中指定的模组列表配置文件。

以模组类型 `MODS_REQUIRED` 为例：

```javascript
window["MODS_REQUIRED"] = [
  // 模组信息项
  {
    // 作者名称列表
    authors: [
      "Example",
    ],
    // 前置模组 ID 列表
    dependencies: {
      // 可选前置模组
      optional: [],
      // 必需前置模组
      required: [],
    },
    // 模组简介
    description: "示例模组。",
    // 文件名称
    file: "example_1.0.0.jar",
    // 模组 ID
    id: "example_mod",
    // 许可证类型
    license: "MIT",
    // 相关链接
    links: [
      "http://www.example.com/",
    ],
    // 模组名称（主要、次要）
    names: [
      "Primary Name",
      "次要名称",
    ],
    // 更新时间
    update: "2022-01-01",
    // 模组版本
    version: "1.0.0",
  },
  ...
];
```

配置信息中部分属性为可选，若不填写则不展示。

## 使用的框架和库

- [Element Plus](https://element-plus.org/)
- [Material Design Icons](https://materialdesignicons.com/)
- [ress](https://github.com/filipelinhares/ress)
- [Vue 3](https://cn.vuejs.org/)

## 相关命令

初始化

```text
pnpm install
```

启动开发服务器

```text
pnpm run dev
```

打包

```text
pnpm run build
```

启动预览服务器

```text
pnpm run preview
```
