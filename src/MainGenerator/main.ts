// src\MainGenerator\main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import '../../assets/styles/styles.css'
import '../../assets/styles/DaisyUiAll.css'
import OneSDK from '@onecomme.com/onesdk'

// createApp
const pinia = createPinia()
const app = createApp(App)
// グローバルエラーハンドリング
app.config.errorHandler = (err, instance, info) => {
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
    // OneSDK > App の順にマウント
    app.use(pinia)
    app.use(MotionPlugin)
    OneSDK.ready().then(() => app.mount('#App'))
  } catch (err) {
    console.error('アプリケーションの初期化に失敗:', err)
  }
}
initApp()
