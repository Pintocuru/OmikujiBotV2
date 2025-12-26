<!-- src/ConfigMaker/components/display/EditorSettingsEditor.vue -->
<template>
  <!-- DaisyUIテーマ -->
  <SettingItem label="エディターテーマ" description="DaisyUiのカラーテーマを設定します" forceMode="pro">
    <select
      :value="settings.daisyUiTheme"
      @change="(e) => updateSettingsField('daisyUiTheme', (e.target as HTMLSelectElement).value as ThemeType)"
      class="select select-bordered w-full max-w-xs"
      :disabled="!isPro"
    >
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
  </SettingItem>

  <!-- ライセンスキー -->
  <SettingItem
    v-if="isDev || useVisibilityAccess().canShowDeveloper('licenseVisible')"
    devMemo="licenseVisible"
    label="ライセンスキー"
    description="入力したハッシュでモードを判定します"
  >
    <div class="flex gap-2 items-center">
      <span v-if="isPro && !isGod" class="badge badge-success">PRO</span>
      <span v-if="isGod" class="badge badge-warning">GOD-MODE</span>
      <input
        type="password"
        class="input input-bordered flex-1"
        :value="settings.licenseKeyHash"
        @input="(e) => updateLicenseKeyHash((e.target as HTMLInputElement).value)"
        placeholder="****"
      />
      <span v-if="isDev">
        <button class="btn btn-sm btn-primary mr-2" @click="updateLicenseKeyHash('')">basic</button>
        <button class="btn btn-sm btn-success mr-2" @click="updateLicenseKeyHash(getKey('pro'))">PRO</button>
        <button class="btn btn-sm btn-warning" @click="updateLicenseKeyHash(getKey('godMode'))">GOD-MODE</button>
      </span>
    </div>
  </SettingItem>

  <!-- 補足説明 -->
  <InformationCard v-if="isPro && !isGod">
    <p>PROライセンスキーを入力したあとは：</p>
    <p>ライセンスは即時適用されますが、保存を行わないと、リロード時にライセンスが戻ってしまいます。</p>
    <p>「設定を出力(js)」を押して、保存するのをお忘れなく。</p>
  </InformationCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev } from '@/types'
  import { getKey } from '@/types/SettingMode'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { themes, ThemeType } from '@shared/styles/DaisyUiTheme'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'
  import type { SettingsType } from '@/types/OmikujiData/SettingsSchema'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro, isGod } = useSettingMode()

  const settings = computed(() => data.value.settings)

  // settings の単一フィールド更新
  const updateSettingsField = <K extends keyof SettingsType>(field: K, value: SettingsType[K]) => {
    omikujiStore.updateSettings({ [field]: value })
  }

  // ライセンスキー更新
  const updateLicenseKeyHash = (value: string) => {
    omikujiStore.updateSettings({ licenseKeyHash: value })
  }
</script>
