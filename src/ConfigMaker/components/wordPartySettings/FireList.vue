<!-- src/configMaker/components/wordPartySettings/wordPartyFireList.vue -->
<template>
  <div v-if="settings.length > 0">
    <div class="grid grid-cols-1 md:grid-cols-2 max-h-96 overflow-y-auto">
      <div
        v-for="(item, index) in settings"
        :key="index"
        class="flex items-center gap-2 border-base-200 text-sm py-1 px-2 hover:bg-base-100"
      >
        <div class="badge badge-sm badge-primary w-32 truncate text-primary-content">
          {{ item.name || '名前未設定' }}
        </div>

        <div class="flex-1 font-mono text-base-content truncate">
          {{ item.pattern || 'パターン未設定' }}
        </div>

        <!-- 分割したボタンを使用 -->
        <WordPartyTestButton :pattern="item.pattern" />
      </div>
    </div>
  </div>
  <div v-else>
    <NoParamsCard message="WordParty設定がありません" sub="テキスト編集から追加してください" />
  </div>
</template>

<script setup lang="ts">
  import { WordPartySettings } from '@/types/OmikujiData/WordPartySettings'
  import WordPartyTestButton from './WordPartyTestButton.vue'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'

  defineProps<{
    settings: WordPartySettings[]
  }>()
</script>
