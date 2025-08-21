<!-- src/configMaker/components/postAction/PostActionBasicSettings.vue -->
<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 max-w-screen-md">
    <!-- 遅延秒数 -->
    <div class="form-control">
      <label class="label py-0">
        <span class="label-text text-xs">⏱️ 遅延秒数</span>
      </label>
      <input
        type="number"
        v-model.number="delaySeconds"
        min="-1"
        step="0.1"
        class="input input-bordered input-sm w-full"
        placeholder="0"
      />
    </div>

    <!-- キャラクター -->
    <div v-if="action.messageContent !== '' || action.messageToast !== ''" class="form-control">
      <label class="label py-0">
        <span class="label-text text-xs">👤 キャラクター</span>
      </label>
      <select v-model="characterKey" class="select select-bordered select-sm w-full">
        <option v-for="char in characterOptions" :key="char.value" :value="char.value">
          {{ char.label }}
        </option>
      </select>
    </div>

    <!-- アイコン -->
    <IconSelector
      v-if="action.messageContent !== '' || action.messageToast !== ''"
      :character-key="action.characterKey"
      :icon-key="action.iconKey"
      @update:icon-key="updateProp($event as CharacterEmotionType)"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterEmotionType, PostActionType } from '@/types/'
  import IconSelector from '@ConfigComponents/rules/IconSelector.vue'

  const props = defineProps<{
    action: PostActionType
    characterOptions: Array<{ value: string; label: string }>
  }>()

  const emit = defineEmits(['update:action'])

  // v-modelに使用するcomputedプロパティ
  const characterKey = computed({
    get: () => props.action.characterKey,
    set: (value) => {
      emit('update:action', { ...props.action, characterKey: value })
    },
  })

  const delaySeconds = computed({
    get: () => props.action.delaySeconds,
    set: (value) => {
      emit('update:action', { ...props.action, delaySeconds: value })
    },
  })

  // IconSelectorからのイベントを処理する関数
  const updateProp = (value: CharacterEmotionType) => {
    emit('update:action', { ...props.action, iconKey: value })
  }
</script>
