<!-- src/ConfigMaker/UiEditor/LiveClock/LiveClockEditor.vue -->
<template>
  <!-- プレビュー -->
  <LiveClockPreview :settings="liveClock" :messageText="messageText" />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="liveClock.component"
    :options="clockComponentMap"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- テーマカラー -->
  <DaisyUiThemeEditor
    v-if="isAdv && clockComponentMap[liveClock.component].isColor"
    :model-value="liveClock.color"
    @update:model-value="(newValue) => updateField('color', newValue)"
  />

  <!-- デフォルトで表示させるメッセージ -->
  <SettingItem
    label="デフォルトメッセージ"
    description="プレースホルダーが使えます"
    :showReset="true"
    @reset="resetMap.defaultMessage"
  >
    <MessageTextDialog v-model="messageText" />
  </SettingItem>

  <!-- 日付を表示するか -->
  <SettingItem label="日付表示" description="時計に日付を表示するか">
    <label class="flex items-center cursor-pointer">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        v-model="liveClock.isDate"
        @change="(e) => updateField('isDate', (e.target as HTMLInputElement).checked)"
      />
      <span class="ml-2"> 日付を表示{{ liveClock.isDate ? 'する' : 'しない' }} </span>
    </label>
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
  import { clockComponentMap, LiveClockSchema } from '@/types'
  import LiveClockPreview from './LiveClockPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import MessageTextDialog from '@config/components/postAction/Message/MessageTextDialog.vue'
  import DaisyUiThemeEditor from '@config/components/common/ThemeColorPicker/DaisyUiThemeEditor.vue'
  import DisplayStyleSelector from '../CommonStyle/DisplayStyleSelector.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv } = useSettingMode()

  const liveClock = computed(() => data.value?.components?.settings?.liveClock ?? LiveClockSchema.parse({}))

  // Field Updates
  const updateField = (field: keyof typeof liveClock.value, value: any) => {
    omikujiStore.updateComponentSettings('liveClock', {
      ...liveClock.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof typeof liveClock.value) => {
    const defaults = LiveClockSchema.parse({})
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
