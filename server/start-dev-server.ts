// server/start-dev-server.ts
import { startDevApiServer } from './dev-api'
import { spawn } from 'child_process'

// API サーバー起動
const server = startDevApiServer()

if (server) {
  console.log('✅ Development API server started successfully')
} else {
  console.error('❌ Failed to start development API server')
  process.exit(1)
}

//  Vite 起動
console.log('🚀 Starting Vite dev server...')
const vite = spawn('vite', [], { stdio: 'inherit', shell: true })

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`)
})

// Ctrl+C 終了処理
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down development servers...')

  // API サーバー停止
  if (server) {
    server.close(() => {
      console.log('✅ Development API server closed')
    })
  }

  // Vite 停止
  vite.kill('SIGINT')

  setTimeout(() => process.exit(0), 300)
})
