// src/MainGenerator/main.ts
import App from './App.vue'
import { createAppOneSDK } from '../core'

window.OmikujiBot = window.OmikujiBot ?? {}

window.OmikujiBot.mountMainGenerator = () => {
  createAppOneSDK(App)
}
