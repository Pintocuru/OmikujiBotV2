// src/apps/editor/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import 'vue-sonner/style.css'
import '../../assets/styles/DaisyUiDark.css'

async function initApp() {
  try {
    const pinia = createPinia()
    const app = createApp(App)
    // グローバルエラーハンドリング
    app.config.errorHandler = (err, instance, info) => {
      console.error('グローバルエラー:', err)
      console.error('コンポーネント:', instance)
      console.error('エラー情報:', info)
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
