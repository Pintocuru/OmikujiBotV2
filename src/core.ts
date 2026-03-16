// src/core.ts - 修正後
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import '../assets/styles/font.css'
import '../assets/styles/DaisyUiAllObs.css'

function createBaseApp(AppComponent: any) {
  const pinia = createPinia()
  const app = createApp(AppComponent)

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

// MainGenerator用：OneSDKを動的importで読む（静的importを排除）
export async function createAppOneSDK(AppComponent: any) {
  const app = createBaseApp(AppComponent)

  const OneSDK = (await import('@onecomme.com/onesdk')).default
  if (!OneSDK) {
    console.error('OneSDK が読み込まれていません')
    return
  }
  OneSDK.ready().then(() => app.mount('#App'))
}

// ConfigMaker用：OneSDKへの依存ゼロ
export function createAppNotOneSDK(AppComponent: any) {
  const app = createBaseApp(AppComponent)
  app.mount('#App')
}
