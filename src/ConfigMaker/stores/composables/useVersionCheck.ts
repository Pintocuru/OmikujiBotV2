// src/ConfigMaker/stores/composables/useVersionCheck.ts
import { ref, computed, type Ref, readonly } from 'vue'
import type { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import Swal from 'sweetalert2'

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
  function normalizeVersion(v: string | null): string | null {
    return v ? v.trim().replace(/^v/, '') : null
  }

  const isLatest = computed(() => {
    if (!latestVersion.value) return true
    return normalizeVersion(currentVersion.value) === normalizeVersion(latestVersion.value)
  })

  const hasNewVersion = computed(() => {
    if (!latestVersion.value) return false
    return normalizeVersion(currentVersion.value) !== normalizeVersion(latestVersion.value)
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

  // 更新通知ダイアログ表示
  const showUpdateDialog = () => {
    if (versionInfo.value.hasNewVersion) {
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'info',
        title: `新しいバージョンが利用可能です！\n現在: ${versionInfo.value.current}\n最新: ${versionInfo.value.latest}`,
        showConfirmButton: true,
        confirmButtonText: 'GitHubを開く',
        timer: 15000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('click', () => {
            window.open(openLatestRelease())
          })
        },
      })
    }
  }

  const openLatestRelease = () => 'https://github.com/Pintocuru/OmikujiBot-Docs/releases/latest'

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
