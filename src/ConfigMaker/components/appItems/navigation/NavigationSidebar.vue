<template>
  <div
    class="sticky top-0 h-screen flex flex-col border-r overflow-y-auto transition-all duration-200 shrink-0 relative"
    :class="sidebarClass"
    :style="{ width: isExpanded ? '200px' : '72px' }"
  >
    <!-- 折りたたみトグル -->
    <button class="btn btn-ghost btn-sm mx-auto mt-3 mb-1 shrink-0" @click="isExpanded = !isExpanded">
      <PanelLeftClose v-if="isExpanded" class="w-5 h-5" />
      <PanelLeftOpen v-else class="w-5 h-5" />
    </button>

    <div class="flex flex-col gap-0.5 p-2 flex-1">
      <template v-for="(tab, key) in filteredCategoryLabels" :key="key">
        <div>
          <button
            class="btn btn-ghost w-full relative flex items-center gap-2 min-h-0 h-auto py-2"
            :class="[categoryButtonClass(key), isExpanded ? 'justify-start px-3' : 'justify-center px-0']"
            :title="`${tab.label}：${tab.description}`"
            @click="navigateCategory(key)"
          >
            <component :is="categoryIcon(tab.icon)" class="w-5 h-5 shrink-0" />

            <span v-if="isExpanded" class="text-sm truncate text-left flex-1">
              {{ tab.label }}
            </span>

            <span
              v-if="getCategoryItemCount(key) > 0"
              class="badge badge-xs badge-primary shrink-0"
              :class="isExpanded ? '' : 'absolute -top-1 -right-1'"
            >
              {{ getCategoryItemCount(key) }}
            </span>
          </button>
        </div>

        <SidebarSubItems
          v-if="isExpanded && selectedItemKey && selectedCategory === key"
          :category="key"
          :isRecord="isRecordCategory(key)"
          v-model="getDraggableModel(key).value"
          :staticItems="getStaticSubItems(key)"
          :selectedItemKey="selectedItemKey"
          :theme="theme"
          @selectItem="(key, section) => navigationStore.selectItem(key, section)"
          @dragEnd="onDragEnd"
        />
      </template>
    </div>

    <!-- ライセンススイッチ -->
    <div v-if="isDev" class="absolute bottom-2 left-0 w-full flex justify-center">
      <LicenseSwitch />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { storeToRefs as storeTR } from 'pinia'
  import { isDev } from '@/types'
  import { useNavigationSidebarDrag } from './useNavigationSidebarDrag'
  import { CategoryType } from '@/types/OmikujiData/'
  import { uiKindMap } from '@/types/MetaMaps/UiKindMaps'
  import { useCategoryUtils } from './useCategoryUtils'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { LucideIconName, resolveLucideIcon } from '@shared/utils/LucideIcon/useLucideIcon'
  import SidebarSubItems from './SidebarSubItems.vue'
  import LicenseSwitch from '@config/components/appInfo/settings/LicenseSwitch.vue'
  import { PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'

  const navigationStore = useNavigationStore()
  const { isRecordCategory, selectCategory } = useNavigationStore()
  const { selectedCategory, selectedItemKey } = storeToRefs(navigationStore)
  const { getCategoryItemCount, filteredCategoryLabels } = useCategoryUtils()
  const { isAdv, isPro, isGod } = useSettingMode()
  const omikujiStore = useOmikujiStore()
  const { data } = storeTR(omikujiStore)

  const isExpanded = ref(true)
  const { draggableItems, onDragEnd } = useNavigationSidebarDrag(isExpanded)

  // ----------------------
  // mode → color
  // ----------------------
  const modeColorMap = {
    basic: 'primary',
    god: 'warning',
    pro: 'success',
    adv: 'info',
  } as const

  const currentMode = computed<'god' | 'pro' | 'adv' | 'basic'>(() => {
    if (isGod.value) return 'god'
    if (isPro.value) return 'pro'
    if (isAdv.value) return 'adv'
    return 'basic'
  })

  const theme = computed(() => modeColorMap[currentMode.value])

  // ----------------------
  // sidebar style
  // ----------------------
  const sidebarClass = computed(() => {
    const color = modeColorMap[currentMode.value]

    return `bg-${color} border-${color}`
  })

  // ----------------------
  // button style
  // ----------------------
  const categoryButtonClass = (key: CategoryType) => {
    const color = theme.value
    return `bg-${color} text-${color}-content hover:bg-${color}`
  }

  // ----------------------
  const categoryIcon = (icon: LucideIconName) => resolveLucideIcon(icon)

  const navigateCategory = (key: CategoryType) => {
    selectCategory(key)
  }

  // ----------------------
  // draggable
  // ----------------------
  const getDraggableModel = (key: CategoryType) =>
    computed({
      get: () => draggableItems.value[key] ?? [],
      set: (val) => {
        draggableItems.value[key] = val
      },
    })

  // ----------------------
  // static items
  // ----------------------
  type StaticSubItem = { key: string; label: string }

  const getStaticSubItems = (category: CategoryType): StaticSubItem[] => {
    if (category === 'jsonMerge') {
      return data.value.jsonMerge.map((item) => ({
        key: item.key,
        label: item.name || '（名前なし）',
      }))
    }

    if (category === 'components') {
      return Object.keys(data.value.components.settings)
        .filter((k) => data.value.components.settings[k as keyof typeof data.value.components.settings] !== undefined)
        .map((k) => ({
          key: k,
          label: uiKindMap[k as keyof typeof uiKindMap]?.label ?? k,
        }))
    }

    return []
  }
</script>
