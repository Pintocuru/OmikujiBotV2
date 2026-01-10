<!-- src\ConfigMaker\components\componentEditor\bubble\BubbleCharactersEditor.vue -->
<template>
  <div class="space-y-2">
    <!-- Center (固定表示) -->
    <CharacterSlot
      slot-name="center"
      title="コメント時に表示するキャラクター"
      badge-style="badge-primary"
      :characters="characters"
      :items="editableGroups.center"
      :show-clear="false"
      @update="updateSlot('center', $event)"
    />

    <!-- Slots Grid (2列レイアウト) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CharacterSlot
        v-for="slot in visibleSlotConfigs"
        :key="slot.name"
        :slot-name="slot.name"
        :title="slot.title"
        :badge-style="slot.badgeStyle"
        :card-style="slot.cardStyle"
        :characters="characters"
        :items="editableGroups[slot.name]"
        @update="updateSlot(slot.name, $event)"
        @clear="clearSlot(slot.name)"
      />
    </div>

    <!-- 表示枠の増減ボタン -->
    <div class="flex gap-2">
      <button class="btn btn-sm btn-primary flex-1" :disabled="visibleSlots >= 4" @click="increaseSlots">
        表示枠を増やす
      </button>
      <button class="btn btn-sm btn-outline flex-1" :disabled="visibleSlots <= 1" @click="decreaseSlots">
        表示枠を減らす
      </button>
    </div>

    <div v-if="errorMessage" class="text-error mt-2">
      {{ errorMessage }}
    </div>

    <InformationCard>
      <p>
        <span class="label bg-accent text-accent-content">スロットの仕組み</span>
      </p>
      <p>
        ・スロットはキャラクターキーを並べた配列です。<br />
        ・配列の先頭のキャラクターが通常時に表示されます。<br />
        ・2番目以降のキャラクターは普段は非表示ですが、喋るときに表示されます。
      </p>

      <p>
        <span class="label bg-accent text-accent-content">並べ替え方法</span>
      </p>
      <p>
        ・「表示枠を増やす」を押してスロット数を増やします。<br />
        ・キャラクターをドラッグ＆ドロップして、配列の順番（表示順）を変更できます。
      </p>
    </InformationCard>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { ShowCharactersSchema, type ShowCharacters } from '@/types/'
  import CharacterSlot from './CharacterSlot.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import InformationCard from '@shared/components/parts/InformationCard.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const errorMessage = ref('')
  const visibleSlots = ref(1)

  const bubble = computed(() => data.value.components.bubble)
  const characters = computed(() => data.value.characters)
  const availableCharacters = computed(() => Object.keys(characters.value))

  const editableGroups = ref<ShowCharacters>(ShowCharactersSchema.parse({}))

  // スロット設定（DaisyUIカラー使用）
  const slotConfigs = [
    {
      name: 'slot1' as keyof ShowCharacters,
      title: 'スロット 1',
      badgeStyle: 'badge-error',
      cardStyle: 'bg-error bg-opacity-10 border-error border-3',
    },
    {
      name: 'slot2' as keyof ShowCharacters,
      title: 'スロット 2',
      badgeStyle: 'badge-info',
      cardStyle: 'bg-info bg-opacity-10 border-info border-3',
    },
    {
      name: 'slot3' as keyof ShowCharacters,
      title: 'スロット 3',
      badgeStyle: 'badge-success',
      cardStyle: 'bg-success bg-opacity-10 border-success border-3',
    },
    {
      name: 'slot4' as keyof ShowCharacters,
      title: 'スロット 4',
      badgeStyle: 'badge-warning',
      cardStyle: 'bg-warning bg-opacity-10 border-warning border-3',
    },
  ]

  const visibleSlotConfigs = computed(() => {
    return slotConfigs.slice(0, visibleSlots.value)
  })

  // グループの初期化
  const initializeGroups = () => {
    const current = bubble.value.showCharacters
    const allUsedChars = new Set([
      ...current.center,
      ...current.slot1,
      ...current.slot2,
      ...current.slot3,
      ...current.slot4,
    ])
    const unusedChars = availableCharacters.value.filter((char) => !allUsedChars.has(char))

    editableGroups.value = {
      center: Array.from(new Set([...current.center, ...unusedChars])),
      slot1: [...current.slot1],
      slot2: [...current.slot2],
      slot3: [...current.slot3],
      slot4: [...current.slot4],
    }

    // 初期表示スロット数を計算
    if (current.slot4.length > 0) visibleSlots.value = 4
    else if (current.slot3.length > 0) visibleSlots.value = 3
    else if (current.slot2.length > 0) visibleSlots.value = 2
    else visibleSlots.value = 1

    updateStore()
  }

  const updateStore = () => {
    omikujiStore.updateNestedComponents('bubble', {
      ...bubble.value,
      showCharacters: editableGroups.value,
    })
  }

  // スロットを更新
  const updateSlot = (slotName: keyof ShowCharacters, newItems: string[]) => {
    editableGroups.value[slotName] = newItems
    updateStore()
  }

  // スロットをクリア
  const clearSlot = (slotName: keyof ShowCharacters) => {
    if (slotName === 'center') return

    const charsToMove = editableGroups.value[slotName]
    editableGroups.value.center.push(...charsToMove)
    editableGroups.value[slotName] = []

    updateStore()
  }

  // スロットを増やす
  const increaseSlots = () => {
    if (visibleSlots.value < 4) {
      visibleSlots.value++
    }
  }

  // スロットを減らす
  const decreaseSlots = () => {
    if (visibleSlots.value > 1) {
      const slotNames: Array<keyof ShowCharacters> = ['slot4', 'slot3', 'slot2']
      const slotToRemove = slotNames[4 - visibleSlots.value]

      if (slotToRemove) clearSlot(slotToRemove)

      visibleSlots.value--
    }
  }

  onMounted(initializeGroups)
  watch(availableCharacters, initializeGroups, { immediate: false, deep: true })
</script>
