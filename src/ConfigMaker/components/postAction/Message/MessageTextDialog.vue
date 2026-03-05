<!-- src/ConfigMaker/components/postAction/Message/MessageTextEditor.vue -->
<template>
  <!-- 1行インライン表示 -->
  <div class="flex gap-2 items-center w-full">
    <textarea
      v-model="displayValue"
      rows="3"
      class="textarea textarea-bordered textarea-sm w-full pr-10"
      :placeholder="'メッセージを入力... (例: <<userName>> さん、こんにちは！)'"
    ></textarea>
    <button class="btn btn-sm btn-primary gap-1" @click="openDialog">
      <PencilLine :size="14" />
      <span class="hidden sm:inline">詳細編集</span>
    </button>
  </div>

  <!-- メインダイアログ -->
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box w-11/12 max-w-5xl h-[80vh] flex flex-col overflow-hidden">
      <!-- ヘッダー -->
      <div class="flex items-center justify-between p-4 border-b border-base-300 bg-base-200 shrink-0">
        <div class="flex items-center gap-2">
          <MessageSquare :size="18" class="text-primary" />
          <h3 class="font-bold text-base">メッセージ詳細エディター</h3>
        </div>
        <button class="btn btn-sm btn-ghost btn-circle" @click="closeDialog">
          <X :size="16" />
        </button>
      </div>

      <!-- 本体 2〜3カラム -->
      <div class="flex flex-1 min-h-0 divide-x divide-base-300">
        <!-- 左: プレビュー（md以上のみ） -->
        <div class="hidden md:flex w-72 shrink-0 flex-col bg-base-100">
          <div class="p-2 bg-base-200 border-b border-base-300 shrink-0">
            <span class="text-xs font-semibold uppercase tracking-wide text-base-content/60">プレビュー</span>
          </div>
          <MessagePreviewPanel :draft-text="draftText" />
        </div>

        <!-- 中央: エディター -->
        <div class="flex-1 flex flex-col min-w-0">
          <div class="px-3 py-2 bg-base-200 border-b border-base-300 shrink-0 flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wide text-base-content/60">メッセージ編集</span>
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
              @keydown.ctrl.enter="saveAndClose"
            />
            <div class="text-right text-xs text-base-content/40">
              {{ draftText.length }} 文字
              <span v-if="lineCount > 1"> / {{ lineCount }} 行</span>
            </div>
          </div>
        </div>

        <!-- ★ 右: PlaceholderPanel  -->
        <PlaceholderPanel
          :draft-text="draftText"
          :isCommentMode="isCommentMode"
          @insert="insertPlaceholder"
          @open-inline-ph="inlinePhDialog?.open()"
        />
      </div>

      <!-- フッター -->
      <div class="flex justify-between items-center px-5 py-3 border-t border-base-300 bg-base-200 shrink-0">
        <div class="text-xs text-base-content/50">プレースホルダーをクリックして本文に挿入できます</div>
        <div class="flex gap-2">
          <button class="btn btn-sm btn-ghost" @click="closeDialog">キャンセル</button>
          <button class="btn btn-sm btn-primary gap-1" @click="saveAndClose">
            <Check :size="14" />
            保存して閉じる
          </button>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeDialog">close</button>
    </form>
  </dialog>

  <InlinePlaceholderDialog ref="inlinePhDialog" @insert="insertInlinePlaceholder" />
</template>

<script setup lang="ts">
  import { computed, ref, nextTick } from 'vue'
  import PlaceholderPanel from './PlaceholderPanel.vue'
  import MessagePreviewPanel from './MessagePreviewPanel.vue'
  import InlinePlaceholderDialog from './InlinePlaceholderDialog.vue'
  import { PencilLine, MessageSquare, X, Check, Eye } from 'lucide-vue-next'

  const props = defineProps<{
    modelValue: string
    isCommentMode?: boolean
  }>()

  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

  const dialogRef = ref<HTMLDialogElement | null>(null)
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
    dialogRef.value?.showModal()
    nextTick(() => textareaRef.value?.focus())
  }

  const closeDialog = () => dialogRef.value?.close()

  const saveAndClose = () => {
    emit('update:modelValue', draftText.value)
    closeDialog()
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
