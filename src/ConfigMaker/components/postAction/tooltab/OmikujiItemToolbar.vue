<!-- src\ConfigMaker\components\postAction\tooltab\OmikujiItemToolbar.vue -->
<template>
  <div class="form-control">
    <div class="flex justify-between items-center mb-1">
      <label class="label">
        <span class="label-text font-medium"> </span>
      </label>

      <div class="flex gap-2">
        <!-- delaySeconds調整コンポーネント -->
        <DelaySecondsAdjuster :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />

        <button
          @click="() => useTestPost().postTestOmikujiItem(modelValue, gameScripts)"
          class="btn btn-sm btn-info tooltip tooltip-top"
          data-tip="わんコメを起動すると、投稿の確認ができます"
          :disabled="modelValue.length === 0 && !gameScripts"
        >
          <Send :size="16" />
          テスト投稿
        </button>

        <button
          @click="$emit('toggleJson')"
          class="btn btn-sm btn-secondary tooltip tooltip-top"
          data-tip="JSON形式で編集ができます(上級者向け)"
          type="button"
        >
          <FileJson :size="16" />
          JSON編集
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GameScriptsType, PostActionType } from '@/types/OmikujiData/'
  import DelaySecondsAdjuster from './DelaySecondsAdjuster.vue'
  import { useTestPost } from '@config/scripts/useTestPost'
  import { Send, FileJson } from 'lucide-vue-next'

  // Props
  const props = defineProps<{
    modelValue: PostActionType[]
    gameScripts: GameScriptsType | null
  }>()

  // Emits
  const emit = defineEmits(['update:modelValue', 'toggleJson'])
</script>
