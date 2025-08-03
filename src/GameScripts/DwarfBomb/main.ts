// src/main.ts
import { createApp } from 'vue';
import App from '@/components/Dev.vue';
import '@shared/styles/TailwindCSS.css';

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
  app.mount('#App');
 } catch (err) {
  console.error('アプリケーションの初期化に失敗:', err);
 }
}
initApp();
