import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/toggle-theme.js'
import './assets/base.css'

import ElementPlus from 'element-plus'

import { createApp } from 'vue'
import App from './App.vue';

const app = createApp(App);

app.use(ElementPlus);

app.mount('#app')
