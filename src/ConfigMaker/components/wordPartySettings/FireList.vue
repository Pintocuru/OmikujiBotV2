<!-- src/configMaker/components/wordPartySettings/wordPartyFireList.vue -->
<template>
  <div class="card bg-base-300 shadow-lg">
    <div class="card-title bg-secondary text-secondary-content text-lg p-2 pl-4 rounded-t">
      WordParty発火リスト ({{ settings.length }}件)
    </div>
    <div class="card-body">
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
            <div class="w-32 truncate text-primary">
              {{ item.name || '名前未設定' }}
            </div>

            <!-- パターン -->
            <div class="flex-1 font-mono text-base-content/80 truncate">
              {{ item.pattern || 'パターン未設定' }}
            </div>

            <!-- テストボタン -->
            <button
              @click="testWordParty(item.pattern)"
              :disabled="!item.pattern"
              class="btn btn-xs btn-outline btn-primary"
            >
              テスト実行
            </button>
          </div>
        </div>
      </div>

      <!-- 空の場合の表示 -->
      <div v-else class="text-center py-8">
        <div class="text-base-content/50 text-lg">WordParty設定がありません</div>
        <div class="text-base-content/30 text-sm mt-2">上のテキストエディタから設定を追加してください</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { WordPartySettings } from '@/types/'
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
