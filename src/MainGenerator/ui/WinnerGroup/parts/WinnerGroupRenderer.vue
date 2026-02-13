<!-- src\MainGenerator\ui\WinnerGroup\parts\WinnerGroupRenderer.vue -->
<template>
  <div class="relative w-full max-w-2xl mx-auto" :data-theme="winnerSetting.color" @click="handleClick">
    <component :is="currentComponent" :users="users" :label="winnerSetting.label" :is-visible="isVisible" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { SettingsWinnerGroupType, WinnerComponent } from '@/types'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import ValentineCoupling from '../components/ValentineCoupling.vue'
  import TopStars from '../components/TopStars.vue'

  const props = defineProps<{
    winnerSetting: SettingsWinnerGroupType
    users: UserVisitRecord[]
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
