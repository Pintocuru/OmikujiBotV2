<!-- src/ConfigMaker/components/postAction/tooltab/PostActionRow.vue -->
<template>
  <div class="flex items-center gap-2 p-1">
    <!-- 遅延秒数 -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <span class="badge badge-accent badge-sm rounded tooltip"> {{ action.delaySeconds }}s </span>
    </div>

    <!-- 種別アイコン -->
    <div class="flex-1 min-w-0">
      <div class="flex flex-wrap gap-1 items-center">
        <component v-if="resolvedIcon" :is="resolvedIcon" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostFlowType, PostFlowKindMaps } from '@/types'
  import { resolveLucideIcon } from '@shared/utils/LucideIcon/useLucideIcon'

  const props = defineProps<{
    action: PostFlowType
  }>()

  const resolvedIcon = computed(() => {
    const iconName = PostFlowKindMaps[props.action.actionType]?.icon
    return resolveLucideIcon(iconName)
  })
</script>
