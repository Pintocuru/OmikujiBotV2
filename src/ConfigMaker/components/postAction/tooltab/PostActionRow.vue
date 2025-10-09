<!-- src\ConfigMaker\components\postAction\PostActionRow.vue -->
<template>
  <div class="flex items-center gap-2 p-1">
    <!-- 遅延秒数 -->
    <div class="flex items-center gap-2 flex-shrink-0">
      <span class="badge badge-accent badge-sm rounded tooltip"> {{ action.delaySeconds }}s </span>
    </div>

    <!-- キャラクターアイコン（message / toast のみ表示） -->
    <div v-if="['message', 'toast'].includes(action.actionType)" class="flex items-center gap-2 flex-shrink-0">
      <CharacterIcon
        :character-key="action.characterKey"
        :icon-key="action.iconKey"
        img-class="w-6 h-6 rounded-full"
        fallback-class="w-6 h-6 rounded-full bg-base-300 flex items-center justify-center text-xs"
      />
    </div>

    <!-- 種別アイコン -->
    <div class="flex-1 min-w-0">
      <div class="flex flex-wrap gap-1 items-center">
        <component v-for="(Icon, i) in icons" :is="Icon" :key="i" class="w-4 h-4" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionType } from '@/types/'
  import CharacterIcon from '@ConfigComponents/parts/CharacterIcon.vue'
  import { MessageSquare, Bell, PartyPopper, MessagesSquare } from 'lucide-vue-next'

  const props = defineProps<{
    action: PostActionType
  }>()

  const icons = computed(() => {
    const list = []
    switch (props.action.actionType) {
      case 'message':
        list.push(MessageSquare)
        if (props.action.wordParty) list.push(PartyPopper)
        break
      case 'toast':
        list.push(Bell)
        if (props.action.wordParty) list.push(PartyPopper)
        break
      case 'wordParty':
        list.push(PartyPopper)
        break
      case 'actionSet':
        list.push(MessagesSquare)
        break
    }
    return list
  })
</script>
