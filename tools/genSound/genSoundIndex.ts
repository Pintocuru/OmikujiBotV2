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
const outPath = path.resolve(packageRoot, 'src/Toolkit/sounds/soundMap.ts')

// ✅ 再帰的にファイルを収集
function getAllSoundFiles(baseDir: string): string[] {
  const entries = fs.readdirSync(baseDir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllSoundFiles(fullPath))
    } else if (/\.(mp3|ogg|wav)$/i.test(entry.name)) {
      const relPath = path.relative(dir, fullPath).replace(/\\/g, '/')
      files.push(relPath)
    }
  }

  return files
}

const files = getAllSoundFiles(dir)

// 例: ['決定ボタンを押す12.mp3', 'sub/bgm1.mp3', 'se/click.mp3']

const imports = files.map((f, i) => `import s${i} from '@assets/source/sounds/${f}'`).join('\n')

const exports = `
export const soundMap: Record<string, string> = {
${files
  .map((f, i) => {
    const base = path.basename(f, path.extname(f))
    return `  ${JSON.stringify(base)}: s${i},`
  })
  .join('\n')}
}

export const soundList = Object.keys(soundMap)
`

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, `${imports}\n\n${exports}\n`)
console.log('✅ sound index generated.')
