<!-- src/configMaker/components/placeholders/PlaceholderTextMode.vue -->
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
        :value="textContent"
        @input="handleInput"
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
      :on-cancel="() => $emit('cancel')"
      :on-save="() => $emit('save')"
      :disabled="hasErrors || validItemsCount === 0"
    />
  </div>
</template>

<script setup lang="ts">
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'
  import InformationCard from '@ConfigComponents/parts/InformationCard.vue'

  defineProps<{
    textContent: string
    lineCount: number
    hasErrors: boolean
    validItemsCount: number
    errorCount: number
  }>()

  const emit = defineEmits<{
    'update:textContent': [value: string]
    'update-line-count': []
    save: []
    cancel: []
  }>()

  function handleInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value
    emit('update:textContent', value)
    emit('update-line-count')
  }
</script>
