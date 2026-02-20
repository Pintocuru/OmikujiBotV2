// src/common/FeatureAccess/SettingMode.ts
import { AccessLevelType } from '@shared/types'
import { computed, Ref } from 'vue'

// 判定テーブル
const MODE_KEY: Partial<Record<AccessLevelType, string>> = {
  adv: 'a3f1c9b27e4d8f62b19c0a7e53d4f981',
  pro: '2c26b46b68ffc68ff99b453c1d304134',
  godMode: '5d41402abc4b2a76b9719d911017c592',
}

// ハッシュ→モード 逆引きテーブルを自動生成
const KEY_MAP: Record<string, AccessLevelType> = Object.fromEntries(
  Object.entries(MODE_KEY).map(([mode, hash]) => [hash, mode])
) as Record<string, AccessLevelType>

// 純粋関数: ハッシュ文字列からモード判定
export function resolveSettingMode(licenseKeyHash?: string): AccessLevelType {
  return licenseKeyHash ? (KEY_MAP[licenseKeyHash] ?? 'basic') : 'basic'
}

// 共通 composable: Ref<string | undefined> を渡せば reactive に使える
export function useSettingModeFromHash(licenseKeyHashRef: Ref<string | undefined>) {
  const accessMode = computed((): AccessLevelType => resolveSettingMode(licenseKeyHashRef.value))

  const ADV_MODES = ['adv', 'pro', 'godMode']
  const PRO_MODES = ['pro', 'godMode']
  const GOD_MODES = ['godMode']

  const isAdv = computed(() => ADV_MODES.includes(accessMode.value))
  const isPro = computed(() => PRO_MODES.includes(accessMode.value))
  const isGod = computed(() => GOD_MODES.includes(accessMode.value))

  return { accessMode, isAdv, isPro, isGod }
}

// 利用しやすい関数群
export function getKey(mode: AccessLevelType): string {
  return MODE_KEY[mode] ?? ''
}
