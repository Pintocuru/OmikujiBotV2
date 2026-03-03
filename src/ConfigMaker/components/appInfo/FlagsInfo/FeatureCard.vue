<!-- src/ConfigMaker/components/appInfo/FlagsInfo/FeatureCard.vue -->
<template>
  <div v-if="isVisible" class="card bg-base-200 border-2" :class="getAccessLevelClass(accessLevel)">
    <div class="card-body p-4">
      <div class="flex items-start gap-3">
        <div class="p-2 rounded-lg" :class="getIconBgClass(accessLevel)">
          <component :is="resolvedIcon" class="w-8 h-8" />
        </div>
        <div class="flex-1">
          <h4 class="font-bold">{{ title }}</h4>
          <p class="text-sm opacity-70 mt-1">{{ description }}</p>
        </div>
        <!-- スイッチ: showToggle が true のときのみ表示 -->
        <label v-if="showToggle" class="swap swap-rotate">
          <input type="checkbox" :checked="isEnabled" @change="handleToggle" />
          <div class="swap-on">
            <CheckCircle class="w-6 h-6 text-success" />
          </div>
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
  import { CheckCircle, XCircle } from 'lucide-vue-next'
  import type { AccessLevelType } from '@shared/types'
  import { LucideIconName, resolveLucideIcon } from '@shared/utils/LucideIcon/useLucideIcon'

  const props = defineProps<{
    title: string
    icon: LucideIconName
    accessLevel: AccessLevelType
    description: string
    featureKey?: string
    showToggle?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'toggle', key: string, newLevel: AccessLevelType): void
  }>()

  // アイコン名文字列 → Lucideコンポーネントに解決
  const resolvedIcon = computed(() => resolveLucideIcon(props.icon))

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
