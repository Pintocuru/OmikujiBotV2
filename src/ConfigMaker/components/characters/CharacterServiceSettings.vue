<!-- src/configMaker/components/characters/CharacterServiceSettings.vue -->
<template>
  <div v-if="localData">
    <!-- 補足説明 -->
    <InformationCard class="mb-4">
      キャラクター専用の枠を作成すると、各キャラクターごとに
      <code class="label bg-accent text-accent-content">「読み上げ」設定</code>を個別に行うことができます。<br />
      詳しくは
      <a
        href="https://onecomme.com/docs/guide/speech"
        target="_blank"
        rel="noopener"
        class="inline-block px-2 py-1 rounded bg-secondary text-secondary-content hover:bg-secondary/70 transition"
      >
        読み上げ機能を使う
      </a>
      をお読みください。
    </InformationCard>

    <!-- チェックボックス -->
    <SettingItem
      label="枠のID名"
      description="わんコメに同じIDの枠がなければ新規作成されます"
      :showReset="true"
      @reset="localData.frameId = localData.id"
    >
      <input type="text" class="input w-full" v-model="localData.frameId" />
    </SettingItem>

    <!-- わんコメ投稿用画像設定 -->
    <CharacterBase64Settings v-if="localData.displayOption.isOneCommePost" :selectedRuleId="selectedRuleId" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import CharacterBase64Settings from './CharacterBase64Settings.vue'
  import SettingItem from '@shared/components/parts/SettingItem.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

  const props = defineProps<{
    selectedRuleId: string | null
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  const localData = computed<CharacterType | undefined>({
    get: () => {
      if (!props.selectedRuleId) return
      return omikujiStore.getItem<CharacterType>('characters', props.selectedRuleId) ?? undefined
    },

    set: (value?: CharacterType) => {
      if (!props.selectedRuleId || !value) return
      omikujiStore.updateItem('characters', props.selectedRuleId, value)
    },
  })
</script>
