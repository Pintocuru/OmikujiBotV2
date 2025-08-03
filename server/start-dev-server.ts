// server/start-dev-server.ts
import { startDevApiServer } from './dev-api';

// 開発用APIサーバーを起動
const server = startDevApiServer();

if (server) {
 console.log('✅ Development API server started successfully');
} else {
 console.error('❌ Failed to start development API server');
 process.exit(1);
}

// Ctrl+Cでの終了処理
process.on('SIGINT', () => {
 console.log('\n👋 Shutting down development API server...');
 if (server) {
  server.close(() => {
   console.log('✅ Development API server closed');
   process.exit(0);
  });
 } else {
  process.exit(0);
 }
});
