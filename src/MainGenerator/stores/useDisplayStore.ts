// src/stores/useDisplayStore.ts
// !廃止
import { ref, computed, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'
import { UserStatsType } from '@/types/GameScript/GameScriptSchema'
import { useAppStore } from './useAppStore'
import { gameScriptMap } from '@/common/GameScripts/GameScriptsMap'
import { DisplaySize } from '@shared/types'

export const useDisplayStore = defineStore('display', () => {
  // 依存関係
  const appStore = useAppStore()

  // 表示設定
  const displaySettings = appStore.data.displaySettings
  const displaySize = ref<DisplaySize>(displaySettings.base.displaySize)

  const currentModeIndex = ref(0)
  const updateTrigger = ref(0)

  // 計算されたプロパティ

  // コンポーネント選択設定
  const selectedComponent = computed(() => {
    return displaySettings.developer.startup.component
  })

  /**
   * 有効なscriptKey配列を動的に構築
   */
  const availableScriptKeys = computed((): (string | null)[] => {
    const keys: (string | null)[] = []
    // BOTちゃんモード
    keys.push(null)
    // アクティブなゲームスクリプト
    const activeScripts = appStore.scriptManager.getActiveScripts()
    activeScripts.forEach((scriptKey) => keys.push(scriptKey))
    return keys
  })

  // 現在のscriptKey
  const currentScriptKey = computed((): string | null => {
    const keys = availableScriptKeys.value
    if (keys.length === 0) return null
    if (currentModeIndex.value >= keys.length) currentModeIndex.value = 0
    return keys[currentModeIndex.value]
  })

  // ランキングデータを取得
  const getCurrentRankings = (scriptKey: string | null): UserStatsType[] => {
    if (!scriptKey) return []

    try {
      const rankings = appStore.scriptManager.getRankingData(scriptKey)
      return rankings ? [...rankings] : []
    } catch (error) {
      console.warn(`Failed to get rankings for ${scriptKey}:`, error)
      return []
    }
  }

  // 現在のコンポーネントキー
  const currentComponentKey = computed((): string => {
    // updateTriggerを参照することで強制更新に対応
    void updateTrigger.value

    const scriptKey = currentScriptKey.value
    return scriptKey ? `game-${scriptKey}` : 'bot-mode'
  })

  // 現在のコンポーネント設定
  const currentComponentConfig = computed(() => {
    // updateTriggerを参照することで強制更新に対応
    void updateTrigger.value

    const scriptKey = currentScriptKey.value
    return scriptKey && gameScriptMap[scriptKey] ? gameScriptMap[scriptKey].componentConfig : null
  })

  // 現在のスクリプト設定
  const currentScriptSettings = computed(() => {
    // updateTriggerを参照することで強制更新に対応
    void updateTrigger.value

    const scriptKey = currentScriptKey.value
    return scriptKey ? { ...(appStore.data.scriptSettings?.[scriptKey] || {}) } : {}
  })

  // 現在のユーザーランキング
  const currentUserRankings = computed((): UserStatsType[] => {
    // updateTriggerを参照することで強制更新に対応
    void updateTrigger.value

    return getCurrentRankings(currentScriptKey.value)
  })

  // アクション

  /**
   * 表示サイズ変更
   */
  const setDisplaySize = (size: DisplaySize) => {
    appStore.clearMessages() // Botコメントを削除
    displaySize.value = size
    triggerUpdate()
  }

  // 強制更新
  const triggerUpdate = () => {
    updateTrigger.value += 1
  }

  /**
   * 特定のモードに直接切り替え
   */
  const switchToMode = async (scriptKey: string | null) => {
    const keys = availableScriptKeys.value
    const targetIndex = keys.findIndex((key) => key === scriptKey)

    if (targetIndex !== -1) {
      currentModeIndex.value = targetIndex
      await nextTick()
      triggerUpdate()
    }
  }

  // BOTちゃんモードに切り替え
  const switchToBotMode = () => {
    return switchToMode(null)
  }

  // ゲームスクリプトモードに切り替え
  const switchToScriptGame = (scriptKey: string) => {
    return switchToMode(scriptKey)
  }

  /**
   * 初期化処理
   */
  const initializeDisplayMode = () => {
    const selectedComp = displaySettings.developer.startup.component

    if (selectedComp === 'omikujiBot') {
      currentModeIndex.value = 0 // BOTモード
    } else if (selectedComp === 'gameScript') {
      const defaultKey = displaySettings.developer.startup.scriptKey
      const activeScripts = appStore.scriptManager.getActiveScripts()

      if (defaultKey && activeScripts.includes(defaultKey)) {
        const keys = availableScriptKeys.value
        const targetIndex = keys.findIndex((key) => key === defaultKey)
        if (targetIndex !== -1) {
          currentModeIndex.value = targetIndex
        }
      } else if (activeScripts.length > 0) {
        currentModeIndex.value = 1 // BOTモードの次
      }
    }

    triggerUpdate()
  }

  // 表示設定の取得
  const getDisplaySettings = () => {
    return {
      ...displaySettings,
      currentDisplaySize: displaySize.value,
    }
  }

  /**
   * 現在のモード情報の取得
   */
  const getCurrentModeInfo = () => {
    const keys = availableScriptKeys.value
    return {
      currentIndex: currentModeIndex.value,
      totalModes: keys.length,
      currentScriptKey: currentScriptKey.value,
      availableScriptKeys: [...keys],
      selectedComponent: selectedComponent.value,
    }
  }

  // ウォッチャー

  // 強制更新（displayStoreから呼び出される）
  watch(
    () => appStore.botMessages,
    () => {
      triggerUpdate()
    },
    { deep: true, immediate: false }
  )
  // currentScriptKeyが変更されたときに自動更新
  watch(
    currentScriptKey,
    () => {
      triggerUpdate()
    },
    { immediate: false }
  )

  return {
    // 状態
    displaySize,
    currentModeIndex,
    updateTrigger,
    selectedComponent,
    availableScriptKeys,
    currentScriptKey,
    displaySettings,

    // 個別のプロパティ（currentScriptGamePropsをバラバラに）
    currentComponentKey,
    currentComponentConfig,
    currentScriptSettings,
    currentUserRankings,

    // アクション
    setDisplaySize,
    triggerUpdate,
    switchToMode,
    switchToBotMode,
    switchToScriptGame,
    initializeDisplayMode,
    getDisplaySettings,
    getCurrentModeInfo,
  }
})
