// src/ConfigMaker/components/appItems/useVersionCheck.ts
import { ref, computed, Ref } from 'vue'
import Swal from 'sweetalert2'

export interface VersionInfo {
  current: string
  latest: string | null
  isLatest: boolean
  hasNewVersion: boolean
  isLoading: boolean
  error: string | null
}

/**
 * バージョンチェック機能を提供する専属コンポーザブル
 * storeに依存せず、現在のバージョンを引数で受け取る
 */
export function useVersionCheck(currentVersion: Ref<string>) {
  const latestVersion = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // バージョン比較用の正規化
  function normalizeVersion(v: string | null): string | null {
    return v ? v.trim().replace(/^v/, '') : null
  }

  // 最新版かどうか
  const isLatest = computed(() => {
    if (!latestVersion.value) return true
    return normalizeVersion(currentVersion.value) === normalizeVersion(latestVersion.value)
  })

  // 新バージョンが存在するか
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

  /**
   * GitHubから最新バージョンをチェック
   */
  const checkVersion = async (): Promise<void> => {
    if (isLoading.value) return // 重複実行防止

    isLoading.value = true
    error.value = null

    try {
      const res = await fetch('https://api.github.com/repos/Pintocuru/OmikujiBot-Docs/releases/latest')

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

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

  /**
   * 更新通知ダイアログを表示
   */
  const showUpdateDialog = () => {
    if (!hasNewVersion.value) return

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
          window.open(openLatestRelease(), '_blank')
        })
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(openLatestRelease(), '_blank')
      }
    })
  }

  /**
   * 最新リリースページのURLを取得
   */
  const openLatestRelease = (): string => {
    return 'https://github.com/Pintocuru/OmikujiBot-Docs/releases/latest'
  }

  /**
   * バージョン情報をリセット
   */
  const resetVersionCheck = () => {
    latestVersion.value = null
    error.value = null
    isLoading.value = false
  }

  return {
    // 状態
    versionInfo,
    isLatest,
    hasNewVersion,
    isLoading,
    error,

    // アクション
    checkVersion,
    resetVersionCheck,
    showUpdateDialog,
    openLatestRelease,
  }
}
