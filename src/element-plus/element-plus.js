// Element Plus
// https://element-plus.gitee.io/

import ElementPlus from 'element-plus';
import zhCN from 'element-plus/es/locale/lang/zh-cn';

import 'element-plus/dist/index.css';
import './element-plus.scss';

/** @param { import('vue').App<Element> } app */
export default function init(app) {
  return app.use(ElementPlus, {
    locale: zhCN,
    size: 'default',
    zIndex: 2000,
  });
}
