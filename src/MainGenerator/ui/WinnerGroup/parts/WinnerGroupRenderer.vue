<!-- src\MainGenerator\ui\WinnerGroup\parts\WinnerGroupRenderer.vue -->
<template>
  <div class="relative w-full max-w-2xl mx-auto" :data-theme="winnerSetting.color" @click="reload">
    <component :is="currentComponent" :key="renderKey" :users="users" :label="winnerSetting.label" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { SettingsWinnerGroupType, WinnerComponent } from '@/types'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import ValentineCoupling from '../components/ValentineCoupling.vue'
  import TopStars from '../components/TopStars.vue'

  const props = defineProps<{
    winnerSetting: SettingsWinnerGroupType
    users: UserVisitRecord[]
  }>()

  const componentMap: Record<WinnerComponent, any> = {
    valentineCoupling: ValentineCoupling,
    topStars: TopStars,
  }

  const currentComponent = computed(() => {
    return componentMap[props.winnerSetting.component] ?? ValentineCoupling
  })

  const renderKey = ref(0)

  function reload() {
    renderKey.value++
  }
</script>
