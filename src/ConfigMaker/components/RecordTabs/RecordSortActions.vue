<!-- src/ConfigMaker/components/RecordTabs/RecordSortActions.vue -->
<template>
  <div class="flex items-center gap-2 mb-3">
    <!-- 新規追加ボタン -->
    <button class="btn btn-sm btn-primary" @click="store.handleAddItem" title="新しいイベントを追加">
      <span class="flex items-center gap-2">
        <Plus class="w-4 h-4" />
        追加
      </span>
    </button>

    <!-- ソート機能 -->
    <div class="flex items-center gap-1">
      <!--  orderを詰める機能 -->
      <button class="btn btn-sm btn-outline" @click="handleCompactOrder" title="order番号を詰める">
        <ListChecks class="w-4 h-4" />
        詰める
      </button>

      <!-- エディターカラーでソート -->
      <button
        class="btn btn-sm btn-outline"
        @click="handleSortByEditorColor"
        title="エディターカラーで並び替え"
        :class="{ 'btn-active': lastSortType === 'editorColor' }"
      >
        <span class="flex items-center gap-2">
          <Palette class="w-4 h-4" />
          色順
        </span>
      </button>

      <!-- 名前でソート -->
      <button
        class="btn btn-sm btn-outline"
        @click="handleSortByName"
        title="名前で並び替え"
        :class="{ 'btn-active': lastSortType === 'name' }"
      >
        <span class="flex items-center gap-2">
          <Type class="w-4 h-4" />
          名前順
        </span>
      </button>

      <!-- ソート方向インジケーター -->
      <span v-if="lastSortType" class="text-xs text-gray-500">
        {{ lastSortDirection === 'asc' ? '↑' : '↓' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRecordTabsStore } from './RecordTabsStore'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import type { BaseRecordType } from '@shared/types'
  import { Plus, Palette, Type, ListChecks } from 'lucide-vue-next'

  // Pinia store
  const store = useRecordTabsStore()
  const omikujiStore = useOmikujiStore()

  // ソート状態の追跡
  const lastSortType = ref<'editorColor' | 'name' | null>(null)
  const lastSortDirection = ref<'asc' | 'desc'>('asc')

  /**
   * エディターカラーでソート
   */
  const handleSortByEditorColor = async () => {
    if (!store.validCategory || !store.categoryArray) return

    // 前回と同じソートタイプの場合は方向を逆転
    if (lastSortType.value === 'editorColor') {
      lastSortDirection.value = lastSortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      lastSortDirection.value = 'asc'
    }
    lastSortType.value = 'editorColor'

    // エディターカラーでソート
    const sortedItems = [...store.categoryArray].sort((a: BaseRecordType, b: BaseRecordType) => {
      const colorA = a.editorColor || '#3B82F6'
      const colorB = b.editorColor || '#3B82F6'

      const comparison = colorA.localeCompare(colorB)
      return lastSortDirection.value === 'asc' ? comparison : -comparison
    })

    // 新しい順序を適用
    await applySortedOrder(sortedItems)
  }

  /**
   * order番号を詰める（1,2,3,...で再採番）
   */
  const handleCompactOrder = async () => {
    if (!store.validCategory || !store.categoryArray) return

    const compactedItems = [...store.categoryArray]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item, index) => ({
        key: item.key,
        newOrder: index + 1,
      }))

    await omikujiStore.batchUpdateOrder(store.validCategory, compactedItems)
  }

  /**
   * 名前でソート
   */
  const handleSortByName = async () => {
    if (!store.validCategory || !store.categoryArray) return

    // 前回と同じソートタイプの場合は方向を逆転
    if (lastSortType.value === 'name') {
      lastSortDirection.value = lastSortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      lastSortDirection.value = 'asc'
    }
    lastSortType.value = 'name'

    // 名前でソート
    const sortedItems = [...store.categoryArray].sort((a: BaseRecordType, b: BaseRecordType) => {
      const comparison = a.name.localeCompare(b.name, 'ja', { numeric: true })
      return lastSortDirection.value === 'asc' ? comparison : -comparison
    })

    // 新しい順序を適用
    await applySortedOrder(sortedItems)
  }

  /**
   * ソート済みアイテムの順序を実際のデータに適用
   */
  const applySortedOrder = async (sortedItems: BaseRecordType[]) => {
    if (!store.validCategory) return

    const orderUpdates = sortedItems.map((item, index) => ({
      key: item.key,
      newOrder: index + 1, // orderは1から始まる
    }))

    await omikujiStore.batchUpdateOrder(store.validCategory, orderUpdates)
  }
</script>
