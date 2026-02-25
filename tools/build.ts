//
import { CoreBuildTarget, SystemCommonData } from '@shared/utils/webpackBuild/BuildTypes'
import { CreateShimsVue } from '@shared/utils/webpackBuild/utils/CreateShimsVue'
import { WebpackBuilder } from '@shared/utils/webpackBuild/WebpackBuilder'
import { APP_VERSION, DATA_VERSION } from '@/version'
import { alias } from '../vite.config'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import { getAllProjects, packageTargets } from './packages'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.development') })
if (!process.env.PACKAGE_ROOT) throw new Error('.envファイルが読めないみたい')
const packageRoot = process.env.PACKAGE_ROOT

/**
 * コアビルド設定リスト
 * エディターを更新したら必ずビルドする基盤部分
 */
const coreTargets: CoreBuildTarget[] = [
  { project: 'OmikujiBot' }, // MainGenerator + ConfigMaker
  { project: 'OmikujiBotMain' }, // MainGenerator のみ
]

;(async () => {
  try {
    CreateShimsVue(packageRoot)

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

    await builder.build({ coreTargets, packageTargets })

    console.log('[Build] All builds completed successfully!')
  } catch (error) {
    console.error('[Build] Build failed:', error)
    process.exit(1)
  }
})()
