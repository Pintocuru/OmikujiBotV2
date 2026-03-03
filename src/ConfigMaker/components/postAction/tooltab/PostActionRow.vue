<!-- src/ConfigMaker/components/postAction/tooltab/PostActionRow.vue -->
<template>
  <div class="flex items-center gap-2 p-1">
    <!-- 遅延秒数 -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <span class="badge badge-accent badge-sm rounded tooltip"> {{ action.delaySeconds }}s </span>
    </div>

    <!-- キャラクターアイコン -->
    <div v-if="isCharacter && action.actionType === 'message'" class="flex items-center gap-2 flex-shrink-0">
      <LayerImage :layers="iconSrc(action.characterKey, action.iconKey)" :size="8" />
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
  import { PostFlowType, PostFlowKindMaps } from '@/types/'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { resolveLucideIcon } from '@shared/utils/LucideIcon/useLucideIcon'

  const props = defineProps<{
    action: PostFlowType
  }>()

  const { isCharacter } = useVisibilityAccess()
  const { iconSrc } = useCharacterManager()

  const resolvedIcon = computed(() => {
    const iconName = PostFlowKindMaps[props.action.actionType]?.icon
    return resolveLucideIcon(iconName)
  })
</script>
