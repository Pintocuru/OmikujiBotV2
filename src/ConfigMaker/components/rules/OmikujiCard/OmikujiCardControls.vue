<!-- C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\ConfigMaker\components\rules\OmikujiCard\OmikujiCardControls.vue -->
<template>
  <div class="card bg-base-100 p-4">
    <div class="flex flex-wrap items-center gap-3">
      <!-- ソート -->
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold">ソート:</span>
        <button @click="$emit('sort', { type: 'weight', order: 'desc' })" class="btn btn-sm btn-outline">
          <ArrowDownWideNarrow class="w-4 h-4" />
          出やすい順
        </button>
        <button @click="$emit('sort', { type: 'weight', order: 'asc' })" class="btn btn-sm btn-outline">
          <ArrowUpNarrowWide class="w-4 h-4" />
          出にくい順
        </button>
        <button @click="$emit('sort', { type: 'name' })" class="btn btn-sm btn-outline">
          <SortAsc class="w-4 h-4" />
          名前順
        </button>
      </div>

      <div class="divider divider-horizontal"></div>

      <!-- weight操作 -->
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-sm btn-outline">
          <Settings class="w-4 h-4" />
          重み操作
        </label>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
          <li><a @click="handleWeightOperation('equalize')">均等化</a></li>
          <li><a @click="handleWeightOperation('randomize')">ランダム化</a></li>
          <li><a @click="handleWeightOperation('normalize')">正規化 (合計100)</a></li>
          <li class="menu-title">
            <span>合計を指定値に</span>
          </li>
          <li class="px-2 py-1">
            <div class="flex gap-2">
              <input
                v-model.number="localTargetTotal"
                type="number"
                class="input input-xs input-bordered flex-1"
                placeholder="100"
                min="1"
                step="1"
              />
              <button @click="handleWeightOperation('scale')" class="btn btn-xs btn-primary">適用</button>
            </div>
          </li>
        </ul>
      </div>

      <div class="flex-1"></div>

      <!-- 統計表示 -->
      <div class="stats stats-horizontal shadow-sm">
        <div class="stat py-2 px-4">
          <div class="stat-title text-xs">アイテム数</div>
          <div class="stat-value text-lg">{{ itemCount }}</div>
        </div>
        <div class="stat py-2 px-4">
          <div class="stat-title text-xs">重み合計</div>
          <div class="stat-value text-lg">{{ totalWeight }}</div>
        </div>
      </div>
    </div>

    <!-- プログレスバー（全体の重み分布） -->
    <div v-if="localItems.length > 0" class="mt-4">
      <div class="space-y-2">
        <!-- プログレスバー本体 -->
        <div class="flex w-full h-8 rounded overflow-hidden border border-base-300">
          <div
            v-for="(item, index) in weightDistribution"
            :key="index"
            :style="{
              width: `${item.percentage}%`,
              backgroundColor: getColorForIndex(index),
            }"
            class="tooltip tooltip-top flex items-center justify-center text-xs text-white font-semibold cursor-pointer hover:brightness-110 transition-all"
            :data-tip="`${item.name || `アイテム${index + 1}`}: ${item.percentageStr}%`"
          >
            <span v-if="item.percentage > 8" class="truncate px-1">
              {{ item.percentage > 12 ? item.name || `#${index + 1}` : '' }}
            </span>
          </div>
        </div>

        <!-- 凡例（ドラッグ可能） -->
        <draggable
          v-model="localItems"
          item-key="id"
          handle=".legend-drag-handle"
          animation="200"
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
        >
          <template #item="{ element: item, index }">
            <div
              :key="item.id || `legend-${index}`"
              class="flex items-center gap-2 text-xs bg-base-100 p-2 rounded shadow-sm hover:shadow-md transition-shadow"
            >
              <!-- ドラッグハンドル -->
              <div class="legend-drag-handle cursor-move flex-shrink-0">
                <GripVertical class="w-4 h-4 text-base-content/40 hover:text-base-content/80" />
              </div>

              <!-- 色インジケーター -->
              <div class="w-4 h-4 rounded flex-shrink-0" :style="{ backgroundColor: getColorForIndex(index) }"></div>

              <!-- 情報 -->
              <div class="flex-1 min-w-0">
                <div class="truncate font-medium">
                  {{ item.name || `アイテム${index + 1}` }}
                </div>
                <div class="text-base-content/60">{{ weightDistribution[index]?.percentageStr }}%</div>

                <div class="text-base">
                  <span v-if="item?.isPriority" class="badge badge-xs badge-primary"> 優先 </span>
                  <span v-if="item?.criteria" class="badge badge-xs badge-secondary ml-1"> 条件 </span>
                </div>
              </div>

              <!-- Weight編集 -->
              <input
                type="number"
                :value="item.weight"
                @input="updateWeight(index, $event)"
                min="0"
                step="1"
                class="input input-xs input-bordered w-16 flex-shrink-0"
              />
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import draggable from 'vuedraggable'
  import { ArrowDownWideNarrow, ArrowUpNarrowWide, SortAsc, Settings, GripVertical } from 'lucide-vue-next'

  const props = defineProps<{
    items: OmikujiItemType[]
    totalWeight: number
  }>()

  const emit = defineEmits<{
    sort: [payload: { type: 'weight' | 'name'; order?: 'asc' | 'desc' }]
    'update:items': [items: OmikujiItemType[]]
  }>()

  const localTargetTotal = ref(100)

  // ローカルアイテム（ドラッグ&ドロップ用）
  const localItems = computed({
    get: () => props.items,
    set: (value) => emit('update:items', value),
  })

  const itemCount = computed(() => props.items.length)

  const weightDistribution = computed(() => {
    const total = props.totalWeight
    if (total === 0) return []

    return localItems.value.map((item, index) => {
      const percentage = (item.weight / total) * 100
      return {
        name: item.name || `アイテム${index + 1}`,
        weight: item.weight,
        percentage: percentage,
        percentageStr: percentage.toFixed(2),
      }
    })
  })

  const getColorForIndex = (index: number): string => {
    const colors = [
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#f59e0b',
      '#10b981',
      '#06b6d4',
      '#6366f1',
      '#84cc16',
      '#ef4444',
      '#14b8a6',
      '#f97316',
      '#a855f7',
    ]
    return colors[index % colors.length]
  }

  // Weight更新
  const updateWeight = (index: number, event: Event) => {
    const value = parseInt((event.target as HTMLInputElement).value)
    if (isNaN(value) || value < 0) return

    const updatedItems = [...localItems.value]
    updatedItems[index] = {
      ...updatedItems[index],
      weight: value,
    }
    emit('update:items', updatedItems)
  }

  // Weight操作
  const handleWeightOperation = (operation: string) => {
    let updatedItems = [...localItems.value]

    switch (operation) {
      case 'equalize':
        updatedItems = updatedItems.map((item) => ({
          ...item,
          weight: 1,
        }))
        break

      case 'randomize':
        updatedItems = updatedItems.map((item) => ({
          ...item,
          weight: Math.floor(Math.random() * 10) + 1,
        }))
        break

      case 'normalize':
        updatedItems = scaleWeightsToTotal(updatedItems, 100)
        break

      case 'scale':
        if (localTargetTotal.value > 0) {
          updatedItems = scaleWeightsToTotal(updatedItems, localTargetTotal.value)
        }
        break
    }

    emit('update:items', updatedItems)
  }

  const scaleWeightsToTotal = (items: OmikujiItemType[], targetSum: number): OmikujiItemType[] => {
    const currentTotal = items.reduce((sum, item) => sum + item.weight, 0)
    if (currentTotal === 0) return items

    const ratio = targetSum / currentTotal
    return items.map((item) => ({
      ...item,
      weight: Math.max(1, Math.round(item.weight * ratio)), // 最低1、整数に丸める
    }))
  }
</script>
