<template>
  <div class="card bg-base-100 flex flex-col">
    <!-- トースト・サムネイルサンプル表示 -->
    <div class="self-end">
      <ChatBubbleItem :message="firstMessage" :character="firstCharacter" />
    </div>
    <div class="self-end">
      <ChatBubbleItem :message="secondMessage" :character="secondCharacter" />
    </div>
    <div class="self-end">
      <CharacterThumbnailsPreview :characters="Object.values(characters)" />
    </div>
  </div>

  <!-- トースト表示 -->
  <SettingItem
    label="トースト通知"
    description="画面上部に通知メッセージを表示します"
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
      <span class="label-text">トースト通知を表示する</span>
    </label>
  </SettingItem>

  <!-- キャラクターサムネイル表示 -->
  <SettingItem
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
    if (!firstCharacter.value) return null
    return BotMessageSchema.parse({
      color: firstCharacter.value.color,
      comment: 'テストコメントです',
    })
  })

  // 2つ目のメッセージ（指定された内容）
  const secondMessage = computed(() => {
    if (!secondCharacter.value) return null
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
    showToasts: () => resetField('showToasts'),
    showCharacterThumbnail: () => resetField('showCharacterThumbnail'),
  }
</script>
