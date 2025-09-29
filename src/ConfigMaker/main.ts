// src\ConfigMaker\main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import 'vue-sonner/style.css'
import '../../assets/styles/DaisyUiAllObs.css'

async function initApp() {
  try {
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
    // アプリをマウント
    app.use(pinia)
    app.use(MotionPlugin)
    app.mount('#App')
  } catch (error) {
    console.error('アプリケーションの初期化に失敗:', error)
  }
}
initApp() // アプリケーションの初期化
