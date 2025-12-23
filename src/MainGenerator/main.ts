// src\MainGenerator\main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import '../../assets/styles/font.css'
import '../../assets/styles/DaisyUiAllObs.css'
import OneSDK from '@/types/onesdk-shim'

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

// アプリケーションの初期化
function initApp() {
  try {
    if (!OneSDK) throw new Error('OneSDK が読み込まれていません')
    app.use(pinia)
    app.use(MotionPlugin)
    OneSDK.ready().then(() => app.mount('#App'))
  } catch (err) {
    console.error('アプリケーションの初期化に失敗:', err)
    throw err
  }
}
initApp()
