<!-- src/configMaker/components/appItems/LicenseBadge.vue -->
<template>
  <div v-if="mode" class="badge tooltip tooltip-bottom" :class="badgeClass" :data-tip="currentTip">
    {{ label }}
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

  const { isPro, isGod } = useSettingMode()

  const props = defineProps<{
    forceMode?: 'god' | 'pro'
    godTip?: string
    proTip?: string
  }>()

  // 優先順位: forceMode > isGod > isPro
  const mode = computed(() => props.forceMode ?? (isGod.value ? 'god' : isPro.value ? 'pro' : null))

  const badgeClass = computed(() =>
    mode.value === 'god' ? 'badge-warning' : mode.value === 'pro' ? 'badge-success' : ''
  )

  const label = computed(() => (mode.value === 'god' ? 'GOD-MODE' : mode.value === 'pro' ? 'PRO' : ''))

  const currentTip = computed(() =>
    mode.value === 'god' ? props.godTip : mode.value === 'pro' ? props.proTip : undefined
  )
</script>
