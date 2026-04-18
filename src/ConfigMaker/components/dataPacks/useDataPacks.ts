// src/ConfigMaker/components/dataPacks/useDataPacks.ts
import { ref, computed } from 'vue'
import axios from 'axios'
import type { MetaDataType } from '@shared/types/core/MetaDataSchema'
import type { AccessLevelType } from '@shared/types/core/AccessLevelSchema'
import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'

// 型定義
export interface DataPackEntry {
  path: string
  rawUrl: string
  bannerUrl: string | null
  meta: MetaDataType
  json: Record<string, unknown>
}

// GitHub Raw URL ユーティリティ
const REPO_BASE = 'https://raw.githubusercontent.com/Pintocuru/OmikujiBot-Docs/main/'

export function buildRawUrl(path: string): string {
  return `${REPO_BASE}/${path}`
}

// テンプレートリスト（アクセスレベル別）
// 'adv' は使用しない
const templateList: Record<AccessLevelType, string[]> = {
  basic: [
    'common/StrawberryChocolate/StrawberryChocolate.json',

    '2025-Q4/TarotCard/TarotCard.json',
    '2025-Q4/MaidenOmikuji/MaidenOmikujiNormal.json',
    '2025-Q4/FlowerFortune/FlowerFortune.json',
    '2025-Q4/BigBangFortune/BigBangFortune.json',
    '2025-Q4/CardStation/CardStation.json',
    '2025-Q4/HondaJanken/HondaJanken.json',

    '2026-Q1/StreamCounter/StreamCounterCircle.json',
    '2026-Q1/StreamCounter/StreamCounterPixelOhayou.json',
    '2026-Q1/LiveClock/LiveClockMorning.json',
    '2026-Q1/BreakingSyoken/BreakingSyoken.json',
    '2026-Q1/FlightSeat/FlightSeatNine.json',
    '2026-Q1/HonjoFox/HonjoFox.json',
  ],
  pro: [
    '2025-Q4/BomberSpin/BomberSpin.json',
    '2025-Q4/GouseiSuika/GouseiSuika.json',
    '2026-Q1/LenormandOracle/LenormandOracle.json',
    '2026-Q1/RunicOracle/RunicOracle.json',
    '2026-Q1/FlightSeat/FlightSeatGraduation.json',
  ],
  godMode: [
    // 内部用パック
  ],
  none: [],
  adv: [],
}

// アクセスレベルに応じたテンプレートパスを収集
function resolveTemplatePaths(isPro: boolean, isGod: boolean): string[] {
  const paths: string[] = [...templateList.basic]
  if (isPro || isGod) paths.push(...templateList.pro)
  if (isGod) paths.push(...templateList.godMode)
  return paths
}

// JSON ローダー
async function loadTemplateJson(rawUrl: string): Promise<Record<string, unknown>> {
  const response = await axios.get<Record<string, unknown>>(rawUrl, {
    responseType: 'json',
    timeout: 5000,
  })
  return response.data
}

// composable
export function useDataPacks() {
  const packs = ref<DataPackEntry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedTags = ref<string[]>([])

  const { isPro, isGod } = useSettingMode()

  // 全パックから重複なくタグを収集
  const allTags = computed<string[]>(() => {
    const tagSet = new Set<string>()
    for (const pack of packs.value) {
      for (const tag of pack.meta.tags ?? []) tagSet.add(tag)
    }
    return [...tagSet].sort()
  })

  // 選択タグで絞り込み（未選択時は全件）
  const filteredPacks = computed<DataPackEntry[]>(() => {
    if (selectedTags.value.length === 0) return packs.value
    return packs.value.filter((pack) => selectedTags.value.every((tag) => pack.meta.tags?.includes(tag)))
  })

  function toggleTag(tag: string) {
    const idx = selectedTags.value.indexOf(tag)
    if (idx === -1) selectedTags.value = [...selectedTags.value, tag]
    else selectedTags.value = selectedTags.value.filter((t) => t !== tag)
  }

  function clearTags() {
    selectedTags.value = []
  }

  async function fetchAll() {
    loading.value = true
    error.value = null
    packs.value = []

    const results: DataPackEntry[] = []
    const paths = resolveTemplatePaths(isPro.value, isGod.value)

    for (const path of paths) {
      const rawUrl = buildRawUrl(path)
      try {
        const json = await loadTemplateJson(rawUrl)
        const meta = (json.meta ?? {}) as MetaDataType

        results.push({
          path,
          rawUrl,
          bannerUrl: rawUrl.replace(/\.json$/, '.webp'),
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

  return {
    packs: filteredPacks,
    loading,
    error,
    isEmpty,
    fetchAll,
    allTags,
    selectedTags,
    toggleTag,
    clearTags,
  }
}
