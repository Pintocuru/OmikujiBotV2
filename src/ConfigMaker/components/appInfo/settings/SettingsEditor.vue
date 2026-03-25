<!-- src/ConfigMaker/components/appInfo/settings/SettingsEditor.vue -->
<template>
  <!-- ジェネレーター設定 -->
  <SubSectionHeader
    icon="Sparkles"
    title="ジェネレーター設定"
    description="UI・効果音など、配信挙動に関わる設定をまとめるセクション"
  />

  <!-- 効果音を鳴らす -->
  <SettingItem label="効果音を鳴らす" description="BOTの効果音を再生するか">
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" class="toggle toggle-primary" :checked="settings.soundEnabled" @change="handleMuteSound" />
      <span>{{ settings.soundEnabled ? '音を鳴らす' : 'ミュートする' }}</span>
    </label>
  </SettingItem>

  <!-- VisitUserにユーザーを入れない -->
  <SettingItem
    label="ユーザーを記録しないリスト"
    description="BOTや管理者の名前を正規表現で指定"
    :showReset="true"
    @reset="resetMap.ignoreUserPattern"
  >
    <MessageTextEditor v-model="bubbleText" />
  </SettingItem>

  <!-- コンフィグエディター設定 -->
  <SubSectionHeader
    icon="Settings"
    title="コンフィグエディター設定"
    description="エディターそのものの見た目・動作・ライセンスなど、アプリ本体の設定をまとめるセクション"
  />
  <!-- DaisyUIテーマ -->
  <SettingItem label="エディターテーマ" description="DaisyUiのカラーテーマを設定します" forceMode="pro">
    <select
      :value="settings.daisyUiTheme"
      @change="(e) => updateField('daisyUiTheme', (e.target as HTMLSelectElement).value)"
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
  import { categoryMap, isDev, SettingsSchema, soundMetaMap } from '@/types/'
  import LicenseSwitch from './LicenseSwitch.vue'
  import { resolveSettingMode } from '@/common/FeatureAccess/SettingMode'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import type { SettingsType } from '@/types/OmikujiData/SettingsSchema'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
  import Swal from 'sweetalert2'
  import MessageTextEditor from '@/ConfigMaker/components/postAction/Message/MessageTextEditor.vue'
  import { playSound } from '@/common/sounds'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv, isPro, isGod } = useSettingMode()

  const settings = computed(() => data.value.settings)

  // settings の単一フィールド更新
  const updateField = <K extends keyof SettingsType>(field: K, value: any) => {
    omikujiStore.updateSettings({ [field]: value })
  }

  // ライセンスキー更新
  const updateLicenseKeyHash = (value: string) => {
    omikujiStore.updateSettings({ licenseKeyHash: value })
  }

  // 効果音切り替え
  const handleMuteSound = (event: Event) => {
    const checked = (event.target as HTMLInputElement).checked
    updateField('soundEnabled', checked)
  }

  const bubbleText = computed<string>({
    get: () => settings.value.ignoreUserPattern ?? '',
    set: (value: string) => {
      // 複数行を OR で結合して正規化
      const normalized = value
        .split(/\r?\n/) // 行ごとに分割
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join('|') // OR で結合

      updateField('ignoreUserPattern', normalized)
    },
  })

  const resetField = (field: keyof typeof settings.value) => {
    const defaults = SettingsSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    initialCategory: () => resetField('initialCategory'),
    ignoreUserPattern: () => resetField('ignoreUserPattern'),
  }

  // ライセンスキー変更時のモーダル表示
  watch(
    () => settings.value.licenseKeyHash,
    (newVal, oldVal) => {
      // isDev のときは頻繁に変わるので通知しない
      if (isDev) return

      // 初期ロード時の oldVal === undefined を除外
      if (oldVal === undefined) return

      // 神々の遊び
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

      // 値が変わったときだけモーダル表示
      if (newVal !== oldVal) {
        swalModal.info({
          title: 'ライセンスキーが変更されました',
          text: '一部の機能を反映するには設定の保存とエディターの再起動が必要です。',
        })
      }
    }
  )

  const playRandomSound = () => {
    const keys = Object.keys(soundMetaMap) as Array<keyof typeof soundMetaMap>
    if (keys.length === 0) return
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    playSound(randomKey)
  }

  watch(
    () => settings.value.soundEnabled,
    (newVal, oldVal) => {
      if (!oldVal && newVal) playRandomSound()
    }
  )
</script>
