<!-- src\ConfigMaker\components\displaySettings\components\BubbleComponentCharacterEditor.vue -->
<template>
  <div class="relative card bg-base-100">
    <div class="card-body p-4 gap-4">
      <!-- キャラクターサンプル表示 -->
      <CharacterAvatarPreview
        :characters="data.characters"
        :showCharacters="bubble.showCharacters"
        :characterSize="bubble.characterSize"
      />

      <!-- 状態説明 -->
      <div class="flex justify-center">
        <span>{{ statusText }}</span>
      </div>
    </div>
  </div>

  <!-- キャラクター選択 -->
  <SettingItem
    label="表示するキャラクター"
    description="表示対象のキャラクターを選択します"
    :showReset="true"
    @reset="resetMap.showCharacters"
  >
    <BubbleCharactersEditor />
  </SettingItem>

  <!-- キャラクターフレームの使用 -->
  <SettingItem
    label="キャラクター画像の背景色"
    description="キャラ画像の背景に色を付けるかを設定します"
    :showReset="true"
    @reset="resetMap.showCharacterFrame"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="bubble.showCharacterFrame"
        @change="(e) => updateBubbleField('showCharacterFrame', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">背景色を付ける</span>
    </label>
  </SettingItem>

  <!-- キャラクターサイズ -->
  <SettingItem
    label="キャラクターサイズ"
    description="キャラクター画像の横幅(px)"
    :showReset="true"
    @reset="resetMap.characterSize"
  >
    <input
      type="range"
      min="12"
      max="80"
      step="4"
      :value="bubble.characterSize"
      @input="(e) => updateBubbleField('characterSize', Number((e.target as HTMLInputElement).value))"
      class="range range-primary w-full"
    />
    <div class="mt-2 text-sm">現在値: {{ bubble.characterSize * 4 }}px</div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsBubbleSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import BubbleCharactersEditor from './BubbleCharactersEditor.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import CharacterAvatarPreview from '../CharacterPreview.vue'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 個別のcomputed値（読み取り専用）
  const bubble = computed(() => data.value.displaySettings.components.bubble)
  const characters = computed(() => data.value.characters)

  // 汎用的な更新関数
  const updateBubbleField = (field: keyof typeof bubble.value, value: any) => {
    omikujiStore.updateNestedDisplaySettings('components', {
      bubble: {
        ...bubble.value,
        [field]: value,
      },
    })
  }

  // 共通リセット関数
  const resetField = (field: keyof typeof bubble.value) => {
    const schemaDefaults = SettingsBubbleSchema.parse({})
    const defaultValue = schemaDefaults[field]
    updateBubbleField(field, defaultValue)
  }

  // フィールドごとのリセット関数マップ
  const resetMap = {
    showCharacters: () => resetField('showCharacters'),
    showCharacterFrame: () => resetField('showCharacterFrame'),
    characterSize: () => resetField('characterSize'),
  }

  const statusText = computed(() =>
    bubble.value.showCharacterFrame ? '背景色ありで表示されます' : '背景色なしで表示されます'
  )
</script>
