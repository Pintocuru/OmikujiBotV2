<!-- src/ConfigMaker/components/placeholders/PlaceholderItem.vue -->
<!-- !使用しない -->
<template>
  <div
    :class="cardClasses"
    @click="handleClick"
    @mouseenter="showDetails = true"
    @mouseleave="showDetails = false"
    class="my-auto"
  >
    <div class="flex items-center justify-between p-2 gap-3 cursor-pointer">
      <!-- プレースホルダー情報 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <!-- editorColorインジケーター -->
          <div
            v-if="placeholder.editorColor"
            class="w-3 h-3 rounded-full flex-shrink-0"
            :style="{ backgroundColor: placeholder.editorColor }"
            :title="`Color: ${placeholder.editorColor}`"
          />
          <div v-else class="w-3 h-3 rounded-full border border-base-content/20 flex-shrink-0" title="カラーなし" />

          <span class="font-medium text-sm truncate">
            {{ placeholder.name || placeholder.key }}
          </span>
          <code class="badge badge-xs bg-base-200 whitespace-nowrap"> Key: {{ placeholder.key }} </code>
          <div class="badge badge-outline badge-xs">
            {{ placeholder.values.length }}
          </div>
          <div v-if="isDefault" class="badge badge-secondary badge-xs whitespace-nowrap">標準</div>
          <div v-if="isUsed" class="badge badge-primary badge-xs whitespace-nowrap">使用中</div>
        </div>

        <!-- ランダム値表示 -->
        <div class="text-xs text-base-content/60 mt-0.5 truncate">
          {{ currentRandomValue }}
        </div>
      </div>

      <!-- アクションボタン -->
      <div class="flex items-center gap-1" @click.stop>
        <!-- プレースホルダーの文字列をコピー -->
        <CopyButton :value="`<<${placeholder.key}>>`" data-tip="IDをコピー" :small="true" />

        <!-- プレースホルダーへ移動 -->
        <button
          v-if="!isDefault"
          class="btn btn-outline btn-xs tooltip"
          data-tip="プレースホルダーへ移動"
          @click="selectPlaceholderItem(placeholder.key)"
        >
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- ホバー時の詳細ポップアップ -->
    <div
      v-if="showDetails && placeholder.values.length > 0"
      class="absolute z-50 top-full left-0 right-0 mt-1 p-3 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
    >
      <div class="space-y-1">
        <div v-for="(val, i) in placeholder.values.slice(0, 20)" :key="i" class="text-xs">
          <span
            v-if="typeof val === 'string'"
            class="badge badge-xs bg-base-200 whitespace-nowrap mr-1 tooltip tooltip-top"
            data-tip="重み"
            >1</span
          >
          <span v-else class="badge badge-xs bg-base-200 whitespace-nowrap mr-1 tooltip tooltip-top" data-tip="重み">
            {{ val.weight }}</span
          >

          <span v-if="typeof val === 'string'" class="break-all">{{ val }}</span>
          <span v-else class="break-all"> {{ val.content }} </span>
        </div>
        <div v-if="placeholder.values.length > 20" class="text-xs opacity-60 pt-1">
          ...他 {{ placeholder.values.length - 20 }}件
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue'
  import { PlaceholderType } from '@/types'
  import CopyButton from '@config/components/parts/CopyButton.vue'
  import { ArrowRight } from 'lucide-vue-next'
  import { useNavigationStore } from '@config/stores/useNavigationStore'

  // Props
  const props = defineProps<{
    placeholder: PlaceholderType
    isUsed: boolean
    isDefault: boolean
  }>()

  // Emits
  defineEmits<{
    click: [placeholderId: string]
  }>()

  // State
  const currentRandomValue = ref<string>('')
  const showDetails = ref(false)

  // Computed
  const cardClasses = computed(() => [
    'card card-compact transition-colors hover:shadow-sm',
    props.isUsed ? 'bg-primary/20 border border-primary/40 hover:bg-primary/30' : 'bg-base-100 hover:bg-base-200',
  ])

  // PlaceholderItem内でランダム値を管理
  const generateRandomValue = (): string => {
    if (!props.placeholder.values?.length) return ''

    const randomIndex = Math.floor(Math.random() * props.placeholder.values.length)
    const selectedValue = props.placeholder.values[randomIndex]
    return typeof selectedValue === 'object' ? selectedValue.content : selectedValue || ''
  }

  const refreshRandomValue = () => {
    currentRandomValue.value = generateRandomValue()
  }

  const handleClick = () => {
    refreshRandomValue()
  }

  // 初期値設定
  onMounted(() => {
    refreshRandomValue()
  })

  // アイテム選択
  const selectPlaceholderItem = (key: string) => {
    const navigationStore = useNavigationStore()
    navigationStore.selectCategory('placeholders')
    navigationStore.selectItem(key)
  }
</script>
