// src/MainGenerator/scripts/OmikujiProcess/OmikujiProcessor.ts
import { OmikujiSetType } from '@/types'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiExecutor } from './OmikujiExecutor'
import { OmikujiResultProcessor } from './OmikujiResultProcessor'
import { PlaceholderProcessor } from '@MainScripts/PlaceholderProcess/PlaceholderProcessor'
import { BotMessageGenerator } from '@MainScripts/BotCharacter/BotMessageGenerator'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { Comment } from '@onecomme.com/onesdk/'

/**
 * おみくじ処理の統合クラス
 * 各専門クラスへの処理の委譲とAPIの提供を担当
 */
export class OmikujiProcessor {
  private readonly placeProcess: PlaceholderProcessor
  private readonly executor: OmikujiExecutor
  private readonly resultProcessor: OmikujiResultProcessor

  constructor() {
    // Pinia Store
    const appStore = useAppStore()

    // 依存関係の初期化
    this.placeProcess = new PlaceholderProcessor(appStore.data.placeholders)
    const botMessageGenerator = new BotMessageGenerator(appStore.data.characters)

    // 専門クラスの初期化
    this.executor = new OmikujiExecutor(this.placeProcess)
    this.resultProcessor = new OmikujiResultProcessor(
      appStore.data,
      this.placeProcess,
      botMessageGenerator,
      appStore.scriptManager
    )
  }

  /**
   * おみくじ と 引いたおみくじの処理
   */
  executeOmikuji(omikujiSet: OmikujiSetType, comment?: Comment): BotMessage[] {
    // おみくじ
    const omikujiItem = this.executor.executeWithRule(omikujiSet, comment)
    if (!omikujiItem) return []

    // スクリプト
    if (omikujiItem.gameScripts?.scriptId === '') {
      this.hoge()
    }

    // おみくじの処理
    return this.resultProcessor.process(omikujiItem, comment)
  }

  /**
   *
   */
  private hoge() {
    const { cooldownManager } = useAppStore()
  }
}
