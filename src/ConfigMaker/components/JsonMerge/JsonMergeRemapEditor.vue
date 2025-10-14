<!-- src/configMaker/components/characters/JsonMergeRemapTypeEditor.vue -->
<template>
  <div class="border-l-4 border-primary pl-4 py-2 mb-3 bg-base-200 rounded">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium">リマップ {{ remapIndex + 1 }}</span>
      <button @click="removeRemap" class="btn btn-xs btn-ghost" title="このリマップを削除">✕</button>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <!-- 元キャラキー（入力） -->
      <SettingItem label="元キャラキー">
        <input
          type="text"
          :value="modelValue.fromCharacterKey"
          @input="updateField('fromCharacterKey', ($event.target as HTMLInputElement).value)"
          class="input input-sm input-bordered w-full"
          placeholder="old_character"
        />
      </SettingItem>

      <!-- 新キャラキー（選択） -->
      <SettingItem label="新キャラキー">
        <select
          :value="modelValue.toCharacterKey"
          @change="updateField('toCharacterKey', ($event.target as HTMLInputElement).value)"
          class="select select-sm select-bordered w-full"
        >
          <option value="">キャラクターを選択してください</option>
          <option v-for="(char, key) in characters" :key="key" :value="key">
            {{ char.displayName || key }}
          </option>
        </select>
      </SettingItem>

      <!-- 元アイコンキー（入力） -->
      <SettingItem label="元アイコンキー">
        <select
          :value="modelValue.fromIconKey"
          @change="updateField('fromIconKey', ($event.target as HTMLInputElement).value)"
          class="select select-sm select-bordered w-full"
        >
          <option value="">感情を選択してください</option>
          <option v-for="emotion in emotionOptions" :key="emotion" :value="emotion">
            {{ emotionLabels[emotion] }}
          </option>
        </select>
      </SettingItem>

      <!-- 新アイコンキー（選択） -->
      <SettingItem label="新アイコンキー">
        <select
          :value="modelValue.toIconKey"
          @change="updateField('toIconKey', ($event.target as HTMLInputElement).value)"
          class="select select-sm select-bordered w-full"
        >
          <option value="">感情を選択してください</option>
          <option v-for="emotion in emotionOptions" :key="emotion" :value="emotion">
            {{ emotionLabels[emotion] }}
          </option>
        </select>
      </SettingItem>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { JsonMergeRemapType } from '@/types/OmikujiData/JsonMergeType'
  import { characterEmotions, CharacterEmotionType, CharacterType, emotionLabels } from '@/types'

  const props = defineProps<{
    modelValue: JsonMergeRemapType
    remapIndex: number
    characters: Record<string, CharacterType>
  }>()

  const emit = defineEmits(['update:modelValue', 'remove'])

  const emotionOptions = computed(() => characterEmotions as readonly CharacterEmotionType[])

  const updateField = (field: keyof JsonMergeRemapType, value: string) => {
    emit('update:modelValue', {
      ...props.modelValue,
      [field]: value,
    })
  }

  const removeRemap = () => {
    emit('remove')
  }
</script>
