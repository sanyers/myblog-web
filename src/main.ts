import { createApp } from 'vue'
import './assets/font/iconfont.css'
import './style.less'
import App from './App.vue'
import router from './router'
import i18n from './i18n/index'
import naive from './plugins/naive-ui'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(naive)

app.mount('#app')