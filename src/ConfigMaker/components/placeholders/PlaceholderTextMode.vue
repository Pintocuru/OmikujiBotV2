<!-- src/ConfigMaker/components/placeholders/PlaceholderTextMode.vue -->
<template>
  <div>
    <!-- 入力形式の説明 -->
    <InformationCard>
      <p>入力形式:</p>
      <p>• <code class="label bg-accent text-accent-content">各行が1つの項目</code>になります</p>
      <p>• 形式: <code class="bg-accent px-1 rounded">重み,内容</code></p>
      <p>
        • 例: <code class="bg-accent px-1 rounded">3,テキスト</code> または
        <code class="bg-accent px-1 rounded">テキスト</code>（数値がない場合、重み1として扱います）
      </p>
      <p>• ※ 重みは1以上の整数で指定してください</p>
    </InformationCard>

    <!-- テキストエリア -->
    <div class="form-control pt-4">
      <label class="label">
        <span class="label-text font-medium">📝 テキスト入力</span>
        <span class="label-text-alt">{{ lineCount }}行</span>
      </label>
      <textarea
        v-model="textContent"
        class="textarea textarea-bordered h-64 font-mono text-sm resize-none w-full"
        placeholder="3,重要な内容&#10;1,普通の内容&#10;5,とても重要な内容&#10;単純なテキスト（重み1）"
      />
    </div>

    <!-- エラーサマリー -->
    <div v-if="hasErrors" class="alert alert-error">
      <span class="text-lg">⚠️</span>
      <div>
        <div class="font-semibold">入力エラーがあります</div>
        <div class="text-sm">{{ errorCount }}行にエラーがあります。修正してから保存してください。</div>
      </div>
    </div>

    <!-- 保存ボタン -->
    <ModalFooterActions
      :on-cancel="handleCancel"
      :on-save="handleSave"
      :disabled="hasErrors || validItemsCount === 0"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { WeightValuesArrayType, WeightValueSchema } from '@/types/OmikujiData/PlaceholderSchema'
  import ModalFooterActions from '@config/components/parts/ModalFooterActions.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'

  const props = defineProps<{
    initialValues: WeightValuesArrayType
  }>()

  const emit = defineEmits<{
    save: [values: WeightValuesArrayType]
    cancel: []
  }>()

  const textContent = ref('')

  // 初期値をテキストに変換
  const initializeText = () => {
    textContent.value = props.initialValues
      .map((value) => {
        if (typeof value === 'string') {
          return value
        }
        return value.weight === 1 ? value.content : `${value.weight},${value.content}`
      })
      .join('\n')
  }

  // 行数計算
  const lineCount = computed(() => {
    return textContent.value.split('\n').length
  })

  // 行をパースしてバリデーション
  const parseAndValidateLine = (line: string) => {
    const trimmed = line.trim()
    if (!trimmed) return null

    // 最初のカンマだけを分割対象にする
    const firstCommaIndex = trimmed.indexOf(',')
    let candidate

    if (firstCommaIndex > -1) {
      const weightStr = trimmed.slice(0, firstCommaIndex).trim()
      const contentStr = trimmed.slice(firstCommaIndex + 1).trim()
      const weight = parseInt(weightStr, 10)

      if (!isNaN(weight)) {
        candidate = { weight, content: contentStr }
      } else {
        candidate = { weight: 1, content: trimmed }
      }
    } else {
      candidate = { weight: 1, content: trimmed }
    }

    const result = WeightValueSchema.safeParse(candidate)

    return {
      ...candidate,
      hasError: !result.success,
      error: result.success ? '' : getErrorMessage(result.error),
    }
  }

  // エラーメッセージを日本語化
  const getErrorMessage = (error: any) => {
    const issue = error.issues?.[0]
    if (issue?.path?.[0] === 'weight') return '重みは1以上の整数である必要があります'
    if (issue?.path?.[0] === 'content') return '内容が必要です'
    return '不正な値です'
  }

  // プレビューアイテム
  const previewItems = computed(() => {
    return textContent.value
      .split('\n')
      .map(parseAndValidateLine)
      .filter((item) => item !== null)
  })

  // バリデーション状態
  const hasErrors = computed(() => previewItems.value.some((item) => item.hasError))
  const validItemsCount = computed(() => previewItems.value.filter((item) => !item.hasError).length)
  const errorCount = computed(() => previewItems.value.filter((item) => item.hasError).length)

  // テキストから値に変換
  const convertTextToValues = (): WeightValuesArrayType => {
    return previewItems.value
      .filter((item) => !item.hasError)
      .map(({ weight, content }) => {
        // 重みが1の場合は文字列として返す（スキーマの変換ロジックに合わせる）
        return weight === 1 ? content : { weight, content }
      })
  }

  const handleSave = () => {
    if (hasErrors.value || validItemsCount.value === 0) return
    const values = convertTextToValues()
    emit('save', values)
  }

  const handleCancel = () => {
    emit('cancel')
  }

  onMounted(() => {
    initializeText()
  })
</script>
