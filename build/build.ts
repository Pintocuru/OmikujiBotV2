// build/build.ts
import { SystemCommonData } from '@shared/utils/webpackBuild/BuildTypes'
import { CreateShimsVue, RemoveShimsVue } from '@shared/utils/webpackBuild/utils/CreateShimsVue'
import { WebpackBuilder } from '@shared/utils/webpackBuild/WebpackBuilder'
import { APP_VERSION, DATA_VERSION } from '@/version'
import { alias } from '../vite.config'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import { coreTargets, getAllProjects, packageTargets } from './buildProjects'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.development') })
if (!process.env.PACKAGE_ROOT) throw new Error('.envファイルが読めないみたい')
const packageRoot = process.env.PACKAGE_ROOT

/**
 * 型チェック + ESLint を本番前チェックとして実行
 */
function runPreBuildChecks() {
  // dist削除
  cleanDist(packageRoot)

  // EsLint
  // console.log('[Check] Running ESLint...')
  // execSync('npx eslint src', { stdio: 'inherit' })

  // vue-tsc
  console.log('[Check] Running vue-tsc...')
  execSync('npx vue-tsc --noEmit', {
    stdio: 'inherit',
  })
  console.log('[Check] All checks passed')

  // shims-vue.d.ts を生成
  CreateShimsVue(packageRoot)
}

;(async () => {
  try {
    const systemCommonData: SystemCommonData = {
      alias,
      author: 'Pintocuru(せすじピンとしてます)',
      description: 'おみくじ付きBOTジェネレーター',
      generatorName: 'omikuji-bot',
      generatorVersion: APP_VERSION,
      dataVersion: DATA_VERSION,
    }

    const builder = new WebpackBuilder(systemCommonData)
    builder.registerProject(getAllProjects(packageRoot))

    // 型チェック + ESLint
    await builder.build({
      coreTargets,
      packageTargets,
      onBeforeCoreBuild: runPreBuildChecks,
    })

    // shims-vue.d.ts を削除
    RemoveShimsVue(packageRoot)

    console.log('[Build] All builds completed successfully!')
  } catch (error) {
    console.error('[Build] Build failed:', error)
    process.exit(1)
  }
})()

// 新しいバージョンをビルドする場合、dist フォルダをクリーンアップ
function cleanDist(root: string) {
  const distPath = path.join(root, 'dist')

  if (fs.existsSync(distPath)) {
    console.log(`[Clean] Removing dist: ${distPath}`)
    fs.rmSync(distPath, { recursive: true, force: true })
  }
}
