/**
 * @typedef  {object} NavLinkItem
 * @property {string} label 链接名称
 * @property {string} url   链接地址
 */

/** @typedef {NavLinkItem[]} NavLinkList */

/**
 * @typedef  {object}   ModInfoItem
 * @property {string[]} authors      作者名称列表
 * @property {object}   dependencies 前置模组 ID 列表
 * @property {string[]} dependencies.optional
 * @property {string[]} dependencies.required
 * @property {string}   description  模组简介
 * @property {string}   file         模组文件名
 * @property {string}   id           模组 ID
 * @property {License}  license      许可证
 * @property {string[]} links        模组链接列表
 * @property {string[]} names        模组名称（主要、次要）
 * @property {string}   update       更新日期
 * @property {string}   version      模组版本
 * @property {object}   [dependents] 被依赖模组 ID 列表（处理后生成）
 * @property {string[]} [dependents.optional]
 * @property {string[]} [dependents.required]
 * @property {string}   [fullName]   模组名称（处理后生成）
 * @property {boolean}  [required]   是否必需（处理后生成）
 * @property {string}   [typeName]   类型名称（处理后生成）
 */

/** @typedef {ModInfoItem[]} ModInfoList */

/**
 * @typedef  {object}  ModTypeItem
 * @property {string}  file     JavaScript 文件路径
 * @property {string}  key      在 `window` 对象中的 key
 * @property {string}  label    模组类型名称
 * @property {boolean} required 是否为必需模组
 */

/** @typedef {Object.<string, ModTypeItem>} ModTypeList */

export default {};
