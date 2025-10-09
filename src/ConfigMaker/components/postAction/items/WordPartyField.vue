<!-- src\ConfigMaker\components\postAction\items\WordPartyField.vue -->
<template>
  <div class="flex items-center gap-2">
    <div class="flex gap-1 w-full">
      <div class="tabs tabs-boxed tabs-sm">
        <button @click="setInputMode('select')" class="tab tab-sm" :class="{ 'tab-active': inputMode === 'select' }">
          選択
        </button>
        <button @click="setInputMode('manual')" class="tab tab-sm" :class="{ 'tab-active': inputMode === 'manual' }">
          手動
        </button>
      </div>

      <select v-if="inputMode === 'select'" v-model="wordPartyModel" class="select select-bordered select-sm flex-1">
        <option value="">選択してください</option>
        <option v-for="setting in wordPartySetting" :key="setting.pattern" :value="setting.pattern">
          {{ setting.name }} ({{ setting.pattern }})
        </option>
      </select>

      <input
        v-if="inputMode === 'manual'"
        type="text"
        v-model="wordPartyModel"
        class="input input-bordered input-sm flex-1"
        placeholder="WordParty"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  // Props
  const props = defineProps<{
    wordParty: string
    action: PostActionType
    index: number
  }>()

  // v-modelのemitsを定義
  const emit = defineEmits<{
    'update:wordParty': [value: string]
  }>()

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 表示設定の参照
  const wordPartySetting = computed(() => data.value.wordPartySettings)

  // 入力モード管理
  const inputMode = ref<'select' | 'manual'>('select')

  // v-model用のcomputedプロパティ
  const wordPartyModel = computed({
    get: () => props.wordParty,
    set: (value) => emit('update:wordParty', value),
  })

  // 初期化：既存の値がsettingに含まれているかチェック
  const initializeInputMode = () => {
    const isSelectMode = wordPartySetting.value.some((setting) => setting.pattern === props.wordParty)
    inputMode.value = isSelectMode ? 'select' : 'manual'
  }

  // コンポーネント初期化時に実行
  initializeInputMode()

  // wordPartyが変更された際の監視
  watch(() => props.wordParty, initializeInputMode)

  // 入力モード切り替え
  const setInputMode = (mode: 'select' | 'manual') => {
    inputMode.value = mode
  }
</script>
