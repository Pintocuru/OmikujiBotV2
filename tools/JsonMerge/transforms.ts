// tools/JsonMerge/transforms.ts
import type { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import type { AccessLevelType, BaseRecordType } from '@shared/types'

/**
 * OmikujiData内のすべてのRecord型プロパティに対してaccessLevelを強制上書き
 * comments, timers, actionSets, placeholders, charactersが対象
 *
 * @param data - 対象のOmikujiData
 * @param level - 統一するaccessLevel
 * @returns accessLevelが統一されたOmikujiData
 */
export function applyAccessLevel(data: OmikujiDataType, level: AccessLevelType): OmikujiDataType {
  const updateLevel = <T extends BaseRecordType>(obj: Record<string, T>): Record<string, T> =>
    Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, { ...v, accessLevel: level }]))

  return {
    ...data,
    comments: data.comments ? updateLevel(data.comments) : {},
    timers: data.timers ? updateLevel(data.timers) : {},
    actionSets: data.actionSets ? updateLevel(data.actionSets) : {},
    placeholders: data.placeholders ? updateLevel(data.placeholders) : {},
    characters: data.characters ? updateLevel(data.characters) : {},
  }
}

/**
 * OmikujiData内のすべてのRecord型プロパティのorderプロパティに対してオフセットを加算
 * comments, timers, actionSets, placeholders, charactersが対象
 */
export function applyOrderOffset(data: OmikujiDataType, offset: number): OmikujiDataType {
  // ジェネリック関数でorder加算を実施
  const shiftOrder = <T extends BaseRecordType>(obj: Record<string, T>): Record<string, T> => {
    const shifted: Record<string, T> = {}

    for (const [key, value] of Object.entries(obj)) {
      // 各要素に対して明示的にorderを加算
      // 型アサーション後、ordersプロパティが存在することを前提に加算を行う
      const originalOrder = value.order ?? 0
      const newOrder = originalOrder + offset
      shifted[key] = { ...value, order: newOrder } as T
    }

    return shifted
  }

  return {
    ...data,
    comments: data.comments ? shiftOrder(data.comments) : {},
    timers: data.timers ? shiftOrder(data.timers) : {},
    actionSets: data.actionSets ? shiftOrder(data.actionSets) : {},
    placeholders: data.placeholders ? shiftOrder(data.placeholders) : {},
    characters: data.characters ? shiftOrder(data.characters) : {},
  }
}
