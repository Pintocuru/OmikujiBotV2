<!-- src/ConfigMaker/components/postAction/tooltab/OmikujiItemToolbar.vue -->
<template>
  <div class="form-control">
    <div class="flex justify-between items-center mb-1">
      <label class="label">
        <span class="label-text font-medium"> </span>
      </label>

      <div class="flex gap-2">
        <!-- delaySeconds調整コンポーネント -->
        <DelaySecondsAdjuster :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />

        <!-- テスト投稿ボタン -->
        <button
          @click="() => postTestOmikujiItem(modelValue, gameScripts)"
          class="btn btn-sm btn-info tooltip tooltip-top"
          data-tip="わんコメを起動すると、投稿の確認ができます"
          :disabled="modelValue.length === 0 && !gameScripts"
        >
          <Send :size="16" />
          テスト投稿
        </button>

        <!-- JSONコピー -->
        <button
          @click="handleCopy"
          class="btn btn-sm btn-secondary tooltip tooltip-top"
          data-tip="PostActions を JSON としてクリップボードにコピーします"
          type="button"
          :disabled="clipboard.isCopying.value"
        >
          <ClipboardCopy :size="16" />
          JSONコピー
        </button>

        <!-- JSONペースト -->
        <button
          @click="handlePaste"
          class="btn btn-sm btn-secondary tooltip tooltip-top"
          data-tip="クリップボードの JSON を PostActions として読み込みます"
          type="button"
          :disabled="clipboard.isPasting.value"
        >
          <ClipboardPaste :size="16" />
          JSONペースト
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GameScriptsType, PostFlowType } from '@/types/OmikujiData/'
  import { PostFlowArraySchema } from '@/types/OmikujiData/ActionSet'
  import DelaySecondsAdjuster from './DelaySecondsAdjuster.vue'
  import { useTestPost } from '@config/scripts/useTestPost'
  import { useJsonClipboard } from '@config/scripts/JsonClipboard/useJsonClipboard'
  import { Send, ClipboardCopy, ClipboardPaste } from 'lucide-vue-next'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

  // Props
  const props = defineProps<{
    modelValue: PostFlowType[]
    gameScripts: GameScriptsType | null
  }>()

  // Emits
  const emit = defineEmits<{
    'update:modelValue': [value: PostFlowType[]]
  }>()

  const { postTestOmikujiItem } = useTestPost()

  // PostFlowType[] 用クリップボード
  const clipboard = useJsonClipboard<PostFlowType[]>({
    parse: (raw) => {
      const result = PostFlowArraySchema.safeParse(raw)
      return result.success ? result.data : null
    },
  })

  const handleCopy = async () => {
    await clipboard.copyJson(props.modelValue)
  }

  const handlePaste = async () => {
    const parsed = await clipboard.pasteJson()

    if (parsed === null) {
      swalToast.error({
        title: `[OmikujiItemToolbar] JSONペースト失敗: ${clipboard.lastError.value}`,
      })
      return
    }

    const result = await swalModal.confirmTriple({
      title: 'JSONを貼り付けます',
      text: '現在のデータをどうしますか？',
    })

    if (result.isConfirmed) {
      emit('update:modelValue', parsed)
      swalToast.success({ title: 'クリップボードから貼り付けました（上書き）' })
    } else if (result.isDenied) {
      emit('update:modelValue', [...props.modelValue, ...parsed])
      swalToast.success({ title: 'クリップボードから貼り付けました（マージ）' })
    }
  }
</script>
