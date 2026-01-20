<!-- src\ConfigMaker\components\componentEditor\toast\ToastComponentEditor.vue -->
<template>
  <!-- サンプル表示 -->
  <div class="flex flex-col">
    <!-- トーストサンプル -->
    <div :class="!toastSettings.showToastsOnRight ? 'self-start' : 'self-end'">
      <ToastBubbleItem
        v-for="(message, i) in previewMessages"
        :key="i"
        :message="message.bubble?.message ?? '(未記入)'"
        :color="message.bubble?.color ?? bubbleSettings.defaultColor"
        :iconLayers="iconSrc(message.bubble?.characterKey ?? null, message.bubble?.iconKey ?? 'default')"
        :showToastsOnRight="toastSettings.showToastsOnRight"
      />
    </div>

    <!-- サムネイルサンプル表示 -->
    <div
      v-if="isCharacter"
      class="flex flex-row gap-4 mt-2"
      :class="toastSettings.showToastsOnRight ? 'flex-row self-end' : 'flex-row-reverse self-start'"
    >
      <div>(OBSの対話モードでマウスを近づけると、キャラクターが表示され投稿テストができます)</div>
      <CharacterThumbnailsPreview :charactersArray="characterArray" :hoverVisibility="true" />
      <CharacterThumbnailsPreview :charactersArray="thumbnailCharacters" :hoverVisibility="false" />
    </div>
  </div>

  <!-- デフォルトカラー設定 -->
  <template v-if="!isCharacter">
    <ColorModeSelector
      :model-value="bubbleSettings.defaultColor"
      @update:model-value="(value) => updateBubbleField('defaultColor', value)"
    />
    <InformationCard>
      <p>デフォルトカラーは、フキダシ・トースト共通です。</p>
    </InformationCard>
  </template>

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
      v-model="toastSettings.showToastsOnRight"
      @change="(e) => updateField('showToastsOnRight', (e.target as HTMLInputElement).checked)"
    />
    <span class="ml-2"> {{ toastSettings.showToastsOnRight ? '右' : '左' }}側に表示する </span>
  </SettingItem>

  <template v-if="isCharacter">
    <SettingItem
      label="キャラクター表示"
      description="トーストにキャラクターアイコンを表示するか"
      :showReset="true"
      @reset="resetMap.showToastsCharacter"
    >
      <input
        type="checkbox"
        class="toggle toggle-primary"
        v-model="toastSettings.showToastsCharacter"
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
        @update:selectedKeys="(keys) => updateField('showThumbnail', keys)"
      />
    </SettingItem>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageBubbleSchema, SettingsToastSchema } from '@/types/'
  import CharacterBadgeSelector from './CharacterBadgeSelector.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import ToastBubbleItem from '@/common/ui/ToastWidgets/ToastBubbleItem.vue'
  import CharacterThumbnailsPreview from '@/common/ui/ToastWidgets/CharacterThumbnailsPreview.vue'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
  import ColorModeSelector from '@config/components/common/ThemeColorPicker/ColorModeSelector.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isCharacter } = useVisibilityAccess()
  const { iconSrc } = useCharacterManager()

  const toastSettings = computed(() => data.value.components.toast)
  const bubbleSettings = computed(() => data.value.components.bubble)
  const characterArray = computed(() => Object.values(data.value.characters))

  // showThumbnail に含まれるキーを持つキャラクターのみをフィルタリング
  const thumbnailCharacters = computed(() => {
    const selectedKeys = new Set(toastSettings.value.showThumbnail)
    return characterArray.value.filter((character) => selectedKeys.has(character.key))
  })

  // 更新関数（値を直接受け取る）
  const updateField = <K extends keyof typeof toastSettings.value>(
    field: K,
    value: (typeof toastSettings.value)[K]
  ) => {
    omikujiStore.updateNestedComponents('toast', {
      ...toastSettings.value,
      [field]: value,
    })
  }

  // 更新関数（値を直接受け取る）
  const updateBubbleField = <K extends keyof typeof bubbleSettings.value>(
    field: K,
    value: (typeof bubbleSettings.value)[K]
  ) => {
    omikujiStore.updateNestedComponents('bubble', {
      ...bubbleSettings.value,
      [field]: value,
    })
  }

  // リセット関数
  const resetField = (field: keyof typeof toastSettings.value) => {
    const defaults = SettingsToastSchema.parse({})
    updateField(field, defaults[field])
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
        const messageText = i === 0 ? 'テストコメントです' : 'テストユーザーの運勢は【大吉】長文のテストコメントです。'
        return BotMessageBubbleSchema.parse({
          bubble: {
            message: messageText,
            isToast: true,
            characterKey: isCharacter.value && toastSettings.value.showToastsCharacter ? character.key : undefined,
            color: isCharacter.value ? character.color : bubbleSettings.value.defaultColor,
          },
        })
      })
  })
</script>
