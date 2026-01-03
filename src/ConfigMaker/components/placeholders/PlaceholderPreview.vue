<!-- src/configMaker/components/placeholders/PlaceholderPreview.vue -->
<template>
  <div class="tooltip tooltip-bottom" data-tip="わんコメを起動すると、投稿の確認ができます">
    <button @click="handleDraw" class="btn btn-info" :disabled="!values.length">
      <Dices class="w-4 h-4" />
      抽選テスト
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { handelNormalizedValues, PlaceholderValueType } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { drawOmikuji, addWeightPercentages } from '@shared/utils/omikuji/DrawOmikuji'
  import { postSpeech } from '@shared/sdk/postMessage/PostOneComme'
  import Swal from 'sweetalert2'
  import { Dices } from 'lucide-vue-next'
  import { processTestPlaceholder } from '../postAction/preview/TestPlaceholderProcessor'

  const props = defineProps<{
    values: (PlaceholderValueType | string)[]
  }>()

  const placeholdersMap = computed(() => useOmikujiStore().getCategoryMap('placeholders'))

  // 抽選実行
  const draw = () => {
    const normalized = handelNormalizedValues(props.values)
    const weighted = addWeightPercentages(normalized)
    return drawOmikuji(weighted)
  }

  // 結果表示
  const showResult = (drawn: PlaceholderValueType, message: string) => {
    const { weight = 1, weightPercent = 0 } = drawn as any

    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: '抽選結果',
      html: `内容:<br>${message}<br>重み: ${weight}<br>確率: ${weightPercent.toFixed(2)}%`,
      showConfirmButton: false,
      timer: 15000,
      timerProgressBar: true,
    })
  }

  const showError = () => {
    Swal.fire({
      icon: 'error',
      title: '抽選結果',
      text: '抽選できませんでした',
    })
  }

  // メイン処理
  const handleDraw = () => {
    const result = draw()
    if (!result?.content) return showError()

    const message = processTestPlaceholder(result.content, placeholdersMap.value)
    showResult(result, message)
    postSpeech(message)
  }
</script>
