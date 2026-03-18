<!-- src/ConfigMaker/components/dataPacks/DataPackCard.vue -->
<template>
  <div class="card card-compact bg-base-200 border border-base-300 transition-colors">
    <!-- バナー画像 -->
    <figure class="h-28 overflow-hidden bg-base-300">
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
      <h3 class="card-title text-sm font-semibold truncate">{{ pack.meta.name }}</h3>

      <!-- 説明 -->
      <p v-if="pack.meta.description" class="text-xs text-base-content/60 line-clamp-2">
        {{ pack.meta.description }}
      </p>

      <!-- メタ情報 -->
      <div class="flex flex-wrap gap-1 mt-1">
        <span v-if="pack.meta.author" class="badge badge-ghost badge-xs">
          {{ pack.meta.author }}
        </span>
        <span class="badge badge-ghost badge-xs">v{{ pack.meta.version }}</span>
        <span v-for="tag in pack.meta.tags.slice(0, 3)" :key="tag" class="badge badge-outline badge-xs">
          {{ tag }}
        </span>
      </div>

      <!-- ライセンス -->
      <p class="text-xs text-base-content/40 mt-1">{{ pack.meta.license }}</p>

      <!-- アクションボタン -->
      <div class="card-actions justify-end mt-2 gap-1">
        <!-- 部分読み込み -->
        <button
          class="btn btn-xs btn-secondary tooltip tooltip-bottom"
          data-tip="この設定を部分的に読み込み/マージ"
          :disabled="disabled"
          @click.stop="emit('partial-load')"
        >
          <FileText class="w-3 h-3" />
          マージ
        </button>

        <!-- 置き換え -->
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
  }>()

  const emit = defineEmits<{
    replace: []
    'partial-load': []
  }>()

  const bannerError = ref(false)
</script>
