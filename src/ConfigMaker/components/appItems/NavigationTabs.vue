<!-- src/ConfigMaker/components/appItems/NavigationTabs.vue -->
<template>
  <div class="flex w-full justify-center my-4 rounded-md border" :class="frameClass">
    <div class="tabs gap-2">
      <div v-for="(tab, key) in filteredCategoryLabels" :key="key">
        <button
          class="tab w-full h-full p-4 pt-6 tooltip tooltip-top"
          :class="tabButtonClass(key)"
          :data-tip="tab.description"
          @click="navigateCategory(key)"
        >
          <div class="flex flex-col items-center justify-center space-y-1">
            <component :is="resolveLucideIcon(tab.icon)" class="w-8 h-8" />
            <span class="text-xs text-center whitespace-nowrap text-ellipsis">
              {{ tab.label }}
            </span>
          </div>

          <span v-if="getCategoryItemCount(key) > 0" class="badge badge-xs badge-primary absolute top-1 right-1">
            {{ getCategoryItemCount(key) }}
          </span>
        </button>
      </div>
    </div>
  </div>

  <!-- dock -->
  <div class="dock dock-bottom" :class="dockClass">
    <div
      v-for="(tab, key) in filteredCategoryLabels"
      :key="key"
      class="dock-item tooltip tooltip-top"
      :class="dockItemClass(key)"
      :data-tip="`${tab.label} - ${tab.description}`"
      @click="navigateCategory(key)"
    >
      <div class="relative">
        <component :is="resolveLucideIcon(tab.icon)" class="w-8 h-8" />
        <span v-if="getCategoryItemCount(key) > 0" class="badge badge-xs badge-primary absolute -top-2 -right-2">
          {{ getCategoryItemCount(key) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CategoryType } from '@/types/OmikujiData/'
  import { useCategoryUtils } from './useCategoryUtils'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  const navigationStore = useNavigationStore()

  const { selectedCategory } = storeToRefs(navigationStore)
  const { getCategoryItemCount, filteredCategoryLabels } = useCategoryUtils()
  const { isPro, isGod } = useSettingMode()

  const theme = computed(() => {
    if (isGod.value) return 'warning'
    if (isPro.value) return 'success'
    return 'primary'
  })

  const frameClass = computed(() => (isGod.value ? 'border-warning' : isPro.value ? 'border-success' : ''))

  const dockClass = computed(() =>
    isGod.value ? 'bg-warning text-warning-content' : isPro.value ? 'bg-success text-success-content' : ''
  )

  const tabButtonClass = (key: CategoryType) => {
    if (selectedCategory.value !== key) return ''
    return `bg-${theme.value} text-${theme.value}-content tab-active`
  }

  const dockItemClass = (key: CategoryType) => (selectedCategory.value === key ? 'bg-primary text-primary-content' : '')

  const navigateCategory = (key: CategoryType) => {
    navigationStore.selectCategory(key)
  }
</script>
