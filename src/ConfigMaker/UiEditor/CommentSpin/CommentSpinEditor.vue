<!-- src/ConfigMaker/UiEditor/commentSpin/CommentSpinEditor.vue -->
<template>
  <!-- プレビュー -->
  <CommentSpinPreview :key="`${commentSpin.component}`" :settings="commentSpin" :messageText="messageText" />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="commentSpin.component"
    :options="flashComponentMap"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- デフォルトカラー設定 -->
  <template v-if="!isCharacter">
    <ColorModeSelector
      :model-value="commonStyle.defaultColor"
      @update:model-value="(value) => updateCommonStyleField('defaultColor', value)"
    />
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { flashComponentMap, CommentSpinSchema } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import ColorModeSelector from '@config/components/common/ThemeColorPicker/ColorModeSelector.vue'
  import { useCommonStyleUpdate } from '../CommonStyle/useCommonStyleUpdate'
  import CommentSpinPreview from './CommentSpinPreview.vue'
  import DisplayStyleSelector from '../CommonStyle/DisplayStyleSelector.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isCharacter } = useVisibilityAccess()
  const { updateCommonStyleField } = useCommonStyleUpdate()

  const commentSpin = computed(() => data.value.components.settings.commentSpin ?? CommentSpinSchema.parse({}))
  const commonStyle = computed(() => data.value.components.commonStyle)

  // Field Updates
  const updateField = (field: keyof typeof commentSpin.value, value: any) => {
    omikujiStore.updateComponentSettings('commentSpin', {
      ...commentSpin.value,
      [field]: value,
    })
  }

  // Message Text
  const messageText = computed<string>({
    get: () => commentSpin.value.defaultMessage ?? '',
    set: (value) => {
      updateField('defaultMessage', value)
    },
  })
</script>
