<!-- src/ConfigMaker/components/postAction/Message/MessagePreviewPanel.vue -->
<template>
  <div class="flex-1 overflow-y-auto p-1 flex flex-col gap-2 items-center justify-start">
    <div class="w-full">
      <div class="chat chat-start">
        <div class="chat-bubble text-sm whitespace-pre-wrap break-words" v-html="renderedPreview" />
      </div>
      <p v-if="!draftText.trim()" class="text-xs text-center text-base-content/40 mt-1">
        テキストを入力するとプレビューが表示されます
      </p>
    </div>

    <!-- プレースホルダー展開例 -->
    <div class="w-full">
      <div class="divider text-xs my-1">展開例</div>
      <div
        class="bg-base-200 rounded-lg px-3 py-2 text-xs font-mono text-base-content/70 whitespace-pre-wrap break-words cursor-pointer hover:bg-base-300 transition-colors select-none relative group"
        :title="'クリックで更新'"
        v-html="expandedPreviewDisplay"
        @click="refresh"
      ></div>
      <p class="text-xs text-center text-base-content/30 mt-1">
        <RefreshCw :size="10" class="inline mr-0.5" />クリックで再抽選
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { RefreshCw } from 'lucide-vue-next'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { processTestPlaceholder } from '../preview/TestPlaceholderProcessor'

  const props = defineProps<{
    draftText: string
  }>()

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = omikujiStore

  // 展開例の再抽選トリガー用カウンター
  const refreshCount = ref(0)

  // 外部から呼び出せるように expose
  defineExpose({
    refresh,
  })

  function refresh() {
    refreshCount.value++
  }

  function escapeHtml(str: string) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  // レンダリング済みプレビュー（バッジ表示）
  const renderedPreview = computed(() => {
    if (!props.draftText.trim()) return '<span class="opacity-50">(未記入)</span>'
    return escapeHtml(props.draftText).replace(/&lt;&lt;([^&]+)&gt;&gt;/g, (_, key) => {
      const trimmed = key.trim()
      return `<span class="badge badge-sm badge-accent font-mono mx-0.5">&lt;&lt;${escapeHtml(trimmed)}&gt;&gt;</span>`
    })
  })

  // 展開例（refreshCount を依存に含めることで再計算される）
  const expandedPreviewDisplay = computed(() => {
    // refreshCount を参照して reactivity を確保
    void refreshCount.value
    try {
      return escapeHtml(processTestPlaceholder(props.draftText, data.placeholders ?? {}))
    } catch {
      return escapeHtml(props.draftText)
    }
  })
</script>
