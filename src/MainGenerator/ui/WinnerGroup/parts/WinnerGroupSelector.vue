<!-- src/MainGenerator/ui/WinnerGroup/parts/WinnerGroupSelector.vue -->
<template>
  <div class="w-full mx-auto" :data-theme="winnerSetting.color" @click="handleClick">
    <component :is="currentComponent" :users="users" :label="winnerSetting.label" :is-visible="isVisible" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { WinnerGroupType, WinnerComponent } from '@/types'
  import ValentineCoupling from '../components/ValentineCoupling.vue'
  import TopStars from '../components/TopStars.vue'
  import { UserNameType } from '@shared/types'

  const props = defineProps<{
    winnerSetting: WinnerGroupType
    users: UserNameType[]
    isVisible: boolean
  }>()

  const emit = defineEmits<{
    click: []
  }>()

  const componentMap: Record<WinnerComponent, any> = {
    valentineCoupling: ValentineCoupling,
    topStars: TopStars,
  }

  const currentComponent = computed(() => {
    return componentMap[props.winnerSetting.component] ?? ValentineCoupling
  })

  const handleClick = () => emit('click')
</script>
