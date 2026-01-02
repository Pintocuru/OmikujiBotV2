<!-- src/configMaker/components/postAction/PostActionsEditorJson.vue -->
<template>
  <div class="space-y-2">
    <textarea
      v-model="jsonText"
      class="textarea textarea-bordered w-full font-mono text-sm"
      rows="12"
      placeholder="JSON形式でPostActionsを編集..."
      @blur="validateJson"
    ></textarea>

    <div v-if="jsonError" class="alert alert-error text-xs">
      <span>⚠️ JSONエラー: {{ jsonError }}</span>
    </div>

    <!-- 保存ボタン -->
    <ModalFooterActions :on-cancel="resetJson" :on-save="applyJson" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { PostActionType, PostActionSchema } from '@/types/OmikujiData/'
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'
  import Swal from 'sweetalert2'

  // Props
  const props = defineProps<{
    modelValue: PostActionType[]
  }>()

  // Emits
  const emit = defineEmits<{
    'update:modelValue': [value: PostActionType[]]
    close: []
  }>()

  // Refs
  const jsonText = ref('')
  const jsonError = ref('')

  // JSON関連の処理
  const updateJsonText = () => {
    try {
      jsonText.value = JSON.stringify(props.modelValue, null, 2)
      jsonError.value = ''
    } catch (error) {
      jsonError.value = error instanceof Error ? error.message : 'JSONの生成に失敗しました'
    }
  }

  // modelValueが変更されたときにJSONテキストを更新
  watch(() => props.modelValue, updateJsonText, { immediate: true, deep: true })

  // Methods
  const validateJson = () => {
    try {
      const parsed = JSON.parse(jsonText.value)
      if (!Array.isArray(parsed)) {
        const msg = '配列である必要があります'
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'error',
          title: msg,
          showConfirmButton: false,
          timer: 3000,
        })
        throw new Error(msg)
      }

      const validatedActions: PostActionType[] = parsed.map((action, index) => {
        try {
          return PostActionSchema.parse(action)
        } catch (error) {
          const msg = `${index + 1}番目の要素のバリデーションエラー: ${
            error instanceof Error ? error.message : '不明なエラー'
          }`

          Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'error',
            title: msg,
            showConfirmButton: false,
            timer: 4000,
          })

          throw new Error(msg)
        }
      })

      jsonError.value = ''
      return validatedActions
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'JSONの解析に失敗しました'

      // UI の赤いエラー欄にも表示
      jsonError.value = msg

      // トーストも出す（編集中なのでダイアログ禁止）
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: msg,
        showConfirmButton: false,
        timer: 4000,
      })

      return null
    }
  }

  const applyJson = () => {
    const validatedActions = validateJson()
    if (validatedActions) {
      emit('update:modelValue', validatedActions)

      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'JSON形式で保存しました',
        showConfirmButton: false,
        timer: 2000,
      })

      emit('close')
    }
  }

  const resetJson = () => {
    updateJsonText()
    jsonError.value = ''
    emit('close')
  }
</script>
