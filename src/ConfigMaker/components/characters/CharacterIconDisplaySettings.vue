<!-- src/configMaker/components/characters/CharacterIconDisplaySettings.vue -->
<template>
  <!-- isIconDisplay  -->
  <SettingItem
    v-if="
      useVisibilityAccess().canShow('characterVisible') ||
      (isDev && currentDisplayOption.isIconDisplay && !useVisibilityAccess().canShow('characterVisible'))
    "
    :variant="!useVisibilityAccess().canShow('characterVisible') ? 'error' : 'none'"
    label="キャラクター表示"
    description="ONで画像とフキダシを表示、OFFでフキダシのみ表示"
    devMemo="characterVisible"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        type="checkbox"
        class="checkbox checkbox-primary"
        :checked="currentDisplayOption.isIconDisplay"
        @change="updateDisplayField('isIconDisplay', ($event.target as HTMLInputElement).checked)"
      />
      <span class="label-text font-medium">有効にするとジェネレーター用画像の設定が可能になります</span>
    </label>
  </SettingItem>

  <!-- isOneCommePost -->
  <SettingItem label="BOTコメントをわんコメに投稿" description="わんコメにBOTコメントとして表示させるか">
    <label class="label cursor-pointer justify-start gap-3">
      <input
        type="checkbox"
        class="checkbox checkbox-primary"
        :checked="currentDisplayOption.isOneCommePost"
        @change="updateDisplayField('isOneCommePost', ($event.target as HTMLInputElement).checked)"
      />
      <span class="label-text font-medium">有効にすると「キャラクター用枠設定」の設定ができます</span>
    </label>
  </SettingItem>

  <!-- isVoice  -->
  <SettingItem
    v-if="!currentDisplayOption.isOneCommePost"
    label="BOTコメントの読み上げ"
    description="BOTコメントをわんコメで鳴らすか"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        type="checkbox"
        class="checkbox checkbox-primary"
        :checked="currentDisplayOption.isVoice"
        @change="updateDisplayField('isVoice', ($event.target as HTMLInputElement).checked)"
      />
      <span class="label-text font-medium">読み上げの声は「わんコメの標準設定」が使われます</span>
    </label>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { DisplayOptionType, isDev } from '@/types/'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  const props = defineProps<{
    modelValue: DisplayOptionType
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { selectedItemKey } = storeToRefs(omikujiStore)

  // 現在の表示オプションを取得
  const currentDisplayOption = computed(() => props.modelValue)

  // 表示オプションフィールドを更新する関数
  const updateDisplayField = (key: keyof DisplayOptionType, value: any) => {
    if (!selectedItemKey.value) return

    // storeを使って更新
    omikujiStore.updateRecordProperty('characters', selectedItemKey.value, 'displayOption', {
      ...currentDisplayOption.value,
      [key]: value,
    })
  }
</script>
