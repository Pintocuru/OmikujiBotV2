// server/constants.ts
import path from 'path'
import { fileURLToPath } from 'url'

// わんコメプラグインと同じ位置にするため、この位置から動かさないこと
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const SERVER_ROOT = path.join(__dirname)

export const DIR = {
  assets: path.join(SERVER_ROOT, '..', 'assets'),
  root: SERVER_ROOT,
}
