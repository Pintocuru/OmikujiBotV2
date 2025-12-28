<!-- src\ConfigMaker\components\appInfo\settings\SettingsEditor.vue -->
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
      <span v-if="isGod" class="badge badge-warning">GOD-MODE</span>
      <span v-else-if="isPro" class="badge badge-success">PRO</span>
      <span v-else-if="isAdv" class="badge badge-info">Adv</span>
      <input
        type="password"
        class="input input-bordered flex-1"
        :value="settings.licenseKeyHash"
        @input="(e) => updateLicenseKeyHash((e.target as HTMLInputElement).value)"
        placeholder="****"
      />
      <!-- ライセンススイッチ -->
      <span v-if="isDev">
        <button class="btn btn-sm btn-primary mr-2" @click="updateLicenseKeyHash('')">basic</button>
        <button class="btn btn-sm btn-info mr-2" @click="updateLicenseKeyHash(getKey('adv'))">Adv</button>
        <button class="btn btn-sm btn-success mr-2" @click="updateLicenseKeyHash(getKey('pro'))">PRO</button>
        <button class="btn btn-sm btn-warning" @click="updateLicenseKeyHash(getKey('godMode'))">GOD-MODE</button>
      </span>
    </div>
  </SettingItem>

  <InformationCard v-if="isPro && !isGod">
    <p>PROライセンスキーを入力したあとは：</p>

    <p>
      <strong
        >一部のPRO機能は<code class="label bg-accent text-accent-content">アプリの再起動後</code
        >に反映されます。</strong
      >
    </p>

    <p>
      ライセンスを入力したら、まずは「設定を出力(js)」を押して<code class="label bg-accent text-accent-content"
        >設定を保存</code
      >してください。<br />
      保存が完了したら、<code class="label bg-accent text-accent-content">アプリを再起動</code>してください。
    </p>

    <p>※設定を保存していない場合、再読み込み時にライセンス情報が戻ってしまいます。</p>

    <p>
      <button
        @click="exportFile('config')"
        class="btn btn-primary tooltip tooltip-top"
        data-tip="設定ファイルを出力します。保存する場合は必ずこのボタンを押してください。"
        :disabled="isExporting"
      >
        <span v-if="isExporting" class="loading loading-spinner loading-sm mr-2"></span>
        設定を出力(js)
      </button>
    </p>
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
  import { useConfigExport } from '../../presetsExport/useConfigExport'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv, isPro, isGod } = useSettingMode()

  const settings = computed(() => data.value.settings)
  const { isExporting, exportFile } = useConfigExport()

  // settings の単一フィールド更新
  const updateSettingsField = <K extends keyof SettingsType>(field: K, value: SettingsType[K]) => {
    omikujiStore.updateSettings({ [field]: value })
  }

  // ライセンスキー更新
  const updateLicenseKeyHash = (value: string) => {
    omikujiStore.updateSettings({ licenseKeyHash: value })
  }
</script>
