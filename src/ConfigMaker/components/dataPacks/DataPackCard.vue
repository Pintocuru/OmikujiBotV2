<!-- src/ConfigMaker/components/dataPacks/DataPackCard.vue -->
<template>
  <div class="card card-compact bg-base-200 border border-base-300 transition-colors">
    <!-- バナー画像 -->
    <figure class="h-50 overflow-hidden bg-base-300">
      <img
        v-if="pack.bannerUrl && !bannerError"
        :src="pack.bannerUrl"
        :alt="pack.meta.name"
        class="w-full h-full object-cover"
        @error="bannerError = true"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-base-content/60">
        <Image class="h-10 w-10" />
      </div>
    </figure>

    <div class="card-body gap-1">
      <!-- パック名 -->
      <h3 class="card-title font-semibold truncate">
        {{ pack.meta.name }}
        <span class="badge badge-accent badge-xs">{{ pack.meta.version }}</span>
      </h3>

      <!-- 説明 -->
      <p v-if="pack.meta.description" class="text-sm text-base-content/60 line-clamp-2">
        {{ pack.meta.description }}
      </p>

      <!-- タグ（クリックで絞り込み） -->
      <div class="flex flex-wrap gap-1 mt-1">
        <button
          v-for="tag in pack.meta.tags"
          :key="tag"
          class="badge badge-xs cursor-pointer transition-colors"
          :class="selectedTags.includes(tag) ? 'badge-primary' : 'badge-outline'"
          @click.stop="emit('tag-click', tag)"
        >
          {{ tag }}
        </button>
      </div>

      <!-- アクションボタン -->
      <div class="card-actions justify-end mt-2 gap-1">
        <button
          class="btn btn-xs btn-secondary tooltip tooltip-bottom"
          data-tip="この設定を部分的に読み込み/マージ"
          :disabled="disabled"
          @click.stop="emit('partial-load')"
        >
          <FileText class="w-3 h-3" />
          マージ
        </button>
        <button
          class="btn btn-xs btn-primary tooltip tooltip-bottom"
          data-tip="現在のデータをこの設定で置き換える"
          :disabled="disabled"
          @click.stop="emit('replace')"
        >
          <Download class="w-3 h-3" />
          置き換え
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { DataPackEntry } from './useDataPacks'
  import { Download, FileText, Image } from 'lucide-vue-next'

  defineProps<{
    pack: DataPackEntry
    disabled?: boolean
    selectedTags: string[]
  }>()

  const emit = defineEmits<{
    replace: []
    'partial-load': []
    'tag-click': [tag: string]
  }>()

  const bannerError = ref(false)
</script>
