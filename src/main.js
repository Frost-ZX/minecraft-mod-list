import { createApp } from 'vue';

// CSS
import 'ress/ress.css';
import '@mdi/font/css/materialdesignicons.css'
import '/src/assets/css/main.less';

// 组件库
import initElementPlus from '/src/element-plus/element-plus';

// App
import App from './App.vue';

const app = createApp(App);

initElementPlus(app).mount('#app');
