<!-- src/ConfigMaker/components/postAction/Message/InlinePlaceholderDialog.vue -->
<!--
  簡易プレースホルダー入力ダイアログ
  << '候補1', '候補2', '候補3' >> 形式のテキストを生成して挿入する
-->
<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box w-11/12 max-w-lg flex flex-col gap-3">
      <!-- ヘッダー -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Braces :size="18" class="text-accent" />
          <h3 class="font-bold text-base">簡易プレースホルダー</h3>
        </div>
        <button class="btn btn-sm btn-ghost btn-circle" @click="close">
          <X :size="16" />
        </button>
      </div>

      <!-- 説明 -->
      <div class="alert alert-info text-xs py-2">
        <Info :size="14" />
        <span>
          <code class="font-mono">&lt;&lt; '候補A', '候補B' &gt;&gt;</code> 形式で、
          リストからランダムに選ばれるテキストを挿入できます。
          <code class="font-mono">&lt;&lt;user&gt;&gt;</code> などのプレースホルダーも使用可能です。
        </span>
      </div>

      <!-- 候補リスト -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold">候補テキスト</span>
          <button class="btn btn-xs btn-ghost gap-1" @click="addItem">
            <Plus :size="12" />
            追加
          </button>
        </div>

        <div class="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
          <div v-for="(item, idx) in items" :key="idx" class="flex items-center gap-2 group">
            <span class="text-xs text-base-content/40 w-5 text-right shrink-0">{{ idx + 1 }}</span>
            <input
              v-model="items[idx]"
              type="text"
              class="input input-bordered input-sm flex-1 font-mono text-sm"
              :placeholder="`候補 ${idx + 1} (例: <<user>>さんこんにちは！)`"
              @keydown.enter="idx === items.length - 1 ? addItem() : undefined"
            />
            <button
              class="btn btn-xs btn-ghost btn-circle opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              :disabled="items.length <= 1"
              @click="removeItem(idx)"
            >
              <Trash2 :size="12" />
            </button>
          </div>
        </div>
      </div>

      <!-- フッター -->
      <div class="flex justify-end gap-2">
        <button class="btn btn-sm btn-ghost" @click="close">キャンセル</button>
        <button class="btn btn-sm btn-accent gap-1" :disabled="!canInsert" @click="insert">
          <CornerDownLeft :size="14" />
          挿入
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="close">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Braces, X, Plus, Trash2, CornerDownLeft, Info } from 'lucide-vue-next'

  const emit = defineEmits<{ insert: [text: string] }>()

  const dialogRef = ref<HTMLDialogElement | null>(null)
  const items = ref<string[]>(['', ''])

  const open = () => {
    items.value = ['', '']
    dialogRef.value?.showModal()
  }

  const close = () => {
    dialogRef.value?.close()
  }

  const addItem = () => {
    items.value.push('')
  }

  const removeItem = (idx: number) => {
    if (items.value.length > 1) items.value.splice(idx, 1)
  }

  // 有効な候補（空文字除外）
  const validItems = computed(() => items.value.filter((s) => s.trim() !== ''))

  const canInsert = computed(() => validItems.value.length >= 1)

  // プレビュー: << '...', '...' >> 形式
  const preview = computed(() => {
    if (!canInsert.value) return ''
    if (validItems.value.length === 1) {
      // 候補が1つなら通常テキストとして返す
      return validItems.value[0]
    }
    const joined = validItems.value.map((s) => `'${s.replace(/'/g, "\\'")}'`).join(',\n  ')
    return `<<\n  ${joined}\n>>`
  })

  const insert = () => {
    if (!canInsert.value) return
    emit('insert', preview.value)
    close()
  }

  // 親から open() を呼べるよう公開
  defineExpose({ open })
</script>
