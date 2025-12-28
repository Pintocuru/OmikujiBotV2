<!-- src/configMaker/components/characters/CharacterIconDisplaySettings.vue -->
<template>
  <!-- mode  -->
  <SettingItem
    :variant="!useVisibilityAccess().canShowUsage('characters') ? 'error' : 'none'"
    label="BOTコメント表現方法"
    description="BOTの文章を表現する方法を指定します"
  >
    <select
      v-model="currentDisplayOption.mode"
      @change="updateDisplayField('mode', ($event.target as HTMLSelectElement).value)"
      class="select select-bordered w-full max-w-xs"
    >
      <option v-for="(value, key) in displayModeLabels" :key="key" :value="key">
        {{ value }}
      </option>
    </select>
  </SettingItem>

  <div v-if="currentDisplayOption.mode === 'comment'">
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
  </div>

  <!-- わんコメの枠を指定 -->
  <SettingItem
    v-if="currentDisplayOption.mode === 'comment'"
    label="枠のID名"
    description="わんコメに同じIDの枠がなければ新規作成されます"
  >
    <input type="text" class="input w-full" v-model="currentDisplayOption.frameId" />
  </SettingItem>

  <!-- imageBase64 -->
  <CharacterBase64Settings v-if="currentDisplayOption.mode === 'comment'" :selectedItemKey="selectedItemKey" />

  <!-- rpgVoice  -->
  <SettingItem
    v-if="currentDisplayOption.mode === 'rpgVoice'"
    label="文字送り&RPG風の読み上げ"
    description="BOTコメントを音入りで表示するか"
  >
    <select
      v-model="currentDisplayOption.rpgVoice"
      @change="onSoundChange($event)"
      class="select select-bordered w-full max-w-xs"
    >
      <option value="">なし</option>
      <option v-for="(value, key) in rpgVoiceMap" :key="key" :value="key">
        {{ key }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { displayModeLabels, DisplayOptionType, isDev } from '@/types/'
  import CharacterBase64Settings from './CharacterBase64Settings.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useAccessCheckerConfig'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { playRpgVoiceLoop, rpgVoiceMap } from '@/Toolkit/sounds'
  import InformationCard from '@shared/components/parts/InformationCard.vue'

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

  // サウンド
  const onSoundChange = (event: Event) => {
    const soundName = (event.target as HTMLSelectElement).value
    if (soundName) {
      playRpgVoiceLoop(
        'こんな文章でも読んでくれてありがとう！これでもこのメッセージ、意味があるからな！文字の長さしか見ないけど！',
        soundName
      )
    }
    updateDisplayField('rpgVoice', soundName)
  }
</script>
