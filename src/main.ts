// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './DevApp.vue'
import ErrorHandler from '@shared/utils/ErrorHandler/ErrorHandler'
import '../assets/styles/font.css'
import '../assets/styles/DaisyUiAllObs.css'
import OneSDK from '@onecomme.com/onesdk'

// createApp
const pinia = createPinia()
const app = createApp(App)
// グローバルエラーハンドリング
app.config.errorHandler = (err, instance) => {
  console.error('エラー:', err)
  if (instance) {
    console.log('props:', instance.$props)
    console.log('data:', instance.$data)
    console.log('el:', instance.$el)
  }
}

function initApp() {
  try {
    if (!OneSDK) throw new Error('OneSDK が読み込まれていません')

    app.use(ErrorHandler)
    app.use(pinia)
    app.use(MotionPlugin)
    OneSDK.ready().then(() => app.mount('#App'))
  } catch (err) {
    console.error('アプリケーションの初期化に失敗:', err)
    throw err
  }
}
initApp()
