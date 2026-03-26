<!-- src/ConfigMaker/components/appItems/navigation/NavigationSidebar.vue -->
<template>
  <div
    class="sticky top-0 h-screen flex flex-col border-r overflow-y-auto transition-all duration-200 shrink-0 relative overflow-x-hidden"
    :class="sidebarBorderClass"
    :style="{ width: isExpanded ? '220px' : '72px' }"
  >
    <!-- 折りたたみトグル -->
    <button class="btn btn-ghost btn-sm mx-auto mt-3 mb-1 shrink-0" @click="isExpanded = !isExpanded">
      <PanelLeftClose v-if="isExpanded" class="w-5 h-5" />
      <PanelLeftOpen v-else class="w-5 h-5" />
    </button>

    <!-- プリセット管理ボタン -->
    <button
      v-if="(isPro && isServerConnected) || isDev"
      class="btn btn-ghost w-full flex items-center gap-2 min-h-0 h-auto py-2 mx-2"
      :class="isExpanded ? 'justify-start px-3' : 'justify-center px-0'"
      title="プリセット管理"
      @click="openPresetManager"
    >
      <FolderCog class="w-5 h-5 shrink-0" />
      <span v-if="isExpanded" class="text-sm truncate text-left flex-1">プリセット管理</span>
    </button>

    <!-- 各種カテゴリ -->
    <NavigationSidebarCategories :isExpanded="isExpanded" :theme="theme" />

    <!-- 開発者向けフッター -->
    <NavigationSidebarFooter />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev } from '@/types'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useDevStore } from '@/PresetManager/stores/useDevStore'
  import NavigationSidebarCategories from './NavigationSidebarCategories.vue'
  import NavigationSidebarFooter from './NavigationSidebarFooter.vue'
  import { PanelLeftClose, PanelLeftOpen, FolderCog } from 'lucide-vue-next'

  // ストア ─
  const navigationStore = useNavigationStore()
  const { activeSection } = storeToRefs(navigationStore)

  const devStore = useDevStore()
  const { isServerConnected } = storeToRefs(devStore)

  // ライセンスモード
  const { isAdv, isPro, isGod } = useSettingMode()

  const currentMode = computed<'god' | 'pro' | 'adv' | 'basic'>(() => {
    if (isGod.value) return 'god'
    if (isPro.value) return 'pro'
    if (isAdv.value) return 'adv'
    return 'basic'
  })

  const modeColorMap = {
    basic: 'primary',
    god: 'warning',
    pro: 'success',
    adv: 'info',
  } as const

  const theme = computed(() => modeColorMap[currentMode.value])

  // サイドバースタイル
  const sidebarBorderClass = computed(() => `border-${theme.value} border-r-2`)

  // 展開状態
  const isExpanded = ref(true)

  // プリセットマネージャー
  const openPresetManager = () => {
    activeSection.value = 'presetManager'
  }
</script>
