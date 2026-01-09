<!-- src\ConfigMaker\components\appInfo\FeatureUsageInfo\FeatureCard.vue -->
<template>
  <div v-if="isVisible" class="card bg-base-200 border-2" :class="getAccessLevelClass(accessLevel)">
    <div class="card-body p-4">
      <div class="flex items-start gap-3">
        <div class="p-2 rounded-lg" :class="getIconBgClass(accessLevel)">
          <component :is="icon" class="w-8 h-8" />
        </div>
        <div class="flex-1">
          <h4 class="font-bold">{{ title }}</h4>
          <p class="text-sm opacity-70 mt-1">{{ description }}</p>
        </div>
        <!-- スイッチ: none/basic のみ表示 -->
        <label class="swap swap-rotate">
          <input type="checkbox" :checked="isEnabled" @change="handleToggle" />
          <!-- オンの状態（basic） -->
          <div class="swap-on">
            <CheckCircle class="w-6 h-6 text-success" />
          </div>
          <!-- オフの状態（none） -->
          <div class="swap-off">
            <XCircle class="w-6 h-6 text-base-content/30" />
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { AccessLevelType } from '@shared/types'
  import { CheckCircle, XCircle } from 'lucide-vue-next'

  const props = defineProps<{
    title: string
    icon: any
    accessLevel: AccessLevelType
    description: string
    featureKey?: string
  }>()

  const emit = defineEmits<{
    (e: 'toggle', key: string, newLevel: AccessLevelType): void
  }>()

  // godModeは非表示
  const isVisible = computed(() => props.accessLevel !== 'godMode')

  // 現在有効かどうか
  const isEnabled = computed(
    () => props.accessLevel === 'basic' || props.accessLevel === 'adv' || props.accessLevel === 'pro'
  )

  function handleToggle() {
    if (!props.featureKey) return

    const newLevel: AccessLevelType = isEnabled.value ? 'none' : 'basic'
    emit('toggle', props.featureKey, newLevel)
  }

  function getAccessLevelClass(level: AccessLevelType): string {
    if (level === 'none') return 'border-base-300 opacity-60'
    return 'border-success'
  }

  function getIconBgClass(level: AccessLevelType): string {
    if (level === 'none') return 'bg-base-300'
    return 'bg-success/20 text-success'
  }
</script>
