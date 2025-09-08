// src/ConfigMaker/stores/composables/useVersionCheck.ts
import { ref, computed, type Ref, readonly } from 'vue'
import type { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { toast } from 'vue-sonner'

export interface VersionInfo {
  current: string
  latest: string | null
  isLatest: boolean
  hasNewVersion: boolean
  isLoading: boolean
  error: string | null
}

export function useVersionCheck(data: Ref<OmikujiDataType>) {
  const latestVersion = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 現在のバージョン
  const currentVersion = computed(() => data.value.meta.generatorVersion)

  // バージョン比較
  const isLatest = computed(() => {
    if (!latestVersion.value) return true
    return currentVersion.value === latestVersion.value
  })

  const hasNewVersion = computed(() => {
    if (!latestVersion.value) return false
    return currentVersion.value !== latestVersion.value
  })

  // バージョン情報オブジェクト
  const versionInfo = computed<VersionInfo>(() => ({
    current: currentVersion.value,
    latest: latestVersion.value,
    isLatest: isLatest.value,
    hasNewVersion: hasNewVersion.value,
    isLoading: isLoading.value,
    error: error.value,
  }))

  // バージョンチェック実行
  const checkVersion = async (): Promise<void> => {
    if (isLoading.value) return // 重複実行防止

    isLoading.value = true
    error.value = null

    try {
      const res = await fetch('https://api.github.com/repos/Pintocuru/OmikujiBot-Docs/releases/latest')

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)

      const release = await res.json()
      latestVersion.value = release.tag_name?.replace(/^v/, '') || null

      if (!latestVersion.value) {
        throw new Error('バージョン情報が取得できませんでした')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'バージョン情報取得に失敗しました'
      console.error('バージョンチェックエラー:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 更新通知ダイアログ表示 (vue-sonner)
  const showUpdateDialog = () => {
    if (versionInfo.value.hasNewVersion) {
      toast.info(
        `新しいバージョンが利用可能です！\n現在: ${versionInfo.value.current}\n最新: ${versionInfo.value.latest}`,
        {
          duration: 15000,
          action: {
            label: 'GitHubを開く',
            onClick: () => window.open('https://github.com/Pintocuru/OmikujiBot-Docs/releases/latest', '_blank'),
          },
        }
      )
    }
  }

  const openLatestRelease = () => window.open('https://github.com/Pintocuru/OmikujiBot-Docs/releases/latest', '_blank')

  // バージョン情報をリセット
  const resetVersionCheck = () => {
    latestVersion.value = null
    error.value = null
    isLoading.value = false
  }

  return {
    // 状態
    versionInfo,
    currentVersion,
    latestVersion: readonly(latestVersion),
    isLatest,
    hasNewVersion,
    isLoading: readonly(isLoading),
    error: readonly(error),

    // アクション
    checkVersion,
    resetVersionCheck,
    showUpdateDialog,
    openLatestRelease,
  }
}
