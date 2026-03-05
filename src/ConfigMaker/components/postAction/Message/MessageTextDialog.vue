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

  <!-- ダイアログ -->
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box w-11/12 max-w-5xl h-[80vh] flex flex-col overflow-hidden">
      <!-- ヘッダー -->
      <div class="flex items-center justify-between px-5 py-3 border-b border-base-300 bg-base-200 shrink-0">
        <div class="flex items-center gap-2">
          <MessageSquare :size="18" class="text-primary" />
          <h3 class="font-bold text-base">メッセージ詳細エディター</h3>
        </div>
        <button class="btn btn-sm btn-ghost btn-circle" @click="closeDialog">
          <X :size="16" />
        </button>
      </div>

      <!-- 本体 3カラム -->
      <div class="flex flex-1 min-h-0 divide-x divide-base-300">
        <!-- 左: プレビュー -->
        <div class="w-72 shrink-0 flex flex-col bg-base-100">
          <div class="px-3 py-2 bg-base-200 border-b border-base-300 shrink-0">
            <span class="text-xs font-semibold uppercase tracking-wide text-base-content/60">プレビュー</span>
          </div>
          <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-3 items-center justify-start">
            <!-- バブル風プレビュー -->
            <div class="w-full">
              <div class="chat chat-start">
                <div class="chat-bubble text-sm whitespace-pre-wrap break-words" v-html="renderedPreview" />
              </div>
              <p v-if="!draftText.trim()" class="text-xs text-center text-base-content/40 mt-1">
                テキストを入力するとプレビューが表示されます
              </p>
            </div>

            <!-- プレースホルダー展開結果 -->
            <div v-if="hasPlaceholders" class="w-full">
              <div class="divider text-xs my-1">展開例</div>
              <div
                class="bg-base-200 rounded-lg px-3 py-2 text-xs font-mono text-base-content/70 whitespace-pre-wrap break-words"
                v-html="expandedPreview"
              />
            </div>
          </div>
        </div>

        <!-- 中央: エディター -->
        <div class="flex-1 flex flex-col min-w-0">
          <div class="px-3 py-2 bg-base-200 border-b border-base-300 shrink-0 flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wide text-base-content/60">メッセージ編集</span>
            <div class="flex gap-1">
              <kbd class="kbd kbd-xs">Ctrl</kbd>
              <kbd class="kbd kbd-xs">Enter</kbd>
              <span class="text-xs text-base-content/50 ml-1">で保存</span>
            </div>
          </div>

          <!-- テキストエリア -->
          <div class="flex-1 p-3 flex flex-col gap-2 min-h-0">
            <textarea
              ref="textareaRef"
              v-model="draftText"
              class="textarea textarea-bordered flex-1 font-mono text-sm resize-none leading-relaxed w-full"
              placeholder="メッセージを入力...&#10;&#10;例:&#10;<<userName>> さん、ようこそ！&#10;今日のおみくじは <<result>> です！"
              @keydown.ctrl.enter="saveAndClose"
            />

            <!-- 文字数 -->
            <div class="text-right text-xs text-base-content/40">
              {{ draftText.length }} 文字
              <span v-if="lineCount > 1"> / {{ lineCount }} 行</span>
            </div>
          </div>
        </div>

        <!-- 右: プレースホルダー -->
        <div class="w-64 shrink-0 flex flex-col bg-base-100">
          <div class="px-3 py-2 bg-base-200 border-b border-base-300 shrink-0 flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wide text-base-content/60">プレースホルダー</span>
            <button class="btn btn-xs btn-ghost gap-1" @click="showAddPlaceholder = !showAddPlaceholder">
              <Plus :size="12" />
              追加
            </button>
          </div>

          <!-- 新規プレースホルダー追加フォーム -->
          <div v-if="showAddPlaceholder" class="px-3 py-2 border-b border-base-300 bg-warning/10 shrink-0">
            <p class="text-xs font-semibold text-warning mb-1">新規プレースホルダー</p>
            <div class="flex gap-1">
              <input
                v-model="newPlaceholderKey"
                type="text"
                class="input input-bordered input-xs flex-1 font-mono"
                placeholder="キー名 (例: myVar)"
                @keydown.enter="createNewPlaceholder"
              />
              <button
                class="btn btn-xs btn-warning"
                @click="createNewPlaceholder"
                :disabled="!newPlaceholderKey.trim()"
              >
                作成
              </button>
            </div>
          </div>

          <!-- プレースホルダー一覧 -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="sortedPlaceholders.length === 0" class="p-4 text-center text-xs text-base-content/40">
              プレースホルダーがありません
            </div>

            <div
              v-for="ph in sortedPlaceholders"
              :key="ph.key"
              class="border-b border-base-200 last:border-0"
              :class="{ 'bg-primary/5': usedKeys.has(ph.key) }"
            >
              <!-- プレースホルダーヘッダー -->
              <div
                class="flex items-center gap-1 px-2 py-1.5 cursor-pointer hover:bg-base-200 group"
                @click="togglePlaceholder(ph.key)"
              >
                <ChevronRight
                  :size="12"
                  class="text-base-content/40 transition-transform shrink-0"
                  :class="{ 'rotate-90': expandedKeys.has(ph.key) }"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1">
                    <span class="text-xs font-mono font-semibold truncate">{{ ph.key }}</span>
                    <span v-if="usedKeys.has(ph.key)" class="badge badge-primary badge-xs shrink-0">使用中</span>
                  </div>
                  <p class="text-xs text-base-content/50 truncate">{{ ph.name }}</p>
                </div>
                <!-- 貼り付けボタン -->
                <button
                  class="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  title="挿入"
                  @click.stop="insertPlaceholder(ph.key)"
                >
                  <CornerDownLeft :size="12" />
                </button>
              </div>

              <!-- 展開: バリュー一覧 & インライン編集 -->
              <div v-if="expandedKeys.has(ph.key)" class="bg-base-200/60 px-2 pb-2">
                <!-- 貼り付けボタン(大) -->
                <button class="btn btn-xs btn-primary w-full gap-1 mt-1 mb-2" @click="insertPlaceholder(ph.key)">
                  <CornerDownLeft :size="11" />
                  &lt;&lt;{{ ph.key }}&gt;&gt; を挿入
                </button>

                <!-- values 一覧 -->
                <div class="space-y-1">
                  <div
                    v-for="(val, idx) in normalizedValues(ph.values)"
                    :key="idx"
                    class="flex items-center gap-1 group"
                  >
                    <span class="badge badge-xs badge-ghost font-mono shrink-0">{{ val.weight }}</span>
                    <input
                      type="text"
                      class="input input-xs input-bordered flex-1 font-mono text-xs"
                      :value="val.content"
                      @change="updatePlaceholderValue(ph.key, idx, $event)"
                    />
                    <button
                      class="btn btn-xs btn-ghost btn-circle opacity-0 group-hover:opacity-100 shrink-0"
                      @click="removePlaceholderValue(ph.key, idx)"
                    >
                      <Trash2 :size="10" />
                    </button>
                  </div>
                </div>

                <!-- 値追加 -->
                <button class="btn btn-xs btn-ghost gap-1 mt-1 w-full" @click="addPlaceholderValue(ph.key)">
                  <Plus :size="10" />
                  値を追加
                </button>
              </div>
            </div>
          </div>
        </div>
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

    <!-- バックドロップ -->
    <form method="dialog" class="modal-backdrop">
      <button @click="closeDialog">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
  import { computed, ref, nextTick } from 'vue'
  import { PencilLine, MessageSquare, X, Plus, ChevronRight, CornerDownLeft, Trash2, Check } from 'lucide-vue-next'
  import { PlaceholderSchema, PlaceholderType, WeightValuesArrayType, handelNormalizedValues } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import { processTestPlaceholder } from '../preview/TestPlaceholderProcessor'
  import { defaultPlaceholders } from '@/types/MainGenerator/DefaultPlaceholders'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useAccessCheckerConfig'

  // Props / Emit
  const props = defineProps<{ modelValue: string }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = omikujiStore
  const { getCategoryMap } = useGetRecordData()

  const { isPlaceholder } = useVisibilityAccess()

  // Refs
  const dialogRef = ref<HTMLDialogElement | null>(null)
  const textareaRef = ref<HTMLTextAreaElement | null>(null)
  const draftText = ref('')
  const showAddPlaceholder = ref(false)
  const newPlaceholderKey = ref('')
  const expandedKeys = ref<Set<string>>(new Set())

  // インライン表示用（改行を ↵ で表示）
  const displayValue = computed({
    get: () => props.modelValue ?? '',
    set: (value: string) => emit('update:modelValue', value),
  })

  // ダイアログ制御
  const openDialog = () => {
    draftText.value = props.modelValue
    dialogRef.value?.showModal()
    nextTick(() => textareaRef.value?.focus())
  }

  const closeDialog = () => {
    dialogRef.value?.close()
    showAddPlaceholder.value = false
    newPlaceholderKey.value = ''
  }

  const saveAndClose = () => {
    emit('update:modelValue', draftText.value)
    closeDialog()
  }

  // テキスト統計
  const lineCount = computed(() => draftText.value.split('\n').length)

  // プレースホルダー関連
  const PLACEHOLDER_PATTERN = /<<([^>]+)>>/g
  const PLACEHOLDER_ID_PATTERN = /^[a-zA-Z0-9_]+$/

  const placeholderMap = computed(() => getCategoryMap('placeholders') as Record<string, PlaceholderType>)

  const sortedPlaceholders = computed(() => {
    return Object.values(placeholderMap.value).sort((a, b) => {
      // 使用中を上に
      const aUsed = usedKeys.value.has(a.key)
      const bUsed = usedKeys.value.has(b.key)
      if (aUsed !== bUsed) return aUsed ? -1 : 1
      return a.key.localeCompare(b.key)
    })
  })

  const usedKeys = computed<Set<string>>(() => {
    const set = new Set<string>()
    for (const match of draftText.value.matchAll(PLACEHOLDER_PATTERN)) {
      if (match[1] && PLACEHOLDER_ID_PATTERN.test(match[1].trim())) {
        set.add(match[1].trim())
      }
    }
    return set
  })

  const hasPlaceholders = computed(() => usedKeys.value.size > 0)

  // プレビュー: <<key>> を展開
  const renderedPreview = computed(() => {
    if (!draftText.value.trim()) return '<span class="opacity-50">(未記入)</span>'
    return escapeHtml(draftText.value).replace(/&lt;&lt;([^&]+)&gt;&gt;/g, (_, key) => {
      const trimmed = key.trim()
      return `<span class="badge badge-sm badge-accent font-mono mx-0.5">&lt;&lt;${escapeHtml(trimmed)}&gt;&gt;</span>`
    })
  })

  // 展開プレビュー: processTestPlaceholder 相当
  const expandedPreview = computed(() => {
    try {
      return escapeHtml(processTestPlaceholder(draftText.value, data.placeholders ?? {}))
    } catch {
      return draftText.value
    }
  })

  function escapeHtml(str: string) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  // プレースホルダーを展開
  const togglePlaceholder = (key: string) => {
    const s = new Set(expandedKeys.value)
    /**
     * Expected an assignment or function call and instead saw an expression.
     */
    s.has(key) ? s.delete(key) : s.add(key)
    expandedKeys.value = s
  }

  // テキストエリアにカーソル位置で挿入
  const insertPlaceholder = (key: string) => {
    const ta = textareaRef.value
    const insertion = `<<${key}>>`
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

  // 値の正規化
  const normalizedValues = (values: WeightValuesArrayType) => handelNormalizedValues(values)

  // プレースホルダー値の更新
  const updatePlaceholderValue = (phKey: string, idx: number, e: Event) => {
    const ph = placeholderMap.value[phKey]
    if (!ph) return
    const vals = handelNormalizedValues(ph.values)
    vals[idx] = { ...vals[idx], content: (e.target as HTMLInputElement).value }
    omikujiStore.updateItem('placeholders', phKey, { ...ph, values: vals })
  }

  const removePlaceholderValue = (phKey: string, idx: number) => {
    const ph = placeholderMap.value[phKey]
    if (!ph) return
    const vals = handelNormalizedValues(ph.values).filter((_, i) => i !== idx)
    omikujiStore.updateItem('placeholders', phKey, { ...ph, values: vals.length ? vals : [{ weight: 1, content: '' }] })
  }

  const addPlaceholderValue = (phKey: string) => {
    const ph = placeholderMap.value[phKey]
    if (!ph) return
    const vals = handelNormalizedValues(ph.values)
    vals.push({ weight: 1, content: '' })
    omikujiStore.updateItem('placeholders', phKey, { ...ph, values: vals })
  }

  // 新規プレースホルダー作成
  const createNewPlaceholder = () => {
    const key = newPlaceholderKey.value.trim()
    if (!key || !PLACEHOLDER_ID_PATTERN.test(key)) return
    const parsed = PlaceholderSchema.parse({ key, name: key })
    omikujiStore.addItem('placeholders', parsed)
    newPlaceholderKey.value = ''
    showAddPlaceholder.value = false
    // 作成したプレースホルダーを展開して挿入
    expandedKeys.value = new Set([...expandedKeys.value, key])
  }
</script>
