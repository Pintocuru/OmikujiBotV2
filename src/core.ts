// src/shared/core.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import OneSDK from '@onecomme.com/onesdk'
import '../assets/styles/font.css'
import '../assets/styles/DaisyUiAllObs.css'

// 共通の Vue アプリ生成ロジック
function createBaseApp(AppComponent: any) {
  const pinia = createPinia()
  const app = createApp(AppComponent)

  // 共通エラーハンドラ
  app.config.errorHandler = (err, instance) => {
    console.error('エラー:', err)
    if (instance) {
      console.log('props:', instance.$props)
      console.log('data:', instance.$data)
      console.log('el:', instance.$el)
    }
  }

  app.use(pinia)
  app.use(MotionPlugin)

  return app
}

// MainGenerator 用
export function createAppOneSDK(AppComponent: any) {
  const app = createBaseApp(AppComponent)

  if (!OneSDK) {
    console.error('OneSDK が読み込まれていません')
    return
  }
  OneSDK.ready().then(() => app.mount('#App'))
}

// ConfigMaker 用
export function createAppNotOneSDK(AppComponent: any) {
  const app = createBaseApp(AppComponent)
  app.mount('#App')
}
