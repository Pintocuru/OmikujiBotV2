<!-- src/configMaker/components/characters/CharacterImageSettings.vue -->
<template>
  <!-- 補足説明 -->
  <InformationCard>
    <p>
      画像ファイルは事前に
      <code class="label bg-accent text-accent-content"> Characters/[キャラクターID] </code>
      フォルダ内に配置してください。
    </p>
    <p>
      ファイル名は固定で、例：
      <code class="label bg-accent text-accent-content">default.png</code>、
      <code class="label bg-accent text-accent-content">happy.png</code>、
      <code class="label bg-accent text-accent-content">laughing.png</code>
      など12種類です（png/jpg/jpeg/gif/webp対応）。
    </p>
    <p>
      各項目の
      <button class="btn btn-ghost btn-xs px-1 py-0 h-auto min-h-0 text-xs" title="クリックでデフォルトパスを設定">
        <RotateCcw class="w-3 h-3 mr-1" />
        リセット
      </button>
      ボタンをクリックすると、
      <code class="label bg-accent text-accent-content"> [キャラクターID]/[感情名].png, gif, webp...</code
      >といった画像の拡張子が順に切り替わります。目的の拡張子になるまでクリックしてください。
    </p>
  </InformationCard>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
    <div v-for="(emotion, key) in emotionLabels" :key="key" class="form-control">
      <SettingItem :label="emotion" :description="`(${key})`" :showReset="true" @reset="resetImagePath(key)">
        <input
          type="url"
          class="input input-sm w-full"
          :placeholder="`${emotion}の画像URL`"
          :value="currentImages[key] || ''"
          @input="updateImagePath(key, ($event.target as HTMLInputElement).value)"
        />

        <!-- プレビュー表示 -->
        <img
          v-if="currentImages[key]"
          :src="getImagePath(currentImages[key])"
          :alt="`${emotion}の画像プレビュー`"
          class="avatar max-h-16 rounded border"
          loading="lazy"
        />
      </SettingItem>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { CharacterEmotionType, CharacterType, emotionLabels, getImagePath } from '@/types/'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { RotateCcw } from 'lucide-vue-next'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

  const props = defineProps<{
    modelValue: CharacterType['image']
    selectedRuleId: string | null
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: CharacterType['image']]
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // 現在の画像設定を取得
  const currentImages = computed(() => props.modelValue ?? {})

  // 画像パスを更新する関数
  const updateImagePath = (key: CharacterEmotionType, value: string) => {
    if (!props.selectedRuleId) return

    const newImages = { ...currentImages.value, [key]: value }

    // storeを使って更新
    omikujiStore.updateRecordProperty('characters', props.selectedRuleId, 'image', newImages)
  }

  // 拡張子のリスト（検索順序）
  const imageExtensions = ['png', 'gif', 'webp', 'jpg', 'jpeg', 'svg']

  // 各感情ごとに現在の拡張子を保持するMap
  const currentExtensions = ref<Map<CharacterEmotionType, number>>(new Map())

  // 画像パスのリセット（トグル機能付き）
  const resetImagePath = (key: CharacterEmotionType) => {
    if (!props.selectedRuleId) return

    // 現在の拡張子のインデックスを取得
    const currentIndex = currentExtensions.value.get(key) || 0

    // 次の拡張子のインデックスを計算（リストの最後なら最初に戻る）
    const nextIndex = (currentIndex + 1) % imageExtensions.length
    currentExtensions.value.set(key, nextIndex)

    // 新しいパスを設定
    const nextExt = imageExtensions[currentIndex]
    const newPath = `${props.selectedRuleId}/${key}.${nextExt}`

    // storeを使って更新
    const newImages = { ...currentImages.value, [key]: newPath }
    omikujiStore.updateRecordProperty('characters', props.selectedRuleId, 'image', newImages)
  }
</script>
