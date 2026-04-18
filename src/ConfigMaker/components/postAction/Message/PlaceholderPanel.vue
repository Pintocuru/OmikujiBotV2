<!-- src/ConfigMaker/components/postAction/Message/PlaceholderPanel.vue -->
<template>
  <div class="w-64 shrink-0 flex flex-col bg-base-100">
    <!-- ヘッダー -->
    <div class="px-3 py-2 bg-base-200 border-b border-base-300 shrink-0 flex items-center justify-between">
      <span class="text-xs font-semibold text-base-content">プレースホルダー</span>
      <div class="flex gap-1">
        <button class="btn btn-xs btn-ghost gap-1" title="簡易プレースホルダーを挿入" @click="emit('openInlinePh')">
          <Braces :size="12" />
          簡易
        </button>
        <button
          v-if="isPlaceholder"
          class="btn btn-xs btn-ghost gap-1"
          @click="showAddPlaceholder = !showAddPlaceholder"
        >
          <Plus :size="12" />
          追加
        </button>
      </div>
    </div>

    <!-- 新規プレースホルダー追加フォーム -->
    <div v-if="isPlaceholder && showAddPlaceholder" class="px-3 py-2 border-b border-base-300 bg-warning/10 shrink-0">
      <p class="text-xs font-semibold text-warning mb-1">新規プレースホルダー</p>
      <div class="flex gap-1">
        <input
          v-model="newPlaceholderKey"
          type="text"
          class="input input-bordered input-xs flex-1 font-mono"
          placeholder="キー名 (例: myVar)"
          @keydown.enter="createNewPlaceholder"
        />
        <button class="btn btn-xs btn-warning" :disabled="!newPlaceholderKey.trim()" @click="createNewPlaceholder">
          作成
        </button>
      </div>
    </div>

    <!-- スクロールエリア -->
    <div class="flex-1 overflow-y-auto">
      <!-- デフォルトプレースホルダー -->
      <div class="divider my-1 px-2 text-xs">デフォルト</div>
      <div class="px-2 pt-2 pb-1">
        <div class="flex flex-wrap gap-1">
          <button
            v-for="ph in defaultPlaceholderList"
            :key="ph.key"
            class="badge badge-ghost badge-sm font-mono cursor-pointer hover:badge-accent transition-colors"
            :class="{ 'badge-accent': usedKeys.has(ph.key) }"
            :title="`${ph.label} (例: ${ph.short})`"
            @click="emit('insert', ph.key)"
          >
            {{ ph.key }}
          </button>
        </div>
      </div>

      <div class="divider my-1 px-2 text-xs">ユーザー定義</div>

      <!-- isPlaceholder=false なら施錠表示 -->
      <div v-if="!isPlaceholder" class="px-3 py-4 text-center text-xs text-base-content/40">
        <Lock :size="14" class="mx-auto mb-1 opacity-50" />
        プレースホルダー機能が<br />無効です
      </div>

      <template v-else>
        <div v-if="sortedUserPlaceholders.length === 0" class="p-4 text-center text-xs text-base-content/40">
          プレースホルダーがありません
        </div>

        <div
          v-for="ph in sortedUserPlaceholders"
          :key="ph.key"
          class="border-b border-base-200 last:border-0"
          :class="{ 'bg-primary/5': usedKeys.has(ph.key) }"
        >
          <!-- ヘッダー行 -->
          <div
            class="flex items-center gap-1 px-2 py-1.5 cursor-pointer hover:bg-base-200 group"
            @click="togglePlaceholder(ph.key)"
          >
            <ChevronRight
              :size="12"
              class="text-base-content/40 transition-transform shrink-0"
              :class="{ 'rotate-90': expandedKeys.has(ph.key) }"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1">
                <span class="text-xs font-mono font-semibold truncate">{{ ph.key }}</span>
                <span v-if="usedKeys.has(ph.key)" class="badge badge-primary badge-xs shrink-0">使用中</span>
              </div>
              <p class="text-xs text-base-content/50 truncate">{{ ph.name }}</p>
            </div>
            <button
              class="btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              title="挿入"
              @click.stop="emit('insert', ph.key)"
            >
              <CornerDownLeft :size="12" />
            </button>
          </div>

          <!-- 展開: 値一覧 -->
          <div v-if="expandedKeys.has(ph.key)" class="bg-base-200/60 px-2 pb-2">
            <button class="btn btn-xs btn-primary w-full gap-1 mt-1 mb-2" @click="emit('insert', ph.key)">
              <CornerDownLeft :size="11" />
              &lt;&lt;{{ ph.key }}&gt;&gt; を挿入
            </button>

            <div class="space-y-1">
              <div
                v-for="(val, idx) in handelNormalizedValues(ph.values)"
                :key="idx"
                class="flex items-center gap-1 group"
              >
                <span class="badge badge-xs badge-ghost font-mono shrink-0">{{ val.weight }}</span>
                <input
                  type="text"
                  class="input input-xs input-bordered flex-1 font-mono text-xs"
                  :value="val.content"
                  @change="updatePlaceholderValue(ph.key, idx, $event)"
                />
                <button
                  class="btn btn-xs btn-ghost btn-circle opacity-0 group-hover:opacity-100 shrink-0"
                  @click="removePlaceholderValue(ph.key, idx)"
                >
                  <Trash2 :size="10" />
                </button>
              </div>
            </div>

            <button class="btn btn-xs btn-ghost gap-1 mt-1 w-full" @click="addPlaceholderValue(ph.key)">
              <Plus :size="10" />
              値を追加
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Plus, ChevronRight, CornerDownLeft, Trash2, Braces, Lock } from 'lucide-vue-next'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { usePlaceholderEditor } from './usePlaceholderEditor'
  import { toRef } from 'vue'
  import { handelNormalizedValues } from '@/types'

  const props = defineProps<{
    draftText: string
    isCommentMode?: boolean
  }>()

  const emit = defineEmits<{
    insert: [key: string]
    openInlinePh: []
  }>()

  const { isPlaceholder } = useVisibilityAccess()

  const {
    showAddPlaceholder,
    newPlaceholderKey,
    expandedKeys,
    defaultPlaceholderList,
    sortedUserPlaceholders,
    usedKeys,
    togglePlaceholder,
    updatePlaceholderValue,
    removePlaceholderValue,
    addPlaceholderValue,
    createNewPlaceholder,
  } = usePlaceholderEditor(toRef(props, 'draftText'), props.isCommentMode)
</script>
