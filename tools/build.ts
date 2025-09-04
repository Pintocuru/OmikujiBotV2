// build.ts
import { WebpackBuilder } from '@shared/utils/webpackBuild/buildMain'
import { BuildTarget, SystemCommonData } from '@shared/utils/webpackBuild/buildTypes'
import { alias } from '../vite.config'
import packageJson from '../package.json'
import { createShimsVue } from './buildOptions/CreateOmikujiData'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// 各設定ファイルをインポート
import ReimuMarisaProject from './packages/full/ReimuMarisa'
import ReimuMarisaMateProject from './packages/full/ReimuMarisaMate'
import EveryoneZundaProject from './packages/full/EveryoneZunda'
import DivaMetanProject from './packages/full/DivaMetan'
import HondaJankenProject from './packages/solo/HondaJanken'
import percent_DoraProject from './packages/solo/5percent_Dora'

// .env からrootを取得
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env.development')
dotenv.config({ path: envPath })
if (!process.env.PACKAGE_ROOT) throw new Error('.envファイルが読めないみたい')
const packageRoot = process.env.PACKAGE_ROOT

/**
 * ビルド設定リスト
 */
const buildTargets: BuildTarget[] = [
  //  { project: 'ReimuMarisa', accessLevels: ['basic', 'pro'] },
  //  { project: 'ReimuMarisaMate', accessLevels: ['basic', 'pro'] },
  //  { project: 'EveryoneZunda', accessLevels: ['basic', 'pro'] },
  //  { project: 'DivaMetan', accessLevels: ['basic', 'pro'] },
  { project: 'HondaJanken', accessLevels: ['basic'] }, // HondaJanken
  // { project: '5percent_Dora', accessLevels: ['basic'] }, // 5percent_Dora
]

/**
 * ビルド実行
 */
;(async () => {
  try {
    // 前処理:shims-vue.d.ts を生成
    createShimsVue(packageRoot)

    // メインビルド処理
    const systemCommonData: SystemCommonData = {
      alias,
      author: packageJson.author,
      description: packageJson.description,
      generatorName: packageJson.name,
      generatorVersion: packageJson.version,
      dataVersion: packageJson.dataVersion,
    }
    const builder = new WebpackBuilder(systemCommonData)

    // 新しいバージョンができた場合、ここに記載すること
    builder.registerProject(ReimuMarisaProject(packageRoot))
    builder.registerProject(ReimuMarisaMateProject(packageRoot))
    builder.registerProject(EveryoneZundaProject(packageRoot))
    builder.registerProject(DivaMetanProject(packageRoot))
    builder.registerProject(HondaJankenProject(packageRoot))
    builder.registerProject(percent_DoraProject(packageRoot))

    // ビルド
    await builder.buildTargets(buildTargets)

    console.log('[Build] All builds completed successfully!')
  } catch (error) {
    console.error('[Build] Build failed:', error)
    process.exit(1)
  }
})()
