import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/font_class/iconfont.css'
// 导入axios包
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.config.globalProperties.$http = axios
// 全局挂载消息提示框
app.provide('$message', ElementPlus)
app.provide('$confirm', ElementPlus)
app.component('tree-table', TreeTable)
app.mount('#app')
