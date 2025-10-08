<!-- src\ConfigMaker\components\postAction\tooltab\OmikujiItemToolbar.vue -->
<template>
  <div class="form-control">
    <div class="flex justify-between items-center mb-1">
      <label class="label">
        <span class="label-text font-medium">アクション</span>
        <div class="relative">
          <span
            class="badge badge-outline ml-2 cursor-pointer flex items-center gap-1 transition-colors hover:bg-primary hover:text-white"
            @mouseenter="showPreview = true"
            @mouseleave="showPreview = false"
            @click="$emit('toggleEdit')"
          >
            <List class="h-4 w-4" />
            <span class="pl-1"> {{ modelValue.length }} </span>
          </span>

          <!-- ホバー時のプレビュー表示 -->
          <div
            v-if="showPreview && modelValue.length > 0"
            class="absolute top-6 left-0 z-50 bg-base-100 shadow-lg rounded-lg border w-96 sm:w-160 max-h-64 overflow-y-auto"
            @mouseenter="showPreview = true"
            @mouseleave="showPreview = false"
          >
            <div class="form-control bg-base-200 p-2 rounded-lg">
              <h3 class="font-semibold border-b">アクション プレビュー</h3>
              <PostActionsPreview :actions="modelValue" />
            </div>

            <div v-if="selectedScript">
              <div class="form-control bg-base-200 p-2 rounded-lg">
                <h3 class="font-semibold border-b">GameScripts で追加されるアクション</h3>
                <PostActionsPreview :actions="selectedScript.postActions as PostActionType[]" />
              </div>
            </div>
          </div>
        </div>
      </label>

      <div class="flex gap-2">
        <!-- delaySeconds調整コンポーネント -->
        <DelaySecondsAdjuster :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />

        <button
          @click="() => useTestPost().postTestOmikujiItem(modelValue)"
          class="btn btn-sm btn-info tooltip tooltip-top"
          data-tip="わんコメを起動すると、投稿の確認ができます"
          :disabled="modelValue.length === 0"
        >
          <Send :size="16" />
          テスト投稿
        </button>

        <button @click="$emit('toggleJson')" class="btn btn-sm btn-secondary" type="button">
          <FileJson :size="16" />
          JSON編集
        </button>

        <button @click="$emit('toggleEdit')" class="btn btn-sm btn-primary" type="button">
          <Settings :size="16" />
          アクション編集
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ScriptPreset } from '@/types'
  import { CommentRuleType, RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import DelaySecondsAdjuster from './DelaySecondsAdjuster.vue'
  import PostActionsPreview from '@ConfigComponents/postAction/PostActionsPreview.vue'
  import { gameScriptMap } from '@ConfigComponents/GameScripts/GameScriptsMap'
  import { useTestPost } from '@/ConfigMaker/scripts/useTestPost'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { List, Send, FileJson, Settings } from 'lucide-vue-next'

  // Props
  const props = defineProps<{
    modelValue: PostActionType[]
    category: RulesCategoryType | 'actionSets'
    selectedRuleId: string | null
  }>()

  // Emits
  const emit = defineEmits(['update:modelValue', 'toggleEdit', 'toggleJson'])

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // ホバー状態管理
  const showPreview = ref(false)

  // currentScriptIdの取得
  // TODO:将来TimerにもGameScriptsを入れる予定です
  const currentScriptId = computed(() => {
    if (!props.selectedRuleId) return null
    if (props.category === 'actionSets') return null // actionSetsは script が存在しない
    const record = omikujiStore.getItem(props.category, props.selectedRuleId) as CommentRuleType
    return record.scriptId ? record.scriptId : null
  })

  // 選択されたスクリプト
  const selectedScript = computed((): ScriptPreset | null => {
    if (!currentScriptId.value) return null
    return gameScriptMap[currentScriptId.value] || null
  })
</script>
