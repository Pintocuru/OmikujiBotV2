// src/ConfigMaker/components/dataPacks/useDataPacks.ts
import { ref, computed } from 'vue'
import axios from 'axios'
import type { MetaDataType } from '@shared/types/core/MetaDataSchema'

// -------------------------------------------------------------------
// 型定義
// -------------------------------------------------------------------
export interface DataPackEntry {
  path: string // GitHub上のパス（data-packs/...）
  rawUrl: string // Raw URL
  bannerUrl: string | null
  meta: MetaDataType
  json: Record<string, unknown> // 生のJSONデータ（import処理用）
}

// -------------------------------------------------------------------
// GitHub Raw URL ユーティリティ
// -------------------------------------------------------------------
const REPO_BASE = 'https://raw.githubusercontent.com/Pintocuru/OmikujiBot-Docs/main/'

export function buildRawUrl(path: string): string {
  return `${REPO_BASE}/${path}`
}

// -------------------------------------------------------------------
// テンプレートリスト（静的定義）
// data-packs 以下のエントリを追加していく
// -------------------------------------------------------------------
const templateList: string[] = [
  'common/StrawberryChocolate/StrawberryChocolate.json',

  '2025-Q4/BigBangFortune/BigBangFortune.json',
  '2025-Q4/BomberSpin/BomberSpin.json',
  '2025-Q4/CardStation/CardStation.json',
  '2025-Q4/GouseiSuika/GouseiSuika.json',
  '2025-Q4/HondaJanken/HondaJanken.json',
  '2025-Q4/TarotCard/TarotCard.json',
]

// -------------------------------------------------------------------
// JSON ローダー
// -------------------------------------------------------------------
async function loadTemplateJson(rawUrl: string): Promise<Record<string, unknown>> {
  const response = await axios.get<Record<string, unknown>>(rawUrl, {
    responseType: 'json',
    timeout: 5000,
  })
  return response.data
}

// -------------------------------------------------------------------
// composable
// -------------------------------------------------------------------
export function useDataPacks() {
  const packs = ref<DataPackEntry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    packs.value = []

    const results: DataPackEntry[] = []

    for (const path of templateList) {
      const rawUrl = buildRawUrl(path)
      try {
        const json = await loadTemplateJson(rawUrl)
        const meta = (json.meta ?? {}) as MetaDataType

        results.push({
          path,
          rawUrl,
          bannerUrl: meta.banner ? meta.banner : null,
          meta,
          json,
        })
      } catch (err) {
        console.error(`[useDataPacks] Failed to load: ${rawUrl}`, err)
        // 1件失敗しても続行
      }
    }

    packs.value = results
    loading.value = false
  }

  const isEmpty = computed(() => !loading.value && packs.value.length === 0)

  return { packs, loading, error, isEmpty, fetchAll }
}
