<!-- src\ConfigMaker\components\displaySettings\components\ThumbnailComponentEditor.vue -->
<template>
  <div class="card p-2 bg-base-100 flex flex-col">
    <!-- トースト・サムネイルサンプル表示 -->
    <div v-if="base.showToasts">
      <ChatBubbleItem
        v-for="(message, i) in previewMessages"
        :key="i"
        :botMessage="message"
        :showToastsOnRight="base.showToastsOnRight"
        :character="base.showToastsCharacter ? (characterArray[i] ?? characterArray[0]) : null"
        :displaySize="base.displaySize"
        :class="!base.showToastsOnRight ? 'self-start' : 'self-end'"
      />
    </div>
    <div v-else class="p-2" :class="!base.showToastsOnRight ? 'self-start' : 'self-end'">
      (トーストの代わりにフキダシで表示されます)
    </div>
    <CharacterThumbnailsPreview
      v-if="base.showCharacterThumbnail"
      :characters="characterArray"
      :displaySize="base.displaySize"
      :class="!base.showToastsOnRight ? 'self-start' : 'self-end'"
    />
  </div>

  <!-- 設定項目 -->
  <SettingItem
    v-for="setting in settings"
    :key="setting.field"
    :label="setting.label"
    :description="setting.description"
    :showReset="true"
    :devMemo="setting.devMemo"
    @reset="() => resetField(setting.field)"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base[setting.field] as boolean"
        @change="(e) => updateField(setting.field, (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">{{ setting.text }}</span>
    </label>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { z } from 'zod'
  import { isDev } from '@/types'
  import { BotMessageSchema } from '@/types/BotComponents/BotMessageSchema'
  import { BaseSettingsSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import ChatBubbleItem from '@/MainGenerator/components/ToastWidgets/ToastBubbleItem.vue'
  import CharacterThumbnailsPreview from '@/MainGenerator/components/ToastWidgets/CharacterThumbnailsPreview.vue'
  import { storeToRefs } from 'pinia'

  type BaseSettingsKey = keyof z.infer<typeof BaseSettingsSchema>

  interface SettingConfig {
    field: BaseSettingsKey
    label: string
    description: string
    text: string
    devMemo?: string
    show?: () => boolean
  }

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const characterArray = computed(() => Object.values(data.value.characters))
  const base = computed(() => data.value.displaySettings.base)

  const canShowCharacterSettings = computed(() => useVisibilityAccess().canShow('characterVisible'))

  // 設定項目の配列化
  const settings = computed<SettingConfig[]>(() => {
    const allSettings: SettingConfig[] = [
      {
        field: 'showToastsOnRight',
        label: 'トースト・サムネイル位置',
        description: '画面上部に通知メッセージを表示します',
        text: 'OFFで左側、ONで右側に表示します',
      },
      {
        field: 'showToasts',
        label: 'トースト表示',
        description: 'OFFの場合、すべてフキダシで表示します',
        text: 'トーストを表示する',
      },
      {
        field: 'showToastsCharacter',
        label: 'トーストのキャラクター表示',
        description: '表示できるキャラクターは default のみです',
        text: 'トーストの隣にキャラクターアイコンを表示する',
        devMemo: 'characterVisible',
        show: () =>
          (canShowCharacterSettings.value && base.value.showToasts) || (isDev && base.value.showToastsCharacter),
      },
      {
        field: 'showCharacterThumbnail',
        label: 'キャラクターサムネイル',
        description: '右下にキャラクターのサムネイルを表示します',
        text: 'キャラクターサムネイルを表示する',
        devMemo: 'characterVisible',
        show: () => canShowCharacterSettings.value || (isDev && base.value.showCharacterThumbnail),
      },
    ]
    return allSettings.filter((s) => !s.show || s.show())
  })

  // 修正後の previewMessages
  const previewMessages = computed(() => {
    return Array(2)
      .fill(null)
      .map((_, i) => {
        const charIndex = i < characterArray.value.length ? i : 0
        const character = characterArray.value[charIndex]
        return BotMessageSchema.parse({
          color: character?.color,
          comment: i === 0 ? 'テストコメントです' : 'テストユーザーの運勢は【大吉】長文のテストコメントです。',
        })
      })
  })

  const updateField = (field: BaseSettingsKey, value: any) => {
    omikujiStore.updateDisplaySettings({
      base: { ...base.value, [field]: value },
    })
  }

  const resetField = (field: BaseSettingsKey) => {
    updateField(field, BaseSettingsSchema.parse({})[field])
  }
</script>
