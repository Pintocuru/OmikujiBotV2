<!-- src/configMaker/components/postAction/PostActionsEditorJson.vue -->
<template>
  <div class="space-y-2">
    <textarea
      v-model="jsonText"
      class="textarea textarea-bordered w-full font-mono text-sm"
      rows="12"
      placeholder="JSON形式でPostActionsを編集..."
      @blur="validateAndApplyJson"
    ></textarea>

    <div v-if="jsonError" class="alert alert-error text-xs">
      <span>⚠️ JSONエラー: {{ jsonError }}</span>
    </div>

    <!-- 保存ボタン -->
    <ModalFooterActions :on-cancel="resetJson" :on-save="applyJson" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { RulesCategoryType, RuleType } from '@/types/OmikujiData/RulesSchema'
  import { PostActionType, PostActionSchema } from '@/types/OmikujiData/OmikujiSchema'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'
  import { toast } from 'vue-sonner'

  // Props
  const props = defineProps<{
    category: RulesCategoryType
    selectedRuleId: string | null
    omikujiIndex: number
  }>()

  // Emits
  const emit = defineEmits<{
    close: []
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // Refs
  const jsonText = ref('')
  const jsonError = ref('')

  // 現在のPostActionsを取得するcomputed
  const currentPostActions = computed(() => {
    if (!props.selectedRuleId) return []
    const record = omikujiStore.getItem(props.category, props.selectedRuleId) as RuleType
    return record?.omikuji?.[props.omikujiIndex]?.postActions || []
  })

  // JSON関連の処理
  const updateJsonText = () => {
    try {
      jsonText.value = JSON.stringify(currentPostActions.value, null, 2)
      jsonError.value = ''
    } catch (error) {
      jsonError.value = error instanceof Error ? error.message : 'JSONの生成に失敗しました'
    }
  }

  // PostActionsが変更されたときにJSONテキストを更新
  watch(currentPostActions, updateJsonText, { immediate: true, deep: true })

  // Methods
  const validateAndApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText.value)
      if (!Array.isArray(parsed)) {
        throw new Error('配列である必要があります')
      }

      // PostActionSchemaを使用してバリデーション
      const validatedActions: PostActionType[] = parsed.map((action, index) => {
        try {
          return PostActionSchema.parse(action)
        } catch (error) {
          throw new Error(
            `${index + 1}番目の要素のバリデーションエラー: ${error instanceof Error ? error.message : '不明なエラー'}`
          )
        }
      })

      jsonError.value = ''
      return validatedActions
    } catch (error) {
      jsonError.value = error instanceof Error ? error.message : 'JSONの解析に失敗しました'
      return null
    }
  }

  const applyJson = () => {
    const validatedActions = validateAndApplyJson()
    if (validatedActions && props.selectedRuleId) {
      // ストアを通じて直接更新（updateRecordPropertyを使用）
      omikujiStore.updateOmikujiPostActions(props.category, props.selectedRuleId, props.omikujiIndex, validatedActions)
      toast.success('Json形式で保存しました')
      emit('close')
    }
  }

  const resetJson = () => {
    updateJsonText()
    jsonError.value = ''
    emit('close')
  }
</script>
