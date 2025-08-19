<!-- src/configMaker/components/postAction/WordPartyField.vue -->
<template>
  <div class="flex items-center gap-2">
    <label class="w-24 text-xs flex-shrink-0">🎉 WordParty</label>
    <div class="flex gap-1 w-2/3">
      <div class="tabs tabs-boxed tabs-sm">
        <button @click="setInputMode('select')" class="tab tab-sm" :class="{ 'tab-active': inputMode === 'select' }">
          選択
        </button>
        <button @click="setInputMode('manual')" class="tab tab-sm" :class="{ 'tab-active': inputMode === 'manual' }">
          手動
        </button>
      </div>

      <select v-if="inputMode === 'select'" v-model="wordParty" class="select select-bordered select-sm flex-1">
        <option value="">選択してください</option>
        <option v-for="setting in wordPartySetting" :key="setting.pattern" :value="setting.pattern">
          {{ setting.name }} ({{ setting.pattern }})
        </option>
      </select>

      <input
        v-if="inputMode === 'manual'"
        type="text"
        v-model="wordParty"
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
    action: PostActionType
    index: number
  }>()

  // emitsを定義
  const emit = defineEmits(['update:action'])

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 表示設定の参照
  const wordPartySetting = computed(() => data.value.wordPartySettings)

  // 入力モード管理
  const inputMode = ref<'select' | 'manual'>('select')

  // propsのwordPartyをget/setで扱うcomputedプロパティ
  const wordParty = computed({
    get: () => props.action.wordParty,
    set: (value) => {
      emit('update:action', { ...props.action, wordParty: value })
    },
  })

  // 初期化：既存の値がsettingに含まれているかチェック
  const initializeInputMode = () => {
    const isSelectMode = wordPartySetting.value.some((setting) => setting.pattern === props.action.wordParty)
    inputMode.value = isSelectMode ? 'select' : 'manual'
  }

  // コンポーネント初期化時に実行
  initializeInputMode()

  // actionが変更された際の監視
  watch(() => props.action.wordParty, initializeInputMode)

  // 入力モード切り替え
  const setInputMode = (mode: 'select' | 'manual') => {
    inputMode.value = mode
    if (mode === 'select') {
      // 親コンポーネントに空の値をemit
      emit('update:action', { ...props.action, wordParty: '' })
    }
  }
</script>
