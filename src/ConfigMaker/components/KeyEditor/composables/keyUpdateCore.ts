// src/ConfigMaker/components/KeyEditor/composables/keyUpdateCore.ts
import { useNavigationStore } from '@config/stores/useNavigationStore'
import { useGetRecordData } from '@config/stores/useGetRecordData'
import { RecordCategoryType } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'

/**
 * 汎用イベントKey更新処理（BaseRecordSchema対応）
 */
export function updateRecordKey(category: RecordCategoryType, oldKey: string, newKey: string): boolean {
  try {
    const omikujiStore = useOmikujiStore()
    const { getCategoryMap } = useGetRecordData()
    const { selectedCategory, selectedItemKey, selectItem } = useNavigationStore()

    const categoryMap = getCategoryMap(category)
    const oldRecord = categoryMap[oldKey]

    if (!oldRecord || categoryMap[newKey]) return false

    omikujiStore.removeItem(category, oldKey)
    omikujiStore.addItem(category, { ...oldRecord, key: newKey })

    if (selectedCategory === category && selectedItemKey === oldKey) {
      selectItem(newKey)
    }

    return true
  } catch {
    return false
  }
}

/**
 * キャラクターKey更新
 */
export function updateCharacterKey(oldKey: string, newKey: string): boolean {
  try {
    const omikujiStore = useOmikujiStore()
    const { selectedCategory, selectedItemKey, selectItem } = useNavigationStore()
    const { getCategoryMap } = useGetRecordData()

    const characters = getCategoryMap('characters')
    const character = characters[oldKey]

    if (!character || characters[newKey]) return false

    omikujiStore.removeItem('characters', oldKey)
    omikujiStore.addItem('characters', { ...character, key: newKey })

    // 選択状態の更新
    if (selectedCategory === 'characters' && selectedItemKey === oldKey) {
      selectItem(newKey)
    }

    return true
  } catch {
    return false
  }
}

/**
 * プレースホルダーKey更新
 */
export function updatePlaceholderKey(oldKey: string, newKey: string): boolean {
  try {
    const omikujiStore = useOmikujiStore()
    const { getCategoryMap } = useGetRecordData()
    const { selectedCategory, selectedItemKey, selectItem } = useNavigationStore()

    const placeholders = getCategoryMap('placeholders')
    const placeholder = placeholders[oldKey]

    if (!placeholder || placeholders[newKey]) return false

    const { key: _key, ...data } = placeholder

    omikujiStore.removeItem('placeholders', oldKey)
    omikujiStore.addItem('placeholders', { ...data, key: newKey })

    if (selectedCategory === 'placeholders' && selectedItemKey === oldKey) {
      selectItem(newKey)
    }

    return true
  } catch {
    return false
  }
}
