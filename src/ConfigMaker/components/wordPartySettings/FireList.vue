<!-- src/configMaker/components/wordPartySettings/wordPartyFireList.vue -->
<template>
  <SectionCard>
    <template #header>
      <div>WordParty発動リスト ({{ settings.length }}件)</div>
      <div class="text-sm pr-2">デフォルトでは、「おみくじBOT用 word-party」のデータが入っています</div>
    </template>

    <template #body>
      <!-- リスト表示 -->
      <div v-if="settings.length > 0" class="mb-4">
        <!-- グリッドレイアウト -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-1 max-h-96 overflow-y-auto">
          <div
            v-for="(item, index) in settings"
            :key="index"
            class="flex items-center gap-2 border-b border-base-200 text-sm py-1 px-2 hover:bg-base-200"
          >
            <!-- 名前 -->
            <div class="w-32 truncate text-primary-content">
              {{ item.name || '名前未設定' }}
            </div>

            <!-- パターン -->
            <div class="flex-1 font-mono text-base-content truncate">
              {{ item.pattern || 'パターン未設定' }}
            </div>

            <!-- テストボタン -->
            <button @click="testWordParty(item.pattern)" :disabled="!item.pattern" class="btn btn-xs btn-primary">
              テスト実行
            </button>
          </div>
        </div>
      </div>

      <!-- 空の場合の表示 -->
      <div v-else>
        <NoParamsCard message="WordParty設定がありません" sub="テキスト編集から追加してください" />
      </div>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { WordPartySettings } from '@/types/OmikujiData/WordPartySettings'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import NoParamsCard from '@ConfigComponents/parts/NoParamsCard.vue'
  import { postWordParty } from '@shared/sdk/postMessage/PostOneComme'

  defineProps<{
    settings: WordPartySettings[]
  }>()

  // WordPartyテスト実行
  function testWordParty(rawPattern: string) {
    if (!rawPattern) return

    // 正規表現の前後のメタ文字（^ や $ など）を除去
    const pattern = rawPattern.replace(/^[\^\s]+|[\$\s]+$/g, '')

    // 非同期呼び出し（await 不要）
    postWordParty(pattern).catch((error) => {
      console.error('WordPartyテスト実行エラー:', error)
    })
  }
</script>
