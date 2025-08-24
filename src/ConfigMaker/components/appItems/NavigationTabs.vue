<!-- src/configMaker/components/NavigationTabs.vue -->
<template>
  <div
    class="flex w-full justify-center my-4 rounded-md border"
    :class="isGod ? ['border-warning'] : isPro ? ['border-success'] : []"
  >
    <div class="tabs gap-2">
      <div v-for="(tab, key) in filteredCategoryLabels" :key="key">
        <button
          class="tab w-full h-full p-4 pt-6 tooltip tooltip-top"
          :class="[
            selectedCategory === key
              ? isGod
                ? 'bg-warning text-warning-content tab-active'
                : isPro
                  ? 'bg-success text-success-content tab-active'
                  : 'bg-primary text-primary-content tab-active'
              : '',
          ]"
          :data-tip="tab.description"
          @click="omikujiStore.selectCategory(key)"
        >
          <div class="flex flex-col items-center justify-center space-y-1">
            <component :is="tab.icon" class="w-8 h-8" />
            <span class="text-xs text-center whitespace-nowrap text-ellipsis">{{ tab.label }}</span>
          </div>
          <span v-if="getCategoryItemCount(key) > 0" class="badge badge-xs badge-primary absolute top-1 right-1">
            {{ getCategoryItemCount(key) }}
          </span>
        </button>
      </div>
    </div>
  </div>

  <div
    class="dock dock-bottom"
    :class="isGod ? ['bg-warning text-warning-content'] : isPro ? ['bg-success text-success-content'] : ['']"
  >
    <div
      v-for="(tab, key) in filteredCategoryLabels"
      :key="key"
      class="dock-item tooltip tooltip-top"
      :class="[selectedCategory === key ? 'bg-primary text-primary-content' : '']"
      :data-tip="`${tab.label} - ${tab.description}`"
      @click="omikujiStore.selectCategory(key)"
    >
      <div class="relative">
        <component :is="tab.icon" class="w-8 h-8" />
        <span v-if="getCategoryItemCount(key) > 0" class="badge badge-xs badge-primary absolute -top-2 -right-2">
          {{ getCategoryItemCount(key) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { useCategoryUtils } from './useCategoryUtils'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

  const omikujiStore = useOmikujiStore()
  const { selectedCategory } = storeToRefs(omikujiStore)
  const { getCategoryItemCount, filteredCategoryLabels } = useCategoryUtils()
  const { isPro, isGod } = useSettingMode()
</script>
