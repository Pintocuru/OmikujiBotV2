<!-- src\ConfigMaker\components\displaySettings\components\ToastComponentEditor.vue -->
<template>
  <div class="card p-2 bg-base-100 flex flex-col">
    <!-- トースト・サムネイルサンプル表示 -->
    <ChatBubbleItem
      v-for="(message, i) in previewMessages"
      :key="i"
      :botMessage="message"
      :showToastsOnRight="toast.showToastsOnRight"
      :character="toast.showToastsCharacter ? (characterArray[i] ?? characterArray[0]) : null"
      :class="!toast.showToastsOnRight ? 'self-start' : 'self-end'"
    />
    <CharacterThumbnailsPreview
      v-if="toast.showThumbnail.length !== 0"
      :characters="characterArray"
      :class="!toast.showToastsOnRight ? 'self-start' : 'self-end'"
    />
  </div>

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
      :checked="toast.showToastsOnRight"
      @change="(e) => updateToastField('showToastsOnRight', (e.target as HTMLInputElement).checked)"
    />
    <span class="ml-2">右側に表示する</span>
  </SettingItem>

  <SettingItem
    label="キャラクター表示"
    description="トーストにキャラクターアイコンを表示するか"
    :showReset="true"
    @reset="resetMap.showToastsCharacter"
  >
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="toast.showToastsCharacter"
      @change="(e) => updateToastField('showToastsCharacter', (e.target as HTMLInputElement).checked)"
    />
    <span class="ml-2">キャラクターを表示する</span>
  </SettingItem>

  <SettingItem
    label="サムネイル表示キャラクター"
    description="右下にサムネイルとして表示するキャラクターを選択します"
    :showReset="true"
    @reset="resetMap.showThumbnail"
  >
    <select
      multiple
      class="select select-bordered w-full"
      :value="toast.showThumbnail"
      @change="
        (e) =>
          updateToastField(
            'showThumbnail',
            Array.from((e.target as HTMLSelectElement).selectedOptions).map((o) => o.value)
          )
      "
    >
      <option v-for="charKey in Object.keys(data.characters)" :key="charKey" :value="charKey">
        {{ data.characters[charKey].displayName }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsToastSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { BotMessageSchema } from '@/types/BotComponents/BotMessageSchema'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import ChatBubbleItem from '@/MainGenerator/components/ToastWidgets/ToastBubbleItem.vue'
  import CharacterThumbnailsPreview from '@/MainGenerator/components/ToastWidgets/CharacterThumbnailsPreview.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const toast = computed(() => data.value.displaySettings.components.toast)
  const characterArray = computed(() => Object.values(data.value.characters))

  // 更新関数
  const updateToastField = (field: keyof typeof toast.value, value: any) => {
    omikujiStore.updateNestedDisplaySettings('components', {
      toast: {
        ...toast.value,
        [field]: value,
      },
    })
  }

  // リセット関数
  const resetField = (field: keyof typeof toast.value) => {
    const defaults = SettingsToastSchema.parse({})
    updateToastField(field, defaults[field])
  }

  const resetMap = {
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
        const character = characterArray.value[charIndex]
        return BotMessageSchema.parse({
          color: character?.color,
          comment: i === 0 ? 'テストコメントです' : 'テストユーザーの運勢は【大吉】長文のテストコメントです。',
        })
      })
  })
</script>
