<!-- src/components/common/MotionWrapper.vue -->
<template>
  <div>
    <Transition :css="false" @leave="onLeave">
      <div
        v-if="visible"
        ref="motionElement"
        v-motion="motionKey"
        :initial="enterVariant.initial"
        :enter="enterVariant.enter"
        :leave="leaveVariant.leave"
        v-bind="$attrs"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
  import { useMotion } from '@vueuse/motion'
  import { MotionType, motionVariants } from './MotionVariants'

  // Props定義
  interface Props {
    visible?: boolean
    enterMotion?: MotionType
    leaveMotion?: MotionType
    motionKey?: string
    autoHide?: boolean
    hideDelay?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: true,
    enterMotion: 'slideUp',
    leaveMotion: 'slideUp',
    motionKey: 'motion',
    autoHide: false,
    hideDelay: 3000,
  })

  // Emits定義
  const emit = defineEmits<{
    'update:visible': [value: boolean]
    'enter-start': []
    'enter-complete': []
    'leave-start': []
    'leave-complete': []
  }>()

  // アニメーション設定の算出
  const enterVariant = computed(() => motionVariants[props.enterMotion])
  const leaveVariant = computed(() => motionVariants[props.leaveMotion])

  // 要素の参照
  const motionElement = ref<HTMLElement>()

  // Motion Instanceの管理
  let motionInstance: ReturnType<typeof useMotion> | null = null
  let autoHideTimer: number | null = null

  // Motion Instanceを初期化する関数
  const initializeMotion = () => {
    if (motionElement.value) {
      /**
       * 型 'MotionInstance<string, { initial: Variant | undefined; enter: Variant | undefined; leave: Variant | undefined; }>' を型 'MotionInstance<string, MotionVariants<string>>' に割り当てることはできません。
  プロパティ 'apply' の型に互換性がありません。
    型 '(variant: Variant | "initial" | "leave" | "enter") => Promise<void[]> | undefined' を型 '(variant: string | Variant) => Promise<void[]> | undefined' に割り当てることはできません。
      パラメーター 'variant' および 'variant' は型に互換性がありません。
        型 'string | Variant' を型 'Variant | "initial" | "leave" | "enter"' に割り当てることはできません。
          型 'string' を型 'Variant | "initial" | "leave" | "enter"' に割り当てることはできません。ts-plugin(2322)
let motionInstance: MotionInstance<string, MotionVariants<string>> | null
       */
      // @ts-ignore
      motionInstance = useMotion(motionElement.value, {
        initial: enterVariant.value.initial,
        enter: enterVariant.value.enter,
        leave: leaveVariant.value.leave,
      })
    }
  }

  // 自動非表示のタイマーを設定
  const setAutoHideTimer = () => {
    if (props.autoHide && props.visible) {
      clearAutoHideTimer()
      autoHideTimer = window.setTimeout(() => {
        hide()
      }, props.hideDelay)
    }
  }

  // 自動非表示のタイマーをクリア
  const clearAutoHideTimer = () => {
    if (autoHideTimer) {
      clearTimeout(autoHideTimer)
      autoHideTimer = null
    }
  }

  // Transitionのleaveイベントハンドラー
  const onLeave = async (el: Element, done: () => void) => {
    emit('leave-start')
    try {
      if (motionInstance?.apply) {
        await motionInstance.apply('leave')
      }
      emit('leave-complete')
      done()
    } catch (error) {
      console.warn('Leave animation failed:', error)
      emit('leave-complete')
      done()
    }
  }

  // 外部から呼び出し可能な関数群
  const show = async () => {
    emit('update:visible', true)
    await nextTick()
    initializeMotion()
    emit('enter-start')

    // enterアニメーション完了を待つ
    try {
      if (motionInstance?.apply) {
        await motionInstance.apply('enter')
      }
      emit('enter-complete')
      setAutoHideTimer()
    } catch (error) {
      console.warn('Enter animation failed:', error)
      emit('enter-complete')
      setAutoHideTimer()
    }
  }

  const hide = async () => {
    if (props.visible && motionInstance?.apply) {
      clearAutoHideTimer()
      emit('leave-start')
      try {
        await motionInstance.apply('leave')
        emit('update:visible', false)
        emit('leave-complete')
      } catch (error) {
        console.warn('Hide animation failed:', error)
        emit('update:visible', false)
        emit('leave-complete')
      }
    }
  }

  const toggle = async () => {
    if (props.visible) {
      await hide()
    } else {
      await show()
    }
  }

  const reload = async () => {
    if (props.visible) {
      emit('update:visible', false)
      await nextTick()
      await show()
    } else {
      emit('update:visible', true)
    }
  }

  // アニメーション設定の変更を監視
  watch([() => props.enterMotion, () => props.leaveMotion], async () => {
    if (props.visible) {
      emit('update:visible', false)
      await nextTick()
      await show()
    }
  })

  // visibleの変更を監視
  watch(
    () => props.visible,
    async (newVisible) => {
      if (newVisible) {
        await nextTick()
        initializeMotion()
        setAutoHideTimer()
      } else {
        clearAutoHideTimer()
      }
    }
  )

  // コンポーネントマウント時の初期化
  onMounted(() => {
    if (props.visible) {
      nextTick(() => {
        initializeMotion()
        setAutoHideTimer()
      })
    }
  })

  // コンポーネント破棄時のクリーンアップ
  onBeforeUnmount(() => {
    clearAutoHideTimer()
  })

  // 外部から呼び出し可能な関数を公開
  defineExpose({
    show,
    hide,
    toggle,
    reload,
  })
</script>
