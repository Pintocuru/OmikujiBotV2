// src/ConfigMaker/main.ts
import App from './App.vue'
import { createAppNotOneSDK } from '../core'

window.OmikujiBot = window.OmikujiBot ?? {}

window.OmikujiBot.mountConfigMaker = () => {
  createAppNotOneSDK(App)
}
