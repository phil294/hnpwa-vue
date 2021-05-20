import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index"
import { registerSW } from 'virtual:pwa-register'

createApp(App).use(router).mount('#app')

registerSW()
