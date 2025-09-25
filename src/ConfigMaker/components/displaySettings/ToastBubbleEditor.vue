<!-- src\ConfigMaker\components\displaySettings\ToastBubbleEditor.vue -->
<template>
  <div class="card p-2 bg-base-100 flex flex-col">
    <!-- トースト・サムネイルサンプル表示 -->
    <div v-if="base.showToasts" :class="!base.showToastsOnRight ? 'self-start' : 'self-end'">
      <ChatBubbleItem
        :botMessage="createMessage(0, 'テストコメントです')"
        :showToastsOnRight="base.showToastsOnRight"
        :character="base.showToastsCharacter ? getCharacterByIndex(0) : null"
        :displaySize="base.displaySize"
      />
    </div>
    <div v-if="base.showToasts" :class="!base.showToastsOnRight ? 'self-start' : 'self-end'">
      <ChatBubbleItem
        :botMessage="createMessage(1, 'テストユーザーの運勢は【大吉】長文のテストコメントです。')"
        :showToastsOnRight="base.showToastsOnRight"
        :character="base.showToastsCharacter ? getCharacterByIndex(1) : null"
        :displaySize="base.displaySize"
      />
    </div>
    <div v-if="base.showCharacterThumbnail" :class="!base.showToastsOnRight ? 'self-start' : 'self-end'">
      <CharacterThumbnailsPreview :characters="Object.values(characters)" :displaySize="base.displaySize" />
    </div>
  </div>

  <!-- トースト・サムネイル位置 -->
  <SettingItem
    label="トースト・サムネイル位置"
    description="画面上部に通知メッセージを表示します"
    :showReset="true"
    @reset="() => resetField('showToastsOnRight')"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.showToastsOnRight"
        @change="(e) => updateField('showToastsOnRight', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">OFFで左側、ONで右側に表示します</span>
    </label>
  </SettingItem>

  <!-- トースト表示 -->
  <SettingItem
    label="トースト表示"
    description="トーストの表示・非表示を切り替えます"
    :showReset="true"
    @reset="() => resetField('showToasts')"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.showToasts"
        @change="(e) => updateField('showToasts', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">トーストを表示する</span>
    </label>
  </SettingItem>

  <!-- トーストにキャラクターを表示するか -->
  <SettingItem
    v-if="canShowCharacterSettings || (isDev && base.showToastsCharacter)"
    devMemo="characterVisible"
    label="トーストのキャラクター表示"
    description="表示できるキャラクターは default のみです"
    :showReset="true"
    @reset="() => resetField('showToastsCharacter')"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.showToastsCharacter"
        @change="(e) => updateField('showToastsCharacter', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">トーストの隣にキャラクターアイコンを表示する</span>
    </label>
  </SettingItem>

  <!-- キャラクターサムネイル表示 -->
  <SettingItem
    v-if="canShowCharacterSettings || (isDev && base.showCharacterThumbnail)"
    devMemo="characterVisible"
    label="キャラクターサムネイル"
    description="右下にキャラクターのサムネイルを表示します"
    :showReset="true"
    @reset="() => resetField('showCharacterThumbnail')"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.showCharacterThumbnail"
        @change="(e) => updateField('showCharacterThumbnail', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">キャラクターサムネイルを表示する</span>
    </label>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { isDev } from '@/types'
  import { BotMessageSchema } from '@/types/BotComponents/BotMessageSchema'
  import { BaseSettingsSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import ChatBubbleItem from '@/MainGenerator/components/ToastWidgets/ToastBubbleItem.vue'
  import CharacterThumbnailsPreview from '@/MainGenerator/components/ToastWidgets/CharacterThumbnailsPreview.vue'
  import { storeToRefs } from 'pinia'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const characters = computed(() => data.value.characters)
  const base = computed(() => data.value.displaySettings.base)
  const characterArray = computed(() => Object.values(characters.value))

  // 条件式の抽出
  const canShowCharacterSettings = computed(() => useVisibilityAccess().canShow('characterVisible'))

  // 汎用的な更新・リセット関数
  const updateField = (field: keyof typeof base.value, value: any) => {
    omikujiStore.updateDisplaySettings({
      base: { ...base.value, [field]: value },
    })
  }

  const resetField = (field: keyof typeof base.value) => {
    const schemaDefaults = BaseSettingsSchema.parse({})
    updateField(field, schemaDefaults[field])
  }

  // キャラクター取得の統合
  const getCharacterByIndex = (index: number) => {
    return characterArray.value[index] || characterArray.value[0] || null
  }

  // メッセージ作成の共通化
  const createMessage = (characterIndex: number, comment: string) => {
    const character = getCharacterByIndex(characterIndex)
    if (!character) return undefined
    return BotMessageSchema.parse({
      color: character.color,
      comment,
    })
  }
</script>
