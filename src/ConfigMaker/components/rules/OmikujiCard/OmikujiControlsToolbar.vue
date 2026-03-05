<!-- src/ConfigMaker/components/rules/OmikujiCard/OmikujiControlsToolbar.vue -->
<!-- !使用しない -->
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
          <li><a @click="$emit('weight-operation', 'equalize')">均等化</a></li>
          <li><a @click="$emit('weight-operation', 'randomize')">ランダム化</a></li>
          <li><a @click="$emit('weight-operation', 'normalize')">正規化 (合計100)</a></li>
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
              <button @click="handleScaleOperation" class="btn btn-xs btn-primary">適用</button>
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
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { ArrowDownWideNarrow, ArrowUpNarrowWide, SortAsc, Settings } from 'lucide-vue-next'

  defineProps<{
    itemCount: number
    totalWeight: number
  }>()

  const emit = defineEmits<{
    sort: [payload: { type: 'weight' | 'name'; order?: 'asc' | 'desc' }]
    'weight-operation': [operation: string, targetTotal?: number]
  }>()

  const localTargetTotal = ref(100)

  const handleScaleOperation = () => {
    if (localTargetTotal.value > 0) {
      emit('weight-operation', 'scale', localTargetTotal.value)
    }
  }
</script>
