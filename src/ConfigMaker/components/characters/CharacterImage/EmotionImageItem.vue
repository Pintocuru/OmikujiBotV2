<!-- src/ConfigMaker/components/characters/CharacterImage/EmotionImageItem.vue -->
<template>
  <div class="space-y-3">
    <!-- ヘッダー：表示名・キー・警告・削除 -->
    <div class="flex items-center gap-2">
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <label class="text-xs text-base-content/60 shrink-0">表示名</label>
          <input
            type="text"
            class="input input-xs flex-1"
            :placeholder="emotionKey"
            v-model="localName"
            @blur="handleNameBlur"
          />
        </div>
        <div class="text-xs text-base-content/40 mt-0.5">key: {{ emotionKey }}</div>
      </div>

      <div v-if="emotionKey === 'default' && !isDefaultFilled" class="badge badge-warning badge-sm">未設定</div>

      <button type="button" class="btn btn-error btn-xs" @click="emit('remove', emotionKey)" title="この感情を削除">
        <Trash2 class="w-3 h-3" />
      </button>

      <button
        type="button"
        class="btn btn-ghost btn-xs"
        @click="emit('reset', emotionKey)"
        title="デフォルトパスをセット"
      >
        <RotateCcw class="w-3 h-3" />
      </button>
    </div>

    <!-- 2カラムグリッド -->
    <div class="grid grid-cols-2 gap-4">
      <!-- 左：レイヤー編集 -->
      <div class="space-y-2">
        <div class="text-xs font-medium text-base-content/70 mb-1">画像レイヤー</div>

        <button type="button" class="btn btn-xs btn-primary w-full" @click="handleAddLayer">
          <Plus class="w-3 h-3 mr-1" />レイヤーを追加
        </button>

        <div v-for="(layer, index) in layers" :key="index" class="border rounded p-2 bg-base-200 space-y-1">
          <div class="flex items-center gap-1">
            <span class="badge badge-xs">{{ index + 1 }}</span>
            <div class="flex-1" />
            <button type="button" class="btn btn-ghost btn-xs" @click="handleMoveUp(index)" :disabled="index === 0">
              <ChevronUp class="w-3 h-3" />
            </button>
            <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="handleMoveDown(index)"
              :disabled="index === layers.length - 1"
            >
              <ChevronDown class="w-3 h-3" />
            </button>
            <button type="button" class="btn btn-error btn-xs" @click="handleRemoveLayer(index)">
              <X class="w-3 h-3" />
            </button>
          </div>

          <input
            type="url"
            class="input input-xs w-full"
            :placeholder="`レイヤー${index + 1}の画像URL`"
            :value="layer"
            @input="handleLayerUpdate(index, ($event.target as HTMLInputElement).value)"
          />
          <ImagePreview :layers="layer" :size="16" />
        </div>

        <!-- 合成プレビュー -->
        <template v-if="layers.length > 1">
          <div class="text-xs text-base-content/60">合成プレビュー</div>
          <ImagePreview :layers="layers" :size="24" />
        </template>
      </div>

      <!-- 右：アニメーション設定 -->
      <div class="space-y-3">
        <div class="text-xs font-medium text-base-content/70 mb-1">アニメーション</div>

        <!-- プレビュー -->
        <div class="flex justify-center bg-base-200 rounded p-3">
          <LayerImage
            :key="`${emotionKey}-${localAnimation.type}-${localAnimation.duration}-${localAnimation.loop}`"
            :layers="layers"
            :size="24"
            :animation="localAnimation.type !== 'none' ? localAnimation : undefined"
          />
        </div>

        <!-- タイプ選択 -->
        <div class="space-y-1">
          <label class="text-xs text-base-content/60">動作タイプ</label>
          <select class="select select-xs w-full" v-model="localAnimation.type">
            <option v-for="(label, key) in loopMotionMap" :key="key" :value="key">
              {{ label }}
            </option>
          </select>
        </div>

        <template v-if="localAnimation.type !== 'none'">
          <!-- duration -->
          <div class="space-y-1">
            <div class="flex justify-between">
              <label class="text-xs text-base-content/60">速度（秒）</label>
              <span class="text-xs font-mono">{{ localAnimation.duration }}s</span>
            </div>
            <input
              type="range"
              class="range range-xs range-primary"
              min="0.3"
              max="5"
              step="0.1"
              v-model.number="localAnimation.duration"
            />
            <div class="flex justify-between text-xs text-base-content/40"><span>速い</span><span>遅い</span></div>
          </div>

          <!-- loop -->
          <div class="flex items-center gap-2">
            <input type="checkbox" class="toggle toggle-xs toggle-primary" v-model="localAnimation.loop" />
            <label class="text-xs text-base-content/60">
              {{ localAnimation.loop ? 'ループ再生' : '1回のみ再生' }}
            </label>
          </div>
        </template>

        <div v-else class="text-xs text-base-content/30 text-center py-4">アニメーションなし</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { Plus, ChevronUp, ChevronDown, X, Trash2, RotateCcw } from 'lucide-vue-next'
  import ImagePreview from '@/common/LayerImage/ImagePreview.vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { loopMotionMap } from '@/types/MetaMaps/enterMotionMaps'
  import type { CharacterAnimationType } from '@/types/'

  const props = defineProps<{
    emotionKey: string
    emotionLabel: string
    emotionName?: string
    currentValue: string[]
    currentAnimation?: CharacterAnimationType
    selectedItemKey: string | null
    isDefaultFilled: boolean
  }>()

  const emit = defineEmits<{
    update: [key: string, value: string[]]
    'update-name': [key: string, name: string]
    'update-animation': [key: string, animation: CharacterAnimationType | undefined]
    reset: [key: string]
    remove: [key: string]
  }>()

  // ── 表示名 ──────────────────────────────
  const localName = ref(props.emotionName ?? '')
  watch(
    () => props.emotionName,
    (val) => {
      localName.value = val ?? ''
    }
  )
  const handleNameBlur = () => emit('update-name', props.emotionKey, localName.value)

  // ── レイヤー ─────────────────────────────
  const layers = computed(() => (Array.isArray(props.currentValue) ? props.currentValue : []))

  const handleLayerUpdate = (index: number, value: string) => {
    const n = [...layers.value]
    n[index] = value
    emit('update', props.emotionKey, n)
  }
  const handleAddLayer = () => emit('update', props.emotionKey, [...layers.value, ''])
  const handleRemoveLayer = (index: number) =>
    emit(
      'update',
      props.emotionKey,
      layers.value.filter((_, i) => i !== index)
    )
  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const n = [...layers.value]
    ;[n[index - 1], n[index]] = [n[index], n[index - 1]]
    emit('update', props.emotionKey, n)
  }
  const handleMoveDown = (index: number) => {
    if (index === layers.value.length - 1) return
    const n = [...layers.value]
    ;[n[index], n[index + 1]] = [n[index + 1], n[index]]
    emit('update', props.emotionKey, n)
  }

  // ── アニメーション ────────────────────────
  const localAnimation = ref<CharacterAnimationType>({
    type: props.currentAnimation?.type ?? 'none',
    duration: props.currentAnimation?.duration ?? 1.5,
    loop: props.currentAnimation?.loop ?? true,
  })

  watch(
    () => props.currentAnimation,
    (val) => {
      localAnimation.value = {
        type: val?.type ?? 'none',
        duration: val?.duration ?? 1.5,
        loop: val?.loop ?? true,
      }
    }
  )

  // typeがnoneになったらanimationをundefinedとしてemit
  watch(
    localAnimation,
    (val) => {
      emit('update-animation', props.emotionKey, val.type === 'none' ? undefined : { ...val })
    },
    { deep: true }
  )
</script>
