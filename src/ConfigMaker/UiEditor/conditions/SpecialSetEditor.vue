<!-- src/ConfigMaker/UiEditor/conditions/SpecialSetEditor.vue -->
<template>
  <div class="flex flex-col gap-3">
    <!-- specialSet 選択（isGod のみ） -->
    <SubSectionHeader icon="Settings" title="スペシャルセット選択" description="管理者モードでのみ変更できます" />
    <SettingItem forceMode="god" label="スペシャルセット" description="専用レイアウトを使用する場合に選択します">
      <div class="flex flex-wrap gap-2">
        <!-- null = 個別設定 -->
        <span
          class="badge cursor-pointer select-none"
          :class="specialSet === null ? 'badge-neutral text-neutral-content' : 'badge-outline text-base-content'"
          @click="updateSpecialSet(null)"
        >
          個別設定
        </span>

        <!-- 各specialSet -->
        <span
          v-for="(def, key) in uiSpecialSetMap"
          :key="key"
          class="badge cursor-pointer select-none"
          :class="specialSet === key ? 'badge-accent text-accent-content' : 'badge-outline text-base-content'"
          :title="def.description"
          @click="updateSpecialSet(key)"
        >
          {{ def.label }}
        </span>
      </div>
    </SettingItem>

    <!-- specialSet 選択中の詳細 -->
    <template v-if="setDef">
      <SubSectionHeader icon="LayoutGrid" title="使用中のアイテム" description="このセットに含まれるアイテムです" />
      <div class="flex flex-wrap gap-2 px-2">
        <span v-for="kind in setDef.kinds" :key="kind" class="badge badge-accent text-accent-content select-none">
          {{ uiKindMap[kind].label }}
        </span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { uiSpecialSetMap, uiKindMap } from '@/types/MetaMaps'
  import { UiSpecialSetType } from '@/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const specialSet = computed(() => data.value.components.specialSet)

  const setDef = computed(() => (specialSet.value ? uiSpecialSetMap[specialSet.value] : null))

  const updateSpecialSet = (key: UiSpecialSetType | null) => {
    omikujiStore.updateComponents({ specialSet: key })
  }
</script>
