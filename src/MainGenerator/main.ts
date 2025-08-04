// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import '../../../../shared/styles/TailwindCSS.css';
import '../../assets/styles.css';
import OneSDK from '@onecomme.com/onesdk';

// createApp
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
  OneSDK.ready().then(() => app.mount('#App'));
 } catch (err) {
  console.error('アプリケーションの初期化に失敗:', err);
 }
}
initApp();
