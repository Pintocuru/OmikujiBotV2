<!-- src/ConfigMaker/components/appItems/navigation/NavigationSidebar.vue -->
<template>
  <div
    class="sticky top-0 h-screen flex flex-col border-r overflow-y-auto transition-all duration-200 shrink-0 relative"
    :class="sidebarBorderClass"
    :style="{ width: isExpanded ? '200px' : '72px' }"
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

    <!-- 各種カテゴリ（切り出し済み） -->
    <NavigationSidebarCategories :isExpanded="isExpanded" :theme="theme" />

    <!-- 開発者向けフッター -->
    <div v-if="isDev" class="absolute bottom-2 left-0 w-full flex flex-col items-center space-y-2">
      <template v-if="saveFileName">
        <button
          class="btn btn-xs btn-warning truncate"
          :class="!hasChanged ? 'btn-soft' : ''"
          data-tip="ファイルを保存"
          :disabled="!hasChanged || !saveFileName"
          @click="() => devStore.overwriteConfig(saveFileName)"
        >
          <Save class="w-4 h-4" />
          {{ saveFileName.replace('.json', '') }} の保存
        </button>
      </template>

      <LicenseBadge />
      <LicenseSwitch />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev } from '@/types'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useDevStore } from '@/PresetManager/stores/useDevStore'
  import NavigationSidebarCategories from './NavigationSidebarCategories.vue'
  import LicenseSwitch from '@config/components/appInfo/settings/LicenseSwitch.vue'
  import LicenseBadge from '@config/components/parts/LicenseBadge.vue'
  import { PanelLeftClose, PanelLeftOpen, FolderCog, Save } from 'lucide-vue-next'

  // ── ストア ─────────────────────────────────────────────
  const navigationStore = useNavigationStore()
  const { activeSection } = storeToRefs(navigationStore)

  const omikujiStore = useOmikujiStore()
  const { hasChanged } = storeToRefs(omikujiStore)

  const devStore = useDevStore()
  const { isServerConnected, saveFileName } = storeToRefs(devStore)

  // ── ライセンスモード ──────────────────────────────────
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

  // ── サイドバースタイル ────────────────────────────────
  const sidebarBorderClass = computed(() => `border-${theme.value} border-r-2`)

  // ── 展開状態 ──────────────────────────────────────────
  const isExpanded = ref(true)

  // ── プリセットマネージャー ────────────────────────────
  const openPresetManager = () => {
    activeSection.value = 'presetManager'
  }
</script>
