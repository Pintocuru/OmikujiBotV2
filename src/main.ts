// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './DevApp.vue'
import ErrorHandler from '@shared/utils/ErrorHandler/ErrorHandler'
import '../assets/styles/font.css'
import '../assets/styles/DaisyUiAllObs.css'
import OneSDK from '@onecomme.com/onesdk/'

function initApp() {
  try {
    const pinia = createPinia()
    const app = createApp(App)

    app.use(ErrorHandler)
    app.use(pinia)
    app.use(MotionPlugin)
    OneSDK.ready().then(() => app.mount('#App'))
  } catch (err) {
    console.error('アプリケーションの初期化に失敗:', err)
  }
}
initApp()
