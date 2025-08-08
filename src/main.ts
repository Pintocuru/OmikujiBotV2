// src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './DevApp.vue';
import 'vue-sonner/style.css';
import '../assets/styles.css';
import '../assets/DaisyUiDark.css';
import OneSDK from '@onecomme.com/onesdk';

// createApp
const pinia = createPinia();
const app = createApp(App);
app.config.errorHandler = (err, instance, info) => {
 console.error('グローバルエラー:', err);
 console.error('コンポーネント:', instance);
 console.error('エラー情報:', info);
};

// アプリケーションの初期化
function initApp() {
 try {
  // OneSDK > App の順にマウント
  app.use(pinia);
  OneSDK.ready().then(() => app.mount('#App'));
 } catch (err) {
  console.error('アプリケーションの初期化に失敗:', err);
 }
}
initApp();
