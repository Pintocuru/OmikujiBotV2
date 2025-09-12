// build.ts - 改良版
import { createShimsVue } from './buildOptions/CreateOmikujiData'
import { alias } from '../vite.config'
import { ImprovedWebpackBuilder } from '@shared/utils/webpackBuild/ImprovedWebpackBuilder'
import { BuildTarget, SystemCommonData, ProjectType } from '@shared/utils/webpackBuild/config/buildTypes'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// 各設定ファイルをインポート
import OmikujiBotProject from './packages/OmikujiBot'
import ReimuMarisaProject from './packages/full/ReimuMarisa'
import ReimuMarisaMateProject from './packages/full/ReimuMarisaMate'
import EveryoneZundaProject from './packages/full/EveryoneZunda'
import DivaMetanProject from './packages/full/DivaMetan'

import percent_DoraProject from './packages/solo/5percent_Dora'
import HondaJankenProject from './packages/solo/HondaJanken'
import CardStationProject from './packages/solo/CardStation'
import { APP_VERSION, DATA_VERSION } from '@/config/version'

// .env からrootを取得
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env.development')
dotenv.config({ path: envPath })
if (!process.env.PACKAGE_ROOT) throw new Error('.envファイルが読めないみたい')
const packageRoot = process.env.PACKAGE_ROOT

/**
 * ビルド設定リスト - プロジェクトタイプを明示的に指定
 */
const buildTargets: BuildTarget[] = [
  /**
   * core - 常にWebpackビルドが必要
   */
  { project: 'OmikujiBot', accessLevels: ['basic'], type: 'core' },

  /**
   * full
   */
  { project: 'EveryoneZunda', accessLevels: ['basic', 'basicJson', 'pro'], type: 'extension' },
  // { project: 'ReimuMarisa', accessLevels: ['basic', 'basicJson', 'pro'], type: 'extension' },
  // { project: 'ReimuMarisaMate', accessLevels: ['basic', 'basicJson', 'pro'], type: 'extension' },
  // { project: 'DivaMetan', accessLevels: ['basic', 'basicJson', 'pro'], type: 'extension' },

  /**
   * solo
   */
  // { project: '5percent_Dora', accessLevels: ['basic'], type: 'extension' },
  // { project: 'HondaJanken', accessLevels: ['basic', 'basicJson'], type: 'extension' },
  // { project: 'CardStation', accessLevels: ['basic', 'basicJson'], type: 'extension' },
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
      author: 'Pintocuru(せすじピンとしてます)',
      description: 'おみくじ付きBOTジェネレーター',
      generatorName: 'omikuji-bot',
      generatorVersion: APP_VERSION,
      dataVersion: DATA_VERSION,
    }

    const builder = new ImprovedWebpackBuilder(systemCommonData)

    // プロジェクト登録
    builder.registerProject(OmikujiBotProject(packageRoot))
    builder.registerProject(ReimuMarisaProject(packageRoot))
    builder.registerProject(ReimuMarisaMateProject(packageRoot))
    builder.registerProject(EveryoneZundaProject(packageRoot))
    builder.registerProject(DivaMetanProject(packageRoot))
    builder.registerProject(percent_DoraProject(packageRoot))
    builder.registerProject(HondaJankenProject(packageRoot))
    builder.registerProject(CardStationProject(packageRoot))

    // 改良されたビルドを実行
    await builder.buildTargetsOptimized(buildTargets)

    console.log('[Build] All builds completed successfully!')
  } catch (error) {
    console.error('[Build] Build failed:', error)
    process.exit(1)
  }
})()
