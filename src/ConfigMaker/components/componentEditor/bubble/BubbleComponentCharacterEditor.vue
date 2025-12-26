<!-- src\ConfigMaker\components\componentEditor\bubble\BubbleComponentCharacterEditor.vue -->
<template>
  <div class="relative card bg-base-100">
    <div class="card-body p-4 gap-4">
      <!-- キャラクターサンプル表示 -->
      <CharacterAvatarPreview
        :characters="characters"
        :showCharacters="bubble.showCharacters"
        :characterSize="bubble.characterSize"
      />
    </div>
  </div>

  <!-- キャラクター選択 -->
  <SettingItem label="表示するキャラクター" description="表示対象のキャラクターを選択します">
    <BubbleCharactersEditor />
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
      min="16"
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
  import CharacterAvatarPreview from './CharacterAvatarPreview.vue'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 個別のcomputed値（読み取り専用）
  const bubble = computed(() => data.value.displaySettings.components.bubble)
  const characters = computed(() => data.value.characters)

  // 汎用的な更新関数
  const updateBubbleField = (field: keyof typeof bubble.value, value: any) => {
    omikujiStore.updateNestedComponents('bubble', {
      ...bubble.value,
      [field]: value,
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
    characterSize: () => resetField('characterSize'),
  }
</script>
