<!-- src/ConfigMaker/components/parts/LicenseBadge.vue -->
<template>
  <div v-if="mode" class="badge tooltip tooltip-bottom truncate" :class="badgeClass" :data-tip="currentTip">
    {{ label }}
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'

  const { isAdv, isPro, isGod } = useSettingMode()

  const props = defineProps<{
    forceMode?: Mode
    godTip?: string
    proTip?: string
    advTip?: string
  }>()

  type Mode = 'god' | 'pro' | 'adv'

  const mode = computed<Mode | null>(() => {
    if (props.forceMode) return props.forceMode
    if (isGod.value) return 'god'
    if (isPro.value) return 'pro'
    if (isAdv.value) return 'adv'
    return null
  })

  const MODE_CONFIG: Record<Mode, { label: string; badge: string; tip?: string }> = {
    god: {
      label: 'GOD-MODE',
      badge: 'badge-warning',
      tip: props.godTip,
    },
    pro: {
      label: 'PRO',
      badge: 'badge-success',
      tip: props.proTip,
    },
    adv: {
      label: 'ADV',
      badge: 'badge-info',
      tip: props.advTip,
    },
  }

  const badgeClass = computed(() => (mode.value ? MODE_CONFIG[mode.value].badge : ''))

  const label = computed(() => (mode.value ? MODE_CONFIG[mode.value].label : ''))

  const currentTip = computed(() => (mode.value ? MODE_CONFIG[mode.value].tip : undefined))
</script>
