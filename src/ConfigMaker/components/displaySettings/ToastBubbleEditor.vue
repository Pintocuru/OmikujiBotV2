<!-- src\ConfigMaker\components\displaySettings\ToastBubbleEditor.vue -->
<template>
  <div class="card p-2 bg-base-100 flex flex-col">
    <!-- トースト・サムネイルサンプル表示 -->
    <div v-if="base.showToasts" :class="!base.showToastsOnRight ? 'self-start' : 'self-end'">
      <ChatBubbleItem
        :botMessage="firstMessage"
        :showToastsOnRight="base.showToastsOnRight"
        :character="base.showToastsCharacter ? firstCharacter : null"
        :displaySize="base.displaySize"
      />
    </div>
    <div v-if="base.showToasts" :class="!base.showToastsOnRight ? 'self-start' : 'self-end'">
      <ChatBubbleItem
        :botMessage="secondMessage"
        :showToastsOnRight="base.showToastsOnRight"
        :character="base.showToastsCharacter ? secondCharacter : null"
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
    @reset="resetMap.showToastsOnRight"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.showToastsOnRight"
        @change="(e) => updateBaseField('showToastsOnRight', (e.target as HTMLInputElement).checked)"
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
    @reset="resetMap.showToasts"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.showToasts"
        @change="(e) => updateBaseField('showToasts', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">トーストを表示する</span>
    </label>
  </SettingItem>

  <!-- トーストにキャラクターを表示するか -->
  <SettingItem
    v-if="
      useVisibilityAccess().canShow('characterVisible') ||
      (isDev && !useVisibilityAccess().canShow('characterVisible') && base.showToastsCharacter)
    "
    devMemo="characterVisible"
    label="トーストのキャラクター表示"
    description="キャラクターアイコンは default のみです"
    :showReset="true"
    @reset="resetMap.showToastsCharacter"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.showToastsCharacter"
        @change="(e) => updateBaseField('showToastsCharacter', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">トーストの隣にキャラクターアイコンを表示する</span>
    </label>
  </SettingItem>

  <!-- キャラクターサムネイル表示 -->
  <SettingItem
    v-if="
      useVisibilityAccess().canShow('characterVisible') ||
      (isDev && !useVisibilityAccess().canShow('characterVisible') && base.showCharacterThumbnail)
    "
    devMemo="characterVisible"
    label="キャラクターサムネイル"
    description="右下にキャラクターのサムネイルを表示します"
    :showReset="true"
    @reset="resetMap.showCharacterThumbnail"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.showCharacterThumbnail"
        @change="(e) => updateBaseField('showCharacterThumbnail', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">キャラクターサムネイルを表示する</span>
    </label>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { storeToRefs } from 'pinia'
  import { BaseSettingsSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import ChatBubbleItem from '@/MainGenerator/components/OmikujiBot/ChatBubbleItem.vue'
  import { BotMessageSchema } from '@/types/BotComponents/BotMessageSchema'
  import CharacterThumbnailsPreview from '@/MainGenerator/components/OmikujiBot/CharacterThumbnailsPreview.vue'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'
  import { isDev } from '@/types'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const characters = computed(() => data.value.characters)

  // 個別のcomputed値（読み取り専用）
  const base = computed(() => data.value.displaySettings.base)

  // 汎用的な更新関数
  const updateBaseField = (field: keyof typeof base.value, value: any) => {
    omikujiStore.updateDisplaySettings({
      base: {
        ...base.value,
        [field]: value,
      },
    })
  }

  // キャラクターの配列を取得
  const characterArray = computed(() => Object.values(characters.value))

  // 最初のキャラクターを取得
  // TODO:設定によりON/OFFを可能にさせる
  const firstCharacter = computed(() => characterArray.value[0] || null)

  // 2番目のキャラクター（存在しない場合は最初のキャラクターを使用）
  const secondCharacter = computed(() => characterArray.value[1] || characterArray.value[0] || null)

  // 1つ目のメッセージ
  const firstMessage = computed(() => {
    if (!firstCharacter.value) return
    return BotMessageSchema.parse({
      color: firstCharacter.value.color,
      comment: 'テストコメントです',
    })
  })

  // 2つ目のメッセージ（指定された内容）
  const secondMessage = computed(() => {
    if (!secondCharacter.value) return
    return BotMessageSchema.parse({
      color: secondCharacter.value.color,
      comment: 'テストユーザーの運勢は【大吉】長文のテストコメントです。',
    })
  })

  // 共通リセット関数
  const resetField = (field: keyof typeof base.value) => {
    const schemaDefaults = BaseSettingsSchema.parse({})
    const defaultValue = schemaDefaults[field]
    updateBaseField(field, defaultValue)
  }

  // フィールドごとのリセット関数マップ
  const resetMap = {
    showToastsOnRight: () => resetField('showToastsOnRight'),
    showToasts: () => resetField('showToasts'),
    showToastsCharacter: () => resetField('showToastsCharacter'),
    showCharacterThumbnail: () => resetField('showCharacterThumbnail'),
  }
</script>
