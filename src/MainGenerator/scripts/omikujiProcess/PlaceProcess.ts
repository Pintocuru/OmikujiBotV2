// src/MainGenerator/script/omikujiProcess/PlaceProcess.ts
import { handelNormalizedValues, PlaceholderType, PlaceholderValueType, PostActionType } from '@/types/'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { DefaultTypes } from '@shared/types'

/**
 * プレースホルダー置換処理を行うクラス
 * PostAction配列内の<<key>>形式のプレースホルダーを実際の値に置換する
 */
export class PlaceProcess {
  private resolvedValues: Record<string, string | number> = {}
  private readonly placeholderIdMap: Map<string, PlaceholderType> // 効率的な検索のためのマップ
  private static readonly PLACEHOLDER_PATTERN = /<<([^>]+)>>/g // 正規表現パターン
  private static readonly MAX_REPLACEMENTS = 5 // 無限ループ防止

  constructor(placeholderSources: Record<string, PlaceholderType>) {
    // プレースホルダーIDマップを事前に構築
    this.placeholderIdMap = new Map()
    for (const placeholder of Object.values(placeholderSources)) {
      this.placeholderIdMap.set(placeholder.id, placeholder)
    }
  }

  /**
   * 解決済みプレースホルダーを追加/更新
   */
  updateResolvedValues(data: DefaultTypes): void {
    Object.assign(this.resolvedValues, data)
  }

  /**
   * PostAction配列のプレースホルダーを置換して返す
   */
  processPostActions(postActions: PostActionType[]): PostActionType[] {
    // 使用されているプレースホルダーIDを収集
    const usedPlaceholderIds = this.collectUsedPlaceholderIds(postActions)

    // 収集したプレースホルダーを解決
    if (usedPlaceholderIds.length > 0) {
      this.resolvePlaceholders(usedPlaceholderIds)
    }

    return postActions.map((action) => ({
      ...action,
      messageContent: this.replacePlaceholders(action.messageContent),
      messageToast: this.replacePlaceholders(action.messageToast),
      wordParty: this.replacePlaceholders(action.wordParty),
    }))
  }

  /**
   * PostAction配列から使用されているプレースホルダーIDを収集
   */
  private collectUsedPlaceholderIds(postActions: PostActionType[]): string[] {
    const placeholderIds = new Set<string>()

    // postActionsから収集
    postActions.forEach((action) => {
      this.extractPlaceholderIds(placeholderIds, action.wordParty)
      this.extractPlaceholderIds(placeholderIds, action.messageContent)
      this.extractPlaceholderIds(placeholderIds, action.messageToast)
    })

    // placeholderSourcesのcontentからも収集（再帰的に）
    const processedIds = new Set<string>()
    const toProcess = Array.from(placeholderIds)

    while (toProcess.length > 0) {
      const currentId = toProcess.shift()!
      if (processedIds.has(currentId)) continue

      processedIds.add(currentId)

      // 該当するプレースホルダーを探す（効率的な検索）
      const placeholder = this.placeholderIdMap.get(currentId)
      if (placeholder) {
        // ユニオン型を正規化してからcontentを取得
        const normalizedValues = handelNormalizedValues(placeholder.values)

        // そのプレースホルダーのvalues内のcontentからも収集
        normalizedValues.forEach((value) => {
          this.extractPlaceholderIds(placeholderIds, value.content)
        })

        // 新しく見つかったIDを処理キューに追加
        placeholderIds.forEach((id) => {
          if (!processedIds.has(id)) {
            toProcess.push(id)
          }
        })
      }
    }

    return Array.from(placeholderIds)
  }

  /**
   * 文字列からプレースホルダーIDを抽出
   */
  private extractPlaceholderIds(placeholderIds: Set<string>, text?: string): void {
    if (!text) return

    const matches = text.matchAll(PlaceProcess.PLACEHOLDER_PATTERN)
    for (const match of matches) {
      const placeholderId = match[1].trim()
      if (placeholderId) {
        placeholderIds.add(placeholderId)
      }
    }
  }

  /**
   * 指定されたプレースホルダーIDリストを解決
   */
  private resolvePlaceholders(placeholderIds: string[]): void {
    const visitedIds = new Set<string>()

    for (const placeholderId of placeholderIds) {
      this.resolvePlaceholderRecursively(placeholderId, visitedIds)
    }
  }

  /**
   * 単一のプレースホルダーを再帰的に解決
   * 循環参照を防ぐため、visitedセットを使用
   */
  private resolvePlaceholderRecursively(placeholderId: string, visitedIds: Set<string>): void {
    // 循環参照チェック
    if (visitedIds.has(placeholderId)) {
      console.warn(`循環参照を検出: ${placeholderId}`)
      return
    }

    // 既に解決済みの場合はスキップ
    if (placeholderId in this.resolvedValues) return

    // 該当するプレースホルダーを検索（効率的な検索）
    const source = this.placeholderIdMap.get(placeholderId)
    if (!source) {
      console.warn(`プレースホルダーが見つかりません: ${placeholderId}`)
      return
    }

    // source.valuesのユニオン型を手動で正規化
    const normalizedValues = handelNormalizedValues(source.values)
    visitedIds.add(placeholderId)

    try {
      // 依存する子プレースホルダーを先に解決
      const childIds = new Set<string>()
      normalizedValues.forEach((value) => {
        this.extractPlaceholderIds(childIds, value.content)
      })

      for (const childId of childIds) {
        this.resolvePlaceholderRecursively(childId, visitedIds)
      }

      // 値を抽選して解決
      if (normalizedValues.length > 0) {
        const selectedValue = drawOmikuji(normalizedValues)
        if (selectedValue?.content !== undefined) {
          // プレースホルダーIDをキーとして解決済み値を保存
          this.resolvedValues[placeholderId] = selectedValue.content
        } else {
          // エラー時は最初の値を使用
          this.resolvedValues[placeholderId] = normalizedValues[0].content
        }
      }
    } finally {
      visitedIds.delete(placeholderId)
    }
  }

  /**
   * 文字列内のプレースホルダーを置換
   * 効率化のため、最大置換回数を制限
   */
  private replacePlaceholders(text?: string): string {
    if (!text) return ''

    let result = text
    let replacementCount = 0

    while (replacementCount < PlaceProcess.MAX_REPLACEMENTS) {
      const beforeReplacement = result

      result = result.replace(PlaceProcess.PLACEHOLDER_PATTERN, (match, key) => {
        const placeholderId = key.trim()
        const value = this.resolvedValues[placeholderId]
        return value !== undefined ? String(value) : match
      })

      // 置換が発生しなかった場合は終了
      if (result === beforeReplacement) break

      replacementCount++
    }

    if (replacementCount >= PlaceProcess.MAX_REPLACEMENTS) {
      console.warn(`プレースホルダー置換の最大回数に達しました: ${text}`)
    }

    return result
  }

  /**
   * デバッグ用: 解決済みプレースホルダーの一覧を取得
   */
  getResolvedValues(): Record<string, string | number> {
    return { ...this.resolvedValues }
  }

  /**
   * 解決済みプレースホルダーをクリア
   */
  clearResolvedValues(): void {
    this.resolvedValues = {}
  }
}
