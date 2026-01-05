<!-- src\ConfigMaker\components\characters\CharacterBase64Settings.vue -->
<template>
  <!-- Base64画像設定エリア -->
  <SettingItem
    label="わんコメ表示用画像"
    :description="`${imageSize}×${imageSize}にリサイズし、Base64として保存されます`"
    containerClass="form-control flex-row items-center gap-2 mt-2"
  >
    <div class="flex flex-col sm:flex-row gap-4 items-start">
      <input
        ref="fileInput"
        type="file"
        class="file-input file-input-bordered file-input-primary w-full"
        accept="image/*"
        @change="handleImageSelect"
      />
      <div class="pr-4">
        <div v-if="localData && localData.displayOption.imageBase64" class="relative">
          <img
            :src="localData?.displayOption.imageBase64"
            alt="Base64画像プレビュー"
            :class="`w-${Math.max(16, imageSize)} h-${Math.max(16, imageSize)} rounded border-2 border-primary bg-white object-cover`"
          />
          <button
            class="btn btn-xs btn-circle btn-error absolute -top-1 -right-1"
            @click="resetBase64Image"
            title="Base64画像をリセット"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
        <div
          v-else
          :class="`w-${Math.max(16, imageSize)} h-${Math.max(16, imageSize)} rounded border-2 border-dashed border-base-300 flex items-center justify-center bg-base-200`"
        >
          <ImageIcon class="w-6 h-6 text-base-content/30" />
        </div>
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { CharacterType } from '@/types/OmikujiData/'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { X, ImageIcon } from 'lucide-vue-next'
  import { useGetRecordData } from '@config/stores/useGetRecordData'

  const props = defineProps<{
    selectedItemKey: string | null
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value?: string]
  }>()

  // Pinia store
  const { updateItem } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  const localData = computed<CharacterType | undefined>({
    get: () => {
      if (!props.selectedItemKey) return
      return getItem('characters', props.selectedItemKey) ?? undefined
    },

    set: (value?: CharacterType) => {
      if (!props.selectedItemKey || !value) return
      updateItem('characters', props.selectedItemKey, value)
    },
  })

  // 画像サイズの設定 16 / 24 / 32
  const imageSize = 24

  // ファイル入力の参照
  const fileInput = ref<HTMLInputElement>()

  // Base64画像のリセット
  const resetBase64Image = () => {
    if (!localData.value) return
    localData.value.imageBase64 = undefined
    if (fileInput.value) fileInput.value.value = ''
  }

  // 画像ファイル選択時の処理
  const handleImageSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) resizeImageToBase64(file)
  }

  // 画像を指定サイズにリサイズしてBase64に変換
  const resizeImageToBase64 = (file: File) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        if (!localData.value) return
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) return

        const size = imageSize
        canvas.width = size
        canvas.height = size

        // 白背景を描画（透明部分対策）
        ctx.fillStyle = localData.value.color.backgroundColor || '#ccc'
        ctx.fillRect(0, 0, size, size)

        // 画像を指定サイズにリサイズして描画
        ctx.drawImage(img, 0, 0, size, size)

        // Base64データを取得
        const base64Data = canvas.toDataURL('image/png')
        localData.value.displayOption.imageBase64 = base64Data
      }

      img.src = e.target?.result as string
    }

    reader.readAsDataURL(file)
  }
</script>
