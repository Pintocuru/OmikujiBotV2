<!-- src\ConfigMaker\components\postAction\PostActionRow.vue -->
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
        <component v-for="(Icon, i) in icons" :is="Icon" :key="i" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionType } from '@/types/'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { MessageSquare, PartyPopper, Volume2, MessagesSquare } from 'lucide-vue-next'

  const props = defineProps<{
    action: PostActionType
  }>()

  const { isCharacter } = useVisibilityAccess()
  const { iconSrc } = useCharacterManager()

  const icons = computed(() => {
    const list = []
    switch (props.action.actionType) {
      case 'message':
        list.push(MessageSquare)
        break
      case 'wordParty':
        list.push(PartyPopper)
        break
      case 'sound':
        list.push(Volume2)
        break
      case 'actionSet':
        list.push(MessagesSquare)
        break
    }
    return list
  })
</script>
