// src/types/SettingMode.ts
import { computed, Ref } from 'vue'

// 判定テーブル
const MODE_KEY: Record<Exclude<SettingMode, 'basic'>, string> = {
  pro: '2c26b46b68ffc68ff99b453c1d304134',
  godMode: '5d41402abc4b2a76b9719d911017c592',
}

// ハッシュ→モード 逆引きテーブルを自動生成
const KEY_MAP: Record<string, SettingMode> = Object.fromEntries(
  Object.entries(MODE_KEY).map(([mode, hash]) => [hash, mode])
) as Record<string, SettingMode>
export type SettingMode = 'basic' | 'pro' | 'godMode'

// 純粋関数: ハッシュ文字列からモード判定
export function resolveSettingMode(licenseKeyHash?: string): SettingMode {
  return licenseKeyHash ? (KEY_MAP[licenseKeyHash] ?? 'basic') : 'basic'
}

// 共通 composable: Ref<string | undefined> を渡せば reactive に使える
export function useSettingModeFromHash(licenseKeyHashRef: Ref<string | undefined>) {
  const settingMode = computed((): SettingMode => resolveSettingMode(licenseKeyHashRef.value))

  const isPro = computed(() => settingMode.value === 'pro' || settingMode.value === 'godMode')
  const isGod = computed(() => settingMode.value === 'godMode')

  return { settingMode, isPro, isGod }
}

// 利用しやすい関数群
export function getKey(mode: Exclude<SettingMode, 'basic'>): string {
  return MODE_KEY[mode]
}
