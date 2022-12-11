/** @typedef { import('/src/jsdoc').NavLinkList } NavLinkList */
/** @typedef { import('/src/jsdoc').ModTypeList } ModTypeList */

const CONFIG_DEFAULT = {

  APP_AUTHOR: 'Frost-ZX',
  APP_VERSION: '1.0.0',

  LIST_AUTHOR: '',
  LIST_VERSION: '',

  /**
   * @desc 导航链接列表
   * @type {NavLinkList}
   */
  NAV_LINKS: [],

  /**
   * @desc 模组类型列表
   * @type {ModTypeList}
   */
  MOD_TYPES: {},

};

const CONFIG_USER = window['APP_CONFIG'] || {};

/** @type {typeof CONFIG_DEFAULT} */
export const APP_CONFIG = {
  ...CONFIG_DEFAULT,
  ...CONFIG_USER,
};
