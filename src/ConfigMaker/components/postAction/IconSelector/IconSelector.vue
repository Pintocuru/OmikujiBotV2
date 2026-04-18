<!-- src/ConfigMaker/components/postAction/IconSelector/IconSelector.vue -->
<template>
  <div class="flex gap-1">
    <select v-model="localIconKey" class="select select-bordered select-sm flex-1">
      <option v-for="(label, key) in selectOptions" :key="key" :value="key">
        {{ label }}
      </option>
    </select>
    <div class="relative">
      <button
        v-if="isCharacter"
        @click="showIconSelector"
        @mouseenter="showHoverSelector = true"
        @mouseleave="showHoverSelector = false"
        class="btn btn-sm btn-outline tooltip tooltip-top"
        data-tip="アイコンの一覧を表示します"
      >
        <User class="w-4 h-4" />
      </button>
    </div>
  </div>

  <IconSelectorModal
    v-if="isCharacter"
    ref="iconSelectorModalRef"
    :characterKey="characterKey"
    :currentIconKey="localIconKey"
    @select:icon="handleIconSelect"
  />
</template>

<script setup lang="ts">
  import { ref, computed, Ref } from 'vue'
  import { characterEmotionMap } from '@/types/MetaMaps/CharacterMaps'
  import IconSelectorModal from './IconSelectorModal.vue'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
  import { User } from 'lucide-vue-next'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useAccessCheckerConfig'

  const props = defineProps<{
    characterKey: string
    iconKey: string
  }>()

  const emit = defineEmits<{
    'update:iconKey': [value: string]
    showSelector: [characterKey: string, iconKey: string]
  }>()

  const { characterMap } = useCharacterManager()
  const { isCharacter } = useVisibilityAccess()

  // isCharacter なら characterMap の image、そうでなければ characterEmotionMap をフォールバックとして使用
  const selectOptions = computed<Record<string, string>>(() => {
    if (isCharacter.value) {
      return Object.fromEntries(
        Object.entries(characterMap.value[props.characterKey]?.image ?? {}).map(([k, v]) => [k, v.label])
      )
    }
    return characterEmotionMap
  })

  const showHoverSelector = ref(false)
  const iconSelectorModalRef: Ref<InstanceType<typeof IconSelectorModal> | null> = ref(null)

  const localIconKey = computed({
    get: () => props.iconKey,
    set: (newValue) => emit('update:iconKey', newValue),
  })

  const showIconSelector = () => {
    iconSelectorModalRef.value?.showModal()
  }

  const handleIconSelect = (selectedIcon: string) => {
    localIconKey.value = selectedIcon
  }
</script>
