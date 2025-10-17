// tools\genSound\genSoundIndex.ts
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// .env からrootを取得
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../../.env.development')
dotenv.config({ path: envPath })
if (!process.env.PACKAGE_ROOT) throw new Error('.envファイルが読めないみたい')
const packageRoot = process.env.PACKAGE_ROOT

const dir = path.resolve(packageRoot, 'assets/source/sounds')
const files = fs.readdirSync(dir).filter((f) => /\.(mp3|ogg|wav)$/.test(f))

const imports = files.map((f, i) => `import s${i} from '@assets/sound/${f}'`).join('\n')

const exports = `export const soundMap = {\n${files
  .map((f, i) => `  "${f.replace(/\.\w+$/, '')}": s${i},`)
  .join('\n')}\n}`

fs.writeFileSync('src/Toolkit/sounds/index.ts', `${imports}\n\n${exports}\n`)
console.log('✅ sound index generated.')
