<!-- src/ConfigMaker/components/JsonMerge/JsonMergeRemapEditor.vue -->
<template>
  <div class="border-l-4 border-primary pl-4 py-2 mb-3 bg-base-200 rounded">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium">リマップ {{ remapIndex + 1 }}</span>
      <button @click="removeRemap" class="btn btn-xs btn-ghost" title="このリマップを削除">✕</button>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <!-- 元キャラキー -->
      <SettingItem label="元キャラキー">
        <select v-model="localRemap.fromCharacterKey" class="select select-sm select-bordered w-full">
          <option value="omiken">omiken</option>
          <option value="omiken2">omiken2</option>
        </select>
      </SettingItem>

      <!-- 新キャラキー -->
      <SettingItem label="新キャラキー">
        <select v-model="localRemap.toCharacterKey" class="select select-sm select-bordered w-full">
          <option value="">キャラクターを選択してください</option>
          <option v-for="(char, key) in characters" :key="key" :value="key">
            {{ char.displayName || key }}
          </option>
        </select>
        <p v-if="!localRemap.toCharacterKey" class="text-red-500 mt-2">入力されてません</p>
      </SettingItem>

      <!-- 元アイコンキー -->
      <SettingItem label="元アイコンキー">
        <select v-model="localRemap.fromIconKey" class="select select-sm select-bordered w-full">
          <option value="">アイコンキーを選択…</option>
          <option v-for="(emotion, key) in characterEmotionMap" :key="key" :value="key">
            {{ emotion }}
          </option>
        </select>
      </SettingItem>

      <!-- 新アイコンキー -->
      <SettingItem label="新アイコンキー">
        <select v-model="localRemap.toIconKey" class="select select-sm select-bordered w-full">
          <option value="">アイコンキーを選択…</option>
          <option v-for="(emotion, key) in characterEmotionMap" :key="key" :value="key">
            {{ emotion }}
          </option>
        </select>
      </SettingItem>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { JsonMergeRemapType } from '@/types/OmikujiData/JsonMergeType'
  import { CharacterType, characterEmotionMap } from '@/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'

  const props = defineProps<{
    mergeIndex: number
    remapIndex: number
    characters: Record<string, CharacterType>
  }>()

  const store = useOmikujiStore()
  const { data } = storeToRefs(store)

  // 現在のリマップデータ
  const currentRemap = computed(
    () =>
      data.value.jsonMerge?.[props.mergeIndex]?.remaps?.[props.remapIndex] ?? {
        fromCharacterKey: '',
        toCharacterKey: '',
        fromIconKey: '',
        toIconKey: '',
      }
  )

  // v-modelで使用するローカルリマップ
  const localRemap = computed({
    get: () => currentRemap.value,
    set: (newValue: JsonMergeRemapType) => {
      if (!data.value.jsonMerge) return

      const updatedMerge = data.value.jsonMerge.map((merge, idx) => {
        if (idx !== props.mergeIndex) return merge

        return {
          ...merge,
          remaps: merge.remaps.map((remap, remapIdx) => (remapIdx === props.remapIndex ? newValue : remap)),
        }
      })

      store.updateJsonMerge(updatedMerge)
    },
  })

  // リマップを削除
  const removeRemap = () => {
    if (!data.value.jsonMerge) return

    const updatedMerge = data.value.jsonMerge.map((merge, idx) => {
      if (idx !== props.mergeIndex) return merge

      return {
        ...merge,
        remaps: merge.remaps.filter((_, remapIdx) => remapIdx !== props.remapIndex),
      }
    })

    store.updateJsonMerge(updatedMerge)
  }
</script>
