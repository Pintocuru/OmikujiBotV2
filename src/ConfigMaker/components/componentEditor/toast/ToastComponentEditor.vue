<!-- src\ConfigMaker\components\componentEditor\toast\ToastComponentEditor.vue -->
<template>
  <div class="card p-2 bg-base-100 flex flex-col">
    <!-- トーストサンプル表示 -->
    <ToastBubbleItem
      v-for="(message, i) in previewMessages"
      :key="i"
      :botMessage="message"
      :showToastsOnRight="toastSettings.showToastsOnRight"
      :character="toastSettings.showToastsCharacter ? (characterArray[i] ?? characterArray[0]) : null"
      :class="!toastSettings.showToastsOnRight ? 'self-start' : 'self-end'"
    />

    <!-- サムネイルサンプル表示 -->
    <div
      class="flex flex-row gap-4 mt-2"
      :class="toastSettings.showToastsOnRight ? 'flex-row self-end' : 'flex-row-reverse self-start'"
    >
      <div>(OBSの対話モードでマウスを近づけると、キャラクターが表示され投稿テストができます)</div>
      <CharacterThumbnailsPreview :characters="characterArray" :hoverVisibility="true" />
      <CharacterThumbnailsPreview :characters="filteredCharacters" :hoverVisibility="false" />
    </div>
  </div>

  <!-- デフォルトカラー設定 -->
  <SettingItem
    v-if="!isCharacter"
    label="デフォルトカラー設定"
    description="キャラクターが非表示の際はこのカラーが使用されます"
  >
    <ColorModeSelector
      :model-value="toastSettings.defaultColor"
      @update:model-value="updateField('defaultColor', $event)"
    />
  </SettingItem>

  <!-- 設定項目 -->
  <SettingItem
    label="トースト位置"
    description="通知メッセージを右側に表示するかどうか"
    :showReset="true"
    @reset="resetMap.showToastsOnRight"
  >
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="toastSettings.showToastsOnRight"
      @change="(e) => updateField('showToastsOnRight', (e.target as HTMLInputElement).checked)"
    />
    <span class="ml-2">
      {{ toastSettings.showToastsOnRight ? '右側に表示する' : '左側に表示する' }}
    </span>
  </SettingItem>

  <SettingItem
    v-if="
      useVisibilityAccess().canShowUsage('characters') ||
      (isDev && toastSettings.showToastsCharacter && !useVisibilityAccess().canShowUsage('characters'))
    "
    label="キャラクター表示"
    description="トーストにキャラクターアイコンを表示するか"
    devMemo="characterVisible"
    :variant="!useVisibilityAccess().canShowUsage('characters') ? 'error' : 'none'"
    :showReset="true"
    @reset="resetMap.showToastsCharacter"
  >
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="toastSettings.showToastsCharacter"
      @change="(e) => updateField('showToastsCharacter', (e.target as HTMLInputElement).checked)"
    />
    <span class="ml-2">キャラクターを表示する</span>
  </SettingItem>

  <SettingItem
    label="サムネイル表示キャラクター"
    description="右下にサムネイルとして表示するキャラクターを選択します"
    :showReset="true"
    @reset="resetMap.showThumbnail"
  >
    <CharacterBadgeSelector
      :characters="data.characters"
      :selectedKeys="toastSettings.showThumbnail"
      @update:selectedKeys="(keys: string[]) => updateField('showThumbnail', keys)"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, Ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev, SettingsToastSchema } from '@/types'
  import { BotMessageSchema } from '@/types/BotComponents/BotMessageSchema'
  import CharacterBadgeSelector from './CharacterBadgeSelector.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { hasAccess, useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import ColorModeSelector from '@ConfigComponents/characters/color/ColorModeSelector.vue'
  import ToastBubbleItem from '@/MainGenerator/components/ToastWidgets/ToastBubbleItem.vue'
  import CharacterThumbnailsPreview from '@/MainGenerator/components/ToastWidgets/CharacterThumbnailsPreview.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const toastSettings = computed(() => data.value.components.toast)
  const characterArray = computed(() => Object.values(data.value.characters))
  const isCharacter = computed(() => hasAccess(data.value.featureUsage.usage.characters))
  // showThumbnail に含まれるキーを持つキャラクターのみをフィルタリング
  const filteredCharacters = computed(() => {
    const selectedKeys = new Set(toastSettings.value.showThumbnail)
    return characterArray.value.filter((character) => selectedKeys.has(character.key))
  })

  // 更新関数
  const updateField = (field: keyof typeof toastSettings.value, value: any) => {
    omikujiStore.updateNestedComponents('toast', {
      ...toastSettings.value,
      [field]: value,
    })
  }

  // リセット関数
  const resetField = (field: keyof typeof toastSettings.value) => {
    const defaults = SettingsToastSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    defaultColor: () => resetField('defaultColor'),
    showToastsOnRight: () => resetField('showToastsOnRight'),
    showToastsCharacter: () => resetField('showToastsCharacter'),
    showThumbnail: () => resetField('showThumbnail'),
  }

  // プレビュー用メッセージ
  const previewMessages = computed(() => {
    return Array(2)
      .fill(null)
      .map((_, i) => {
        const charIndex = i < characterArray.value.length ? i : 0
        const character = characterArray.value[charIndex] // ★ 修正: comment を { toast: string } 構造にする
        const messageText = i === 0 ? 'テストコメントです' : 'テストユーザーの運勢は【大吉】長文のテストコメントです。'
        return BotMessageSchema.parse({
          color: isCharacter.value ? character?.color : toastSettings.value.defaultColor,
          message: { toast: messageText },
        })
      })
  })
</script>
