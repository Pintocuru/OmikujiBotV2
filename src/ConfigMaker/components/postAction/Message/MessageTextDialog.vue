<!-- src/ConfigMaker/components/postAction/Message/MessageTextDialog.vue -->
<template>
  <!-- 1行インライン表示 -->
  <div class="flex gap-2 items-center w-full">
    <textarea
      v-model="displayValue"
      rows="3"
      class="textarea textarea-bordered textarea-sm w-full"
      :placeholder="'メッセージを入力... (例: <<userName>> さん、こんにちは！)'"
    ></textarea>
    <button class="btn btn-sm btn-primary gap-1" @click="openDialog">
      <PencilLine :size="14" />
      <span class="hidden sm:inline">詳細編集</span>
    </button>
  </div>

  <!-- メインダイアログ -->
  <BaseEditDialog ref="baseDialog" title="メッセージ詳細エディター" icon="MessageSquare" @save="handleSave">
    <!-- 左: プレビュー -->
    <template #sidebar-left>
      <MessagePreviewPanel :draft-text="draftText" />
    </template>

    <!-- 中央: エディター -->
    <div class="flex flex-col h-full">
      <div class="px-3 py-2 bg-base-200 border-b border-base-300 shrink-0 flex items-center justify-between">
        <span class="text-xs font-semibold text-base-content">メッセージ編集</span>
        <div class="flex items-center gap-2">
          <button class="md:hidden btn btn-xs btn-ghost gap-1" @click="showInlinePreview = !showInlinePreview">
            <Eye :size="12" />
            プレビュー
          </button>
          <div class="flex gap-1">
            <kbd class="kbd kbd-xs">Ctrl</kbd>
            <kbd class="kbd kbd-xs">Enter</kbd>
            <span class="text-xs text-base-content/50 ml-1">で保存</span>
          </div>
        </div>
      </div>

      <!-- md未満: インラインプレビュー -->
      <div
        v-if="showInlinePreview"
        class="md:hidden shrink-0 border-b border-base-300 px-3 py-2 bg-base-100 flex flex-col gap-2 max-h-40 overflow-y-auto"
      >
        <MessagePreviewPanel :draft-text="draftText" />
      </div>

      <div class="flex-1 p-3 flex flex-col gap-2 min-h-0">
        <textarea
          ref="textareaRef"
          v-model="draftText"
          class="textarea textarea-bordered flex-1 font-mono text-sm resize-none leading-relaxed w-full"
          placeholder="メッセージを入力...&#10;&#10;例:&#10;<<userName>> さん、ようこそ！&#10;今日のおみくじは <<r>> です！"
          @keydown.ctrl.enter="handleSave"
        />
        <div class="text-right text-xs text-base-content/40">
          {{ draftText.length }} 文字
          <span v-if="lineCount > 1"> / {{ lineCount }} 行</span>
        </div>
      </div>
    </div>

    <!-- 右: PlaceholderPanel -->
    <template #sidebar-right>
      <PlaceholderPanel
        :draft-text="draftText"
        :isCommentMode="isCommentMode"
        @insert="insertPlaceholder"
        @open-inline-ph="inlinePhDialog?.open()"
      />
    </template>

    <!-- フッター補足リンク -->
    <template #footer-info>
      <a
        class="link no-underline hover:underline"
        href="https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/VariablePlaceholderCheatSheet.md"
        target="_blank"
        rel="noopener noreferrer"
      >
        評価ブロック(変数プレースホルダー) チートリスト
      </a>
    </template>
  </BaseEditDialog>

  <InlinePlaceholderDialog ref="inlinePhDialog" @insert="insertInlinePlaceholder" />
</template>

<script setup lang="ts">
  import { computed, ref, nextTick } from 'vue'
  import BaseEditDialog from '@config/components/common/BaseDialog/BaseEditDialog.vue'
  import PlaceholderPanel from './PlaceholderPanel.vue'
  import MessagePreviewPanel from './MessagePreviewPanel.vue'
  import InlinePlaceholderDialog from './InlinePlaceholderDialog.vue'
  import { PencilLine, Eye } from 'lucide-vue-next'

  const props = defineProps<{
    modelValue: string
    isCommentMode?: boolean
  }>()

  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

  const baseDialog = ref<InstanceType<typeof BaseEditDialog> | null>(null)
  const textareaRef = ref<HTMLTextAreaElement | null>(null)
  const inlinePhDialog = ref<InstanceType<typeof InlinePlaceholderDialog> | null>(null)
  const draftText = ref('')
  const showInlinePreview = ref(false)

  const displayValue = computed({
    get: () => props.modelValue ?? '',
    set: (value: string) => emit('update:modelValue', value),
  })

  const openDialog = () => {
    draftText.value = props.modelValue
    baseDialog.value?.showModal()
    nextTick(() => textareaRef.value?.focus())
  }

  const handleSave = () => {
    emit('update:modelValue', draftText.value)
    baseDialog.value?.close()
  }

  const lineCount = computed(() => draftText.value.split('\n').length)

  const insertAtCursor = (insertion: string) => {
    const ta = textareaRef.value
    if (!ta) {
      draftText.value += insertion
      return
    }
    const start = ta.selectionStart ?? draftText.value.length
    const end = ta.selectionEnd ?? draftText.value.length
    draftText.value = draftText.value.slice(0, start) + insertion + draftText.value.slice(end)
    nextTick(() => {
      ta.focus()
      ta.setSelectionRange(start + insertion.length, start + insertion.length)
    })
  }

  const insertPlaceholder = (key: string) => insertAtCursor(`<<${key}>>`)
  const insertInlinePlaceholder = (text: string) => insertAtCursor(text)
</script>
