<!-- src/ConfigMaker/components/UiEditor/LiveClock/LiveClockEditor.vue -->
<template>
  <!-- プレビュー -->
  <LiveClockPreview :settings="liveClock" :messageText="messageText" />

  <!-- コンポーネント選択 -->
  <SettingItem v-if="isPro" label="表示スタイル" description="表示形式を選択" forceMode="pro">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(style, key) in clockComponentMap"
        :key="key"
        class="badge cursor-pointer"
        :class="liveClock.component === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('component', key)"
      >
        {{ style }}
      </div>
    </div>
  </SettingItem>

  <!-- テーマカラー -->
  <SettingItem v-if="isAdv" label="カラー" description="ランキングのテーマカラーを選択します" forceMode="adv">
    <select
      class="select select-bordered"
      :value="liveClock.color"
      :disabled="!isAdv"
      @change="(e) => updateField('color', (e.target as HTMLSelectElement).value)"
    >
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
  </SettingItem>

  <!-- デフォルトで表示させるメッセージ -->
  <SettingItem
    label="デフォルトメッセージ"
    description="プレースホルダーが使えます"
    :showReset="true"
    @reset="resetMap.defaultMessage"
  >
    <MessageTextDialog v-model="messageText" />
  </SettingItem>

  <!-- 秒数を表示するか -->
  <SettingItem label="秒数表示" description="時計に秒数を表示するか">
    <label class="flex items-center cursor-pointer">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        v-model="liveClock.isSecond"
        @change="(e) => updateField('isSecond', (e.target as HTMLInputElement).checked)"
      />
      <span class="ml-2"> 秒数を表示{{ liveClock.isSecond ? 'する' : 'しない' }} </span>
    </label>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { clockComponentMap, SettingsClockSchema } from '@/types/'
  import LiveClockPreview from './LiveClockPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import MessageTextDialog from '@config/components/postAction/Message/MessageTextDialog.vue'
  import { themes } from '@shared/styles/DaisyUiTheme'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv, isPro } = useSettingMode()

  const liveClock = computed(() => data.value?.components?.settings?.liveClock ?? SettingsClockSchema.parse({}))

  // Field Updates
  const updateField = (field: keyof typeof liveClock.value, value: any) => {
    omikujiStore.updateComponentSettings('liveClock', {
      ...liveClock.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof typeof liveClock.value) => {
    const defaults = SettingsClockSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    defaultMessage: () => resetField('defaultMessage'),
  }

  // Message Text
  const messageText = computed<string>({
    get: () => liveClock.value.defaultMessage ?? '',
    set: (value) => {
      updateField('defaultMessage', value)
    },
  })
</script>
