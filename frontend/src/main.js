import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'

// Import Ant Design and Global Style resets
import 'ant-design-vue/dist/reset.css'
import './style.css'

const app = createApp(App)
app.use(Antd)
app.use(router)
app.mount('#app')
