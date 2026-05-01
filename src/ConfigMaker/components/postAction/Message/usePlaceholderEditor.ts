// src/ConfigMaker/components/postAction/Message/usePlaceholderEditor.ts
import { computed, Ref, ref } from 'vue'
import { PlaceholderSchema, PlaceholderType, handelNormalizedValues } from '@/types'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { useGetRecordData } from '@config/stores/useGetRecordData'
import { defaultBasePlaceholderLabel, defaultPlaceholderMap } from '@/types/MetaMaps/DefaultPlaceholderMaps'
import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'

const PLACEHOLDER_PATTERN = /<<([^>]+)>>/g
const PLACEHOLDER_ID_PATTERN = /^[a-zA-Z0-9_]+$/

export function usePlaceholderEditor(draftText: Ref<string>, isCommentMode?: boolean) {
  const omikujiStore = useOmikujiStore()
  const { getCategoryMap } = useGetRecordData()
  const { isPlaceholder } = useVisibilityAccess()

  const showAddPlaceholder = ref(false)
  const newPlaceholderKey = ref('')
  const expandedKeys = ref<Set<string>>(new Set())

  // data.placeholders のマップ（isPlaceholder=false なら空）
  const placeholderMap = computed<Record<string, PlaceholderType>>(() => {
    if (!isPlaceholder.value) return {}
    return getCategoryMap('placeholders') as Record<string, PlaceholderType>
  })

  // defaultPlaceholders 一覧（常に表示）
  const defaultPlaceholderList = computed(() => {
    // isCommentMode が false のときは defaultBasePlaceholderLabel のみ
    const defaultPlaceholderKeys = Object.keys(defaultPlaceholderMap) as (keyof typeof defaultPlaceholderMap)[]
    const keys = isCommentMode ? defaultPlaceholderKeys : defaultBasePlaceholderLabel

    return keys.map((key) => {
      const meta = defaultPlaceholderMap[key]
      return {
        key,
        label: meta.label,
        short: meta.short,
        slot: meta.slot,
      }
    })
  })

  // ユーザー定義プレースホルダー（isPlaceholder=true のみ）
  const sortedUserPlaceholders = computed(() => {
    const used = usedKeys.value
    return Object.values(placeholderMap.value).sort((a, b) => {
      const aUsed = used.has(a.key)
      const bUsed = used.has(b.key)
      if (aUsed !== bUsed) return aUsed ? -1 : 1
      return a.key.localeCompare(b.key)
    })
  })

  // テキスト内で使用中のキー
  const usedKeys = computed<Set<string>>(() => {
    const set = new Set<string>()
    for (const match of draftText.value.matchAll(PLACEHOLDER_PATTERN)) {
      const k = match[1]?.trim()
      if (k && PLACEHOLDER_ID_PATTERN.test(k)) set.add(k)
    }
    return set
  })

  // キー展開トグル
  const togglePlaceholder = (key: string) => {
    const s = new Set(expandedKeys.value)
    if (s.has(key)) s.delete(key)
    else s.add(key)
    expandedKeys.value = s
  }

  // プレースホルダー値の更新
  const updatePlaceholderValue = (phKey: string, idx: number, e: Event) => {
    const ph = placeholderMap.value[phKey]
    if (!ph) return
    const vals = handelNormalizedValues(ph.values)
    vals[idx] = { ...vals[idx], content: (e.target as HTMLInputElement).value }
    omikujiStore.updateItem('placeholders', phKey, { ...ph, values: vals })
  }

  const removePlaceholderValue = (phKey: string, idx: number) => {
    const ph = placeholderMap.value[phKey]
    if (!ph) return
    const vals = handelNormalizedValues(ph.values).filter((_, i) => i !== idx)
    omikujiStore.updateItem('placeholders', phKey, {
      ...ph,
      values: vals.length ? vals : [{ weight: 1, content: '' }],
    })
  }

  const addPlaceholderValue = (phKey: string) => {
    const ph = placeholderMap.value[phKey]
    if (!ph) return
    const vals = handelNormalizedValues(ph.values)
    vals.push({ weight: 1, content: '' })
    omikujiStore.updateItem('placeholders', phKey, { ...ph, values: vals })
  }

  // 新規プレースホルダー作成
  const createNewPlaceholder = () => {
    const key = newPlaceholderKey.value.trim()
    if (!key || !PLACEHOLDER_ID_PATTERN.test(key)) return
    const parsed = PlaceholderSchema.parse({ key, name: key })
    omikujiStore.addItem('placeholders', parsed)
    newPlaceholderKey.value = ''
    showAddPlaceholder.value = false
    expandedKeys.value = new Set([...expandedKeys.value, key])
  }

  return {
    showAddPlaceholder,
    newPlaceholderKey,
    expandedKeys,
    placeholderMap,
    defaultPlaceholderList,
    sortedUserPlaceholders,
    usedKeys,
    togglePlaceholder,
    updatePlaceholderValue,
    removePlaceholderValue,
    addPlaceholderValue,
    createNewPlaceholder,
    PLACEHOLDER_ID_PATTERN,
  }
}
