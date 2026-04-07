<!-- src/ConfigMaker/components/characters/CharacterImage/EmotionAnimationEditor.vue -->
<template>
  <div class="space-y-3">
    <div class="text-xs font-medium text-base-content/70 mb-1">アニメーション・プレビュー</div>

    <!-- プレビュー -->
    <div class="flex justify-center bg-base-200 rounded p-3">
      <ImagePreview :key="previewKey" :layers="src" :size="24" :animation="animation" />
    </div>

    <!-- タイプ選択 -->
    <div class="space-y-1">
      <label class="text-xs text-base-content/60">動作タイプ</label>
      <select class="select select-xs w-full" v-model="localAnimation.type" @change="applyAnimation">
        <option v-for="(value, key) in loopMotionMap" :key="key" :value="key">
          {{ value.label }}
        </option>
      </select>
    </div>

    <template v-if="localAnimation.type !== 'none'">
      <div class="space-y-1">
        <div class="flex justify-between">
          <label class="text-xs text-base-content/60">速度（秒）</label>
          <span class="text-xs font-mono">{{ localAnimation.duration }}s</span>
        </div>
        <input
          type="range"
          class="range range-xs range-primary"
          min="0.4"
          max="5"
          step="0.2"
          v-model.number="localAnimation.duration"
        />
        <div class="flex justify-between text-xs text-base-content/40"><span>速い</span><span>遅い</span></div>
      </div>

      <div class="flex items-center gap-2">
        <input type="checkbox" class="toggle toggle-xs toggle-primary" v-model="localAnimation.loop" />
        <label class="text-xs text-base-content/60">
          {{ localAnimation.loop ? 'ループ再生' : '1回のみ再生' }}
        </label>
      </div>
    </template>

    <div v-else class="text-xs text-base-content/30 text-center py-4">アニメーションなし</div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed, watchEffect } from 'vue'
  import type { CharacterAnimationType } from '@/types/'
  import ImagePreview from '@/common/LayerImage/ImagePreview.vue'
  import { loopMotionMap } from '@/types/MetaMaps/loopMotionMaps'

  const props = defineProps<{
    /** どの感情のアニメーションか（変化時に local state をリセットするために使用） */
    emotionKey: string
    src: string[]
    animation: CharacterAnimationType | undefined
  }>()

  const emit = defineEmits<{
    'update:animation': [animation: CharacterAnimationType | undefined]
  }>()

  const localAnimation = ref<CharacterAnimationType>({
    type: props.animation?.type ?? 'none',
    duration: props.animation?.duration ?? 1.5,
    loop: props.animation?.loop ?? true,
  })

  const applyAnimation = () => {
    emit('update:animation', localAnimation.value.type === 'none' ? undefined : { ...localAnimation.value })
  }

  const initializedKey = ref<string | null>(null)

  watchEffect(() => {
    if (props.emotionKey && initializedKey.value !== props.emotionKey) {
      localAnimation.value = {
        type: props.animation?.type ?? 'none',
        duration: props.animation?.duration ?? 1.5,
        loop: props.animation?.loop ?? true,
      }
      initializedKey.value = props.emotionKey
    }
  })

  watch(
    localAnimation,
    (val) => {
      emit('update:animation', val.type === 'none' ? undefined : { ...val })
    },
    { deep: true }
  )

  /** プレビュー用の key: 感情・type・duration・loop が変わったら再マウント */
  const previewKey = computed(
    () =>
      `${props.emotionKey}-${localAnimation.value.type}-${localAnimation.value.duration}-${localAnimation.value.loop}`
  )
</script>
