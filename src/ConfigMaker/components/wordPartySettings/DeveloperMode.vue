<!-- src/configMaker/components/wordPartySettings/DeveloperMode.vue -->
<template>
  <div v-if="!agreed">
    <!-- 読み込み機能同意確認 -->
    <InformationCard>
      <h4 class="font-semibold">⚠️ 読み込み機能について</h4>
      <p class="text-sm mt-2">
        この機能はWordPartyのconfig.jsファイルを読み込みます。<br />
        JavaScriptコードを実行するため、信頼できるファイルのみを使用してください。<br />
        悪意のあるコードが含まれている可能性があります。
      </p>
    </InformationCard>
    <div class="flex justify-center pt-4">
      <button @click="$emit('agree')" class="btn btn-success">理解して読み込み機能を有効にする</button>
    </div>
  </div>

  <div v-else>
    <div class="mb-4">
      <input type="file" accept=".js" @change="handleFile" class="file-input file-input-bordered w-full" />
    </div>

    <!-- 読み込みステータス -->
    <div v-if="loadStatus" class="mb-4">
      <div :class="['alert', loadStatus.type === 'success' ? 'alert-success' : 'alert-error']">
        {{ loadStatus.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import InformationCard from '@ConfigComponents/parts/InformationCard.vue'

  defineProps<{
    agreed: boolean
    loadStatus: { type: 'success' | 'error'; message: string } | null
  }>()

  const emit = defineEmits<{
    agree: []
    load: [content: string]
  }>()

  // ファイル読み込み処理
  function handleFile(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result as string
      emit('load', content)
    }

    reader.readAsText(file)
  }
</script>
