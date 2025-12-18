<!-- C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\ConfigMaker\components\postAction\IconSelector\IconSelector.vue -->
<template>
  <div class="flex gap-1">
    <select v-model="localIconKey" class="select select-bordered select-sm flex-1">
      <option v-for="emotion in characterEmotions" :key="emotion" :value="emotion">
        {{ emotionLabels[emotion] }}
      </option>
    </select>
    <div class="relative">
      <button
        @click="showIconSelector"
        @mouseenter="showHoverSelector = true"
        @mouseleave="showHoverSelector = false"
        class="btn btn-sm btn-outline"
      >
        <User class="w-4 h-4" />
      </button>
    </div>
  </div>

  <IconSelectorModal
    ref="iconSelectorModalRef"
    :characterKey="characterKey"
    :currentIconKey="localIconKey"
    @select:icon="handleIconSelect"
  />
</template>

<script setup lang="ts">
  import { ref, computed, Ref } from 'vue'
  import { emotionLabels, CharacterEmotionType, characterEmotions } from '@/types/'
  import IconSelectorModal from './IconSelectorModal.vue'
  import { User } from 'lucide-vue-next'

  const props = defineProps<{
    characterKey: string
    iconKey: CharacterEmotionType
  }>()

  const emit = defineEmits<{
    'update:iconKey': [value: string]
    showSelector: [characterKey: string, iconKey: CharacterEmotionType]
  }>()

  const showHoverSelector = ref(false)
  const iconSelectorModalRef: Ref<InstanceType<typeof IconSelectorModal> | null> = ref(null)

  const localIconKey = computed({
    get: () => props.iconKey,
    set: (newValue) => {
      emit('update:iconKey', newValue)
    },
  })

  const showIconSelector = () => {
    iconSelectorModalRef.value?.showModal()
  }

  const handleIconSelect = (selectedIcon: CharacterEmotionType) => {
    localIconKey.value = selectedIcon
  }
</script>
