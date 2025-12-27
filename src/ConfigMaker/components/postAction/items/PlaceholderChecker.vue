<!-- src\ConfigMaker\components\postAction\items\PlaceholderChecker.vue -->
<template>
  <div v-if="isPlaceholder && hasPlaceholders" class="space-y-2 mt-2">
    <!-- 既存のプレースホルダー -->
    <div v-if="definedPlaceholders.length > 0" class="alert alert-info py-2">
      <AlertCircle :size="16" class="shrink-0" />
      <span class="text-xs">
        定義済みプレースホルダー:
        <button
          v-for="id in definedPlaceholders"
          :key="id"
          class="btn btn-ghost btn-xs font-mono mx-1 hover:btn-primary"
          @click="selectPlaceholderItem(id)"
        >
          &lt;&lt;{{ id }}&gt;&gt;
        </button>
      </span>
    </div>

    <!-- 未定義のプレースホルダー -->
    <div v-if="hasUndefined" class="alert alert-warning py-2">
      <AlertCircle :size="16" class="shrink-0" />
      <span class="text-xs">
        未定義のプレースホルダーが見つかりました:
        <code v-for="id in undefinedPlaceholders" :key="id" class="font-mono mx-1"> &lt;&lt;{{ id }}&gt;&gt; </code>
      </span>
      <button class="btn btn-primary btn-xs gap-1 ml-auto" @click="createPlaceholder(undefinedPlaceholders[0])">
        <Plus :size="12" />
        プレースホルダーを作成
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { Plus, AlertCircle } from 'lucide-vue-next'
  import { defaultPlaceholders } from '@/types/OmikujiProcess/DefaultPlaceholders'
  import { PlaceholderSchema } from '@/types'
  import { hasAccess } from '@/ConfigMaker/scripts/useSettingMode'

  // Props
  const props = defineProps<{
    text: string
  }>()

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // プレースホルダーのパターン
  const PLACEHOLDER_PATTERN = /<<([^>]+)>>/g

  // プレースホルダー機能が見えているか
  const isPlaceholder = computed(() => hasAccess(data.value.featureUsage.usage.placeholders))

  /**
   * テキスト内のプレースホルダーを全て抽出
   */
  const allPlaceholdersInText = computed(() => {
    const matches = props.text.matchAll(PLACEHOLDER_PATTERN)
    const placeholderSet = new Set<string>()

    for (const match of matches) {
      if (match[1]) {
        const id = match[1].trim()
        // デフォルトプレースホルダーは除外
        if (!defaultPlaceholders.includes(id as any)) {
          placeholderSet.add(id)
        }
      }
    }

    return Array.from(placeholderSet)
  })

  /**
   * 定義済みプレースホルダー
   */
  const definedPlaceholders = computed(() => {
    const definedPlaceholders = data.value.placeholders
    return allPlaceholdersInText.value.filter((id) => definedPlaceholders[id])
  })

  /**
   * 未定義のプレースホルダーを検出
   */
  const undefinedPlaceholders = computed(() => {
    const definedPlaceholders = data.value.placeholders
    return allPlaceholdersInText.value.filter((id) => !definedPlaceholders[id])
  })

  /**
   * 未定義プレースホルダーの存在チェック
   */
  const hasUndefined = computed(() => undefinedPlaceholders.value.length > 0)

  /**
   * プレースホルダーが存在するかチェック
   */
  const hasPlaceholders = computed(() => allPlaceholdersInText.value.length > 0)

  /**
   * アイテム選択
   */
  const selectPlaceholderItem = (key: string) => {
    omikujiStore.selectCategory('placeholders')
    omikujiStore.selectItem(key)
  }

  /**
   * 新しいプレースホルダーを作成
   */
  const createPlaceholder = (placeholderKey: string) => {
    const parsedItem = PlaceholderSchema.parse({
      key: placeholderKey,
      name: placeholderKey,
    })

    omikujiStore.addItem('placeholders', parsedItem)
    selectPlaceholderItem(placeholderKey)
  }
</script>
