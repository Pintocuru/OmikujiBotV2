// build/build.ts
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { APP_VERSION, DATA_VERSION } from '@/version'
import { createViteAliases } from '../tools/viteConfig/createViteAliases'
import { buildPackages } from '../tools/viteBuild/buildPackages'
import type { SystemCommonData } from '../tools/viteBuild/types'
import { coreTargets, getAllProjects, packageTargets } from './buildProjects'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageRoot = path.resolve(__dirname, '..')

async function main(): Promise<void> {
  const system: SystemCommonData = {
    alias: createViteAliases(packageRoot),
    author: 'Pintocuru(せすじピンとしてます)',
    description: 'おみくじ付きBOTジェネレーター',
    generatorName: 'omikuji-bot',
    generatorVersion: APP_VERSION,
    dataVersion: DATA_VERSION,
  }

  console.log('[Check] Running vue-tsc...')
  execSync('npx vue-tsc --noEmit', { cwd: packageRoot, stdio: 'inherit' })

  await buildPackages({
    packageRoot,
    projects: getAllProjects(packageRoot),
    coreTargets,
    packageTargets,
    system,
  })

  console.log('[Build] All FULL packages completed successfully!')
}

main().catch((error: unknown) => {
  console.error('[Build] Build failed:', error)
  process.exitCode = 1
})
