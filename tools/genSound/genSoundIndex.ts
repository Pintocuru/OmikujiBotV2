// tools/genSound/genSoundIndex.ts
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../../.env.development')
dotenv.config({ path: envPath })
if (!process.env.PACKAGE_ROOT) throw new Error('.envファイルが読めないみたい')
const packageRoot = process.env.PACKAGE_ROOT

const dir = path.resolve(packageRoot, 'assets/sounds')
const outPath = path.resolve(packageRoot, 'src/Toolkit/sounds/soundMap.ts')

// 再帰的に収集
function getAllSoundFiles(baseDir: string): string[] {
  const entries = fs.readdirSync(baseDir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllSoundFiles(fullPath))
    } else if (/\.(mp3|ogg)$/i.test(entry.name)) {
      const relPath = path.relative(dir, fullPath).replace(/\\/g, '/')
      files.push(relPath)
    }
  }

  return files
}

// FreeSound / RpgVoice のみ抽出
const allFiles = getAllSoundFiles(dir).filter((f) => /^FreeSound\//.test(f) || /^RpgVoice\//.test(f))

// import名生成
const imports: string[] = []
const freeEntries: string[] = []
const rpgEntries: string[] = []
let fCount = 0
let rCount = 0

for (const f of allFiles) {
  const isFree = f.startsWith('FreeSound/')
  const isRpg = f.startsWith('RpgVoice/')
  if (!isFree && !isRpg) continue

  const varName = isFree ? `f${fCount++}` : `r${rCount++}`
  imports.push(`import ${varName} from '@assets/sounds/${f}'`)

  const base = path.basename(f, path.extname(f))
  if (isFree) {
    freeEntries.push(`  ${JSON.stringify(base)}: ${varName},`)
  } else {
    rpgEntries.push(`  ${JSON.stringify(base)}: ${varName},`)
  }
}

const exports = `
export const soundMap: Record<string, string> = {
${freeEntries.join('\n')}
}

export const rpgVoiceMap: Record<string, string> = {
${rpgEntries.join('\n')}
}

export const soundList = Object.keys(soundMap)
export const rpgVoiceList = Object.keys(rpgVoiceMap)
`

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, `${imports.join('\n')}\n\n${exports}\n`)
console.log('✅ sound index generated.')
