<!-- src/ConfigMaker/components/appItems/ContentArea.vue -->
<template>
  <!-- カテゴリ帯 -->
  <div id="section-Top" class="flex items-center justify-between px-4 py-3 bg-primary text-primary-content">
    <div class="flex items-center gap-2 text-lg font-bold">
      <component :is="currentIcon" class="w-6 h-6" />
      {{ currentCategory.label }}
    </div>

    <div class="text-sm opacity-80">
      {{ currentCategory.description }}
    </div>
  </div>

  <component :is="currentEditor" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { categoryMap, CategoryType } from '@/types'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import CommentEventEditor from '@config/components/eventsComment/CommentEditor.vue'
  import TimerEventEditor from '@config/components/eventsTimer/TimerEditor.vue'
  import MetaEventEditor from '@config/components/eventsService/ServiceEditor.vue'
  import ReactionEventEditor from '@config/components/eventsReaction/ReactionEditor.vue'
  import ActionSetsEditor from '@config/components/actionSets/ActionSetsEditor.vue'
  import PlaceholderEditor from '@config/components/placeholders/PlaceholderEditor.vue'
  import CharacterEditor from '@config/components/characters/CharacterEditor.vue'
  import UiEditor from '@config/UiEditor/UiEditor.vue'
  import DataPacks from '@config/components/dataPacks/DataPacks.vue'
  import AppInfoEditor from '@config/components/appInfo/AppInfoEditor.vue'
  import JsonMergeEditor from '@config/components/JsonMerge/JsonMergeEditor.vue'
  import { resolveLucideIcon } from '@shared/utils/LucideIcon/useLucideIcon'

  const navigationStore = useNavigationStore()
  const { selectedCategory } = storeToRefs(navigationStore)

  const currentCategory = computed(() => categoryMap[selectedCategory.value])
  const currentIcon = computed(() => resolveLucideIcon(currentCategory.value?.icon))

  // エディターマップ
  const editorMap: Record<CategoryType, any> = {
    jsonMerge: JsonMergeEditor,
    comments: CommentEventEditor,
    timers: TimerEventEditor,
    metas: MetaEventEditor,
    reactions: ReactionEventEditor,
    actionSets: ActionSetsEditor,
    placeholders: PlaceholderEditor,
    characters: CharacterEditor,
    components: UiEditor,
    dataPacks: DataPacks,
    appInfo: AppInfoEditor,
  } as const
  const currentEditor = computed(() => editorMap[selectedCategory.value])
</script>
