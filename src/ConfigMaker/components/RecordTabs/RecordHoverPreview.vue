<!-- src/ConfigMaker/components/RecordTabs/RecordHoverPreview.vue -->
<!-- !ホバー情報は不要かも -->
<template>
  <div
    class="absolute top-full left-0 mt-2 z-30 bg-base-100 border border-base-300 rounded-lg shadow-xl p-4 w-72"
    @mouseenter="$emit('mouseenter')"
  >
    <div class="space-y-2">
      <!-- ルール名 -->
      <div class="font-medium text-base">
        {{ rule.name || '名前未設定' }}
        <span v-if="isDev"> ( Key: {{ rule.key }} )</span>
      </div>

      <!-- 説明 -->
      <div v-if="'description' in rule && rule.description" class="text-sm text-base-content/70">
        {{ rule.description }}
      </div>

      <!-- カラー表示 -->
      <div v-if="rule.editorColor" class="flex items-center gap-2 text-xs">
        <span>カラー:</span>
        <div class="w-4 h-4 rounded-full border border-white/20" :style="{ backgroundColor: rule.editorColor }" />
        <span class="font-mono">{{ rule.editorColor }}</span>
      </div>

      <!-- ステータス情報 -->
      <div class="text-xs space-y-1">
        <div class="flex items-center gap-2">
          <span
            v-if="getRuleEnabledState !== undefined"
            class="badge badge-sm"
            :class="getRuleEnabledState ? 'badge-success' : 'badge-error'"
          >
            {{ getRuleEnabledState ? '有効' : '無効' }}
          </span>
        </div>

        <div v-if="hasOmikuji" class="font-medium">おみくじ : {{ omikujiCount }}種</div>

        <div v-if="hasValues" class="font-medium">プレースホルダー : {{ valuesCount }}種</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { isDev, RecordCategoryUnion } from '@/types/'

  const props = defineProps<{
    rule: RecordCategoryUnion
  }>()

  defineEmits<{
    mouseenter: []
  }>()

  // Computed
  const getRuleEnabledState = computed(() => ('isEnabled' in props.rule ? props.rule.isEnabled : undefined))

  const hasOmikuji = computed(
    () => 'omikuji' in props.rule && Array.isArray(props.rule.omikuji) && props.rule.omikuji.length > 0
  )

  // ! omikuji があるのは comment/timer のみ
  const omikujiCount = computed(() => ('omikuji' in props.rule ? props.rule.omikuji.length : 0))

  const hasValues = computed(() => 'values' in props.rule && Object.keys(props.rule.values).length > 0)

  // ! プレースホルダー用
  const valuesCount = computed(() => ('values' in props.rule ? Object.keys(props.rule.values).length : 0))
</script>
