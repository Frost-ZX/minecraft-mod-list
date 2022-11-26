const CONFIG_DEFAULT = {

  APP_AUTHOR: 'Frost-ZX',
  APP_VERSION: '1.0.0',

  LIST_AUTHOR: '',
  LIST_UPDATE: '',

  MOD_TYPES: {},

};

const CONFIG_USER = window['APP_CONFIG'] || {};

/** @type {typeof CONFIG_DEFAULT} */
export const APP_CONFIG = {
  ...CONFIG_DEFAULT,
  ...CONFIG_USER,
};
