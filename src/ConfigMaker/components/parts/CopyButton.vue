<!-- src/ConfigMaker/components/parts/CopyButton.vue -->
<template>
  <button
    @click="handleCopy"
    :disabled="disabled || isLoading"
    :class="{ 'tooltip tooltip-top': true, 'btn-disabled': disabled || isLoading }"
    :data-tip="dataTip"
  >
    <span class="btn btn-xs btn-outline hover:btn-primary transition-colors min-w-fit whitespace-nowrap">
      <span v-if="isLoading" class="flex items-center gap-1">
        <Loader2Icon class="h-4 w-4 animate-spin" />
        <span v-if="!small">コピー中…</span>
      </span>
      <span v-else-if="copied" class="flex items-center gap-1">
        <CheckIcon class="h-4 w-4" />
        <span v-if="!small">コピー済み</span>
      </span>
      <span v-else class="flex items-center gap-1">
        <CopyIcon class="h-4 w-4" />
        <span v-if="!small">コピー</span>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
  import { ref, onUnmounted } from 'vue'
  import { CopyIcon, CheckIcon, Loader2Icon } from 'lucide-vue-next'

  const props = withDefaults(
    defineProps<{
      value: string // コピーする値（必須）
      dataTip?: string // タイトル（ツールチップ）
      disabled?: boolean // 無効化フラグ
      small?: boolean // 小さなモード（テキスト非表示）
    }>(),
    {
      dataTip: 'クリックしてコピー',
      disabled: false,
      small: false,
    }
  )

  // 状態管理
  const copied = ref(false)
  const isLoading = ref(false)

  let successTimer: ReturnType<typeof setTimeout> | null = null

  // コピー処理
  const handleCopy = async () => {
    if (props.disabled || isLoading.value) return

    // 既存のタイマーをクリア
    if (successTimer) clearTimeout(successTimer)

    try {
      isLoading.value = true

      // クリップボードにコピー
      await navigator.clipboard.writeText(props.value)

      // 成功状態に変更
      isLoading.value = false
      copied.value = true

      // 2秒後に元の状態に戻す
      successTimer = setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (error) {
      isLoading.value = false
      console.error('Copy failed:', error)

      // フォールバック: 古いブラウザ対応
      try {
        const textArea = document.createElement('textarea')
        textArea.value = props.value
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        /**
         * 'document.execCommand' のシグネチャ '(commandId: string, showUI?: boolean | undefined, value?: string | undefined): boolean' は非推奨です。ts-plugin(6387)
lib.dom.d.ts(10253, 8): この宣言はここで非推奨とマークされました。
(method) Document.execCommand(commandId: string, showUI?: boolean | undefined, value?: string | undefined): boolean
The execCommand method implements multiple different commands.
         */
        document.execCommand('copy')
        document.body.removeChild(textArea)

        copied.value = true

        successTimer = setTimeout(() => {
          copied.value = false
        }, 2000)
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError)
      }
    }
  }

  // コンポーネントがアンマウントされる際のクリーンアップ
  onUnmounted(() => {
    if (successTimer) clearTimeout(successTimer)
  })
</script>
