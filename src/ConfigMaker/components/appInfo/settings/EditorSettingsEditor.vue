<!-- src/ConfigMaker/components/appInfo/settings/EditorSettingsEditor.vue -->
<template>
  <!-- コンフィグエディター設定 -->
  <SubSectionHeader
    icon="Settings"
    title="コンフィグエディター設定"
    description="エディターの見た目・動作・ライセンスなど、アプリ本体の設定"
  />

  <!-- DaisyUIテーマ -->
  <SettingItem label="エディターテーマ" description="DaisyUiのカラーテーマを設定します" forceMode="pro">
    <select
      :value="settings.daisyUiTheme"
      @change="(e) => updateField('daisyUiTheme', (e.target as HTMLSelectElement).value)"
      class="select select-bordered"
      :disabled="!isPro"
    >
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
    <span class="pl-2">
      <button class="btn btn-sm btn-outline" @click="setRandomTheme" :disabled="!isPro">ランダム</button>
    </span>
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
      <LicenseSwitch v-if="isDev" />
    </div>
  </SettingItem>

  <!-- 起動時に開くカテゴリ -->
  <SettingItem
    v-if="isGod"
    label="起動時に開くカテゴリ"
    description="起動時に最初に開くカテゴリを設定します"
    :showReset="true"
    @reset="resetMap.initialCategory"
    forceMode="god"
  >
    <select
      :value="settings.initialCategory"
      @change="(e) => updateField('initialCategory', (e.target as HTMLSelectElement).value)"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="(value, key) in categoryMap" :key="key" :value="key">
        {{ value.label }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { categoryMap, isDev, SettingsSchema } from '@/types'
  import LicenseSwitch from './LicenseSwitch.vue'
  import { resolveSettingMode } from '@/common/FeatureAccess/SettingMode'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode, useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import type { SettingsType } from '@/types/OmikujiData/SettingsSchema'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
  import Swal from 'sweetalert2'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv, isPro, isGod } = useSettingMode()

  const settings = computed(() => data.value.settings)

  const updateField = <K extends keyof SettingsType>(field: K, value: any) => {
    omikujiStore.updateSettings({ [field]: value })
  }

  const updateLicenseKeyHash = (value: string) => {
    omikujiStore.updateSettings({ licenseKeyHash: value })
  }

  const resetField = (field: keyof typeof settings.value) => {
    const defaults = SettingsSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    initialCategory: () => resetField('initialCategory'),
  }

  const setRandomTheme = () => {
    if (!themes.length) return
    const random = themes[Math.floor(Math.random() * themes.length)]
    updateField('daisyUiTheme', random)
  }

  // ライセンスキー変更時のモーダル表示
  watch(
    () => settings.value.licenseKeyHash,
    (newVal, oldVal) => {
      if (isDev) return
      if (oldVal === undefined) return

      if (resolveSettingMode(newVal) === 'godMode') {
        Swal.fire({
          title: '✨ 今日からお前は神 ✨',
          text: '暇を持て余した神々の遊び',
          icon: 'warning',
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: '承知した',
          denyButtonText: 'よくわかった',
          cancelButtonText: 'よくわからなかった',
          background: 'linear-gradient(135deg, #fff7d1, #ffe08a, #ffd24c)',
          color: '#5b3b00',
          confirmButtonColor: '#d97706',
        })
        return
      }

      if (newVal !== oldVal) {
        swalModal.info({
          title: 'ライセンスキーが変更されました',
          text: '一部の機能を反映するには設定の保存とエディターの再起動が必要です。',
        })
      }
    }
  )
</script>
