<!-- src/ConfigMaker/components/postAction/items/PlaceholderChecker.vue -->
<!-- !使用しない -->
<template>
  <div class="space-y-2">
    <!-- 既存のプレースホルダー -->
    <div class="alert alert-info py-1">
      <span class="text-xs">
        <a
          class="link no-underline hover:underline"
          href="https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/ContentPlaceholder.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          プレースホルダー
        </a>

        <button
          v-for="id in definedPlaceholders"
          :key="id"
          class="btn btn-ghost btn-xs font-mono mx-1 hover:btn-primary"
          @click="selectPlaceholderItem(id)"
        >
          &lt;&lt;{{ id }}&gt;&gt;
        </button>
        <span v-if="!hasPlaceholders">なし</span>
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
  import { PlaceholderSchema } from '@/types'
  import { defaultPlaceholders } from '@/types/MainGenerator/DefaultPlaceholders'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import { Plus, AlertCircle } from 'lucide-vue-next'

  // Props
  const props = defineProps<{
    text: string
  }>()

  // Store
  const { getCategoryMap } = useGetRecordData()

  // プレースホルダーのパターン
  const PLACEHOLDER_PATTERN = /<<([^>]+)>>/g
  // プレースホルダーIDとして許可する形式（例: upVote, viewer, user_name）
  const PLACEHOLDER_ID_PATTERN = /^[a-zA-Z0-9_]+$/

  const allPlaceholdersInText = computed(() => {
    const matches = props.text.matchAll(PLACEHOLDER_PATTERN)
    const placeholderSet = new Set<string>()

    for (const match of matches) {
      if (match[1]) {
        const raw = match[1].trim()

        // 簡易プレースホルダー <<'A','B'>> はここで弾く
        if (!PLACEHOLDER_ID_PATTERN.test(raw)) continue

        // デフォルトプレースホルダーは除外
        if (!defaultPlaceholders.includes(raw as any)) {
          placeholderSet.add(raw)
        }
      }
    }

    return Array.from(placeholderSet)
  })

  // 定義済みプレースホルダー
  const definedPlaceholders = computed(() => {
    const definedPlaceholders = getCategoryMap('placeholders')
    return allPlaceholdersInText.value.filter((id) => definedPlaceholders[id])
  })

  // 未定義のプレースホルダーを検出
  const undefinedPlaceholders = computed(() => {
    const definedPlaceholders = getCategoryMap('placeholders')
    return allPlaceholdersInText.value.filter((id) => !definedPlaceholders[id])
  })

  //未定義プレースホルダーの存在チェック
  const hasUndefined = computed(() => undefinedPlaceholders.value.length > 0)

  // プレースホルダーが存在するかチェック
  const hasPlaceholders = computed(() => allPlaceholdersInText.value.length > 0)

  // アイテム選択
  const selectPlaceholderItem = (key: string) => {
    const navigationStore = useNavigationStore()
    navigationStore.selectCategory('placeholders')
    navigationStore.selectItem(key)
  }

  // 新しいプレースホルダーを作成
  const createPlaceholder = (placeholderKey: string) => {
    const parsedItem = PlaceholderSchema.parse({
      key: placeholderKey,
      name: placeholderKey,
    })

    const { addItem } = useOmikujiStore()
    addItem('placeholders', parsedItem)
    selectPlaceholderItem(placeholderKey)
  }
</script>
