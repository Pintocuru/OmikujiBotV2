<!-- src/MainGenerator/ui/ToastWidgets/parts/CharacterThumbnailsPreview.vue -->
<template>
  <div
    :class="{ 'opacity-0': !isVisible && hoverVisibility }"
    class="transition-opacity duration-300"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="avatar-group -space-x-6 rtl:space-x-reverse">
      <div
        v-for="character in charactersArray"
        :key="character.id"
        class="avatar"
        :class="clickable ? 'cursor-pointer hover:scale-120' : ''"
        @click="handleClick(character, false)"
        @contextmenu.prevent="clickable && handleClick(character, true)"
      >
        <div
          :class="['w-12 h-12', 'rounded-full border border-base-100 shadow-lg']"
          :style="{ backgroundColor: character.color?.backgroundColor }"
        >
          <CharacterLayerImage :layers="getDefaultLayers(character)" :size="12" :color="character.color" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onUnmounted } from 'vue'
  import { CharacterType } from '@/types'
  import CharacterLayerImage from '@/common/LayerImage/CharacterLayerImage.vue'

  // 定数
  const HIDE_DELAY = 2000 // 2秒後に非表示にする

  const props = withDefaults(
    defineProps<{
      charactersArray: CharacterType[]
      clickable?: boolean
      hoverVisibility?: boolean
    }>(),
    {
      clickable: false,
      hoverVisibility: true, // デフォルトは常に表示
    }
  )

  const emit = defineEmits<{
    characterClick: [character: CharacterType, isRightClick: boolean]
  }>()

  const getDefaultLayers = (character: CharacterType): string[] => {
    const image = character.image
    // defaultがあればそのsrc、なければ最初に見つかった有効なsrc
    const defaultSrc = image?.['default']?.src.filter((p) => p?.trim()) ?? []
    if (defaultSrc.length > 0) return defaultSrc

    for (const item of Object.values(image ?? {})) {
      const src = item?.src.filter((p) => p?.trim()) ?? []
      if (src.length > 0) return src
    }
    return []
  }

  // 表示状態 (hoverVisibility が false の場合は常に true)
  const isVisible = ref(true)
  // 非表示タイマーID
  let hideTimer: number | undefined = undefined

  // タイマーをクリアする関数
  const clearHideTimer = () => {
    if (hideTimer !== undefined) {
      clearTimeout(hideTimer)
      hideTimer = undefined
    }
  }

  // 非表示タイマーを開始する関数
  const startHideTimer = () => {
    clearHideTimer()
    hideTimer = setTimeout(() => {
      isVisible.value = false
      hideTimer = undefined
    }, HIDE_DELAY) as unknown as number
  }

  // マウスが入ったときの処理
  const handleMouseEnter = () => {
    if (!props.hoverVisibility) return
    clearHideTimer()
    isVisible.value = true
  }

  // マウスが出たときの処理
  const handleMouseLeave = () => {
    if (!props.hoverVisibility) return
    startHideTimer()
  }

  // `hoverVisibility` の変更を監視し、表示モードを切り替える
  watch(
    () => props.hoverVisibility,
    (newVal) => {
      clearHideTimer()
      if (newVal) {
        // ホバーモード: 初期は非表示タイマーを開始
        isVisible.value = true
        startHideTimer()
      } else {
        // 通常モード: 常に表示
        isVisible.value = true
      }
    },
    { immediate: true }
  ) // アイテム初期化時にも実行

  // アイテムが破棄されるときにタイマーをクリア
  onUnmounted(() => {
    clearHideTimer()
  })

  // 従来のクリックハンドラ
  const handleClick = (character: CharacterType, isRightClick: boolean) => {
    if (props.clickable) emit('characterClick', character, isRightClick)
  }
</script>
