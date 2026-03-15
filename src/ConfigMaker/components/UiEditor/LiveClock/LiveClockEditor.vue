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
  <DaisyUiThemeEditor
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
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { clockComponentMap, SettingsClockSchema } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import DaisyUiThemeEditor from '@config/components/common/ThemeColorPicker/DaisyUiThemeEditor.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import MessageTextDialog from '@config/components/postAction/Message/MessageTextDialog.vue'
  import LiveClockPreview from './LiveClockPreview.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro } = useSettingMode()

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
