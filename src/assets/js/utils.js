import { ElMessage } from 'element-plus';

/** @typedef { import('vue').AppContext } AppContext */
/** @typedef { import('element-plus').MessageParams } MessageParams */

/**
 * @description 消息提示
 * @param {MessageParams} [opts]
 * @param {AppContext} [context]
 */
export function $message(opts = {}, context) {
  return ElMessage({
    duration: 2000,
    message: '',
    offset: 50,
    type: 'info',
    ...opts,
  }, context);
}

/**
 * @description 载入 JavaScript 脚本文件
 * @param   {string} url 脚本路径 / 地址
 * @returns {Promise<{ message: string, success: boolean, url: string }>}
 */
export function loadScript(url = '') {
  return new Promise((resolve) => {

    if (!url || typeof url !== 'string') {
      console.error('加载失败：参数错误');
      return resolve({
        message: '参数错误',
        success: false,
        url: null,
      });
    }

    const el = document.createElement('script');

    // 处理加载失败
    el.onerror = function () {
      resolve({
        message: '地址错误或网络异常',
        success: false,
        url: url,
      });
    };

    // 处理加载成功
    el.onload = function () {
      resolve({
        message: '加载成功',
        success: true,
        url: url,
      });
    };

    // 设置地址
    el.setAttribute('src', url);

    // 开始加载
    document.body.appendChild(el);

  });
}