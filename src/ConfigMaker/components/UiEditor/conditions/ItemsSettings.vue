<!-- src/ConfigMaker/components/appInfo/FlagsSettings/UsageComponentsSettings.vue -->
<template>
  <div class="space-y-4">
    <div v-for="group in groupedUiKinds" :key="group.slot" class="space-y-2">
      <h3 class="text-sm font-bold uppercase">{{ group.slot }}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <SettingItem
          v-for="[key, value] in group.items"
          :key="key"
          :label="value.label"
          :description="key"
          :variant="isEnabled(key) ? undefined : 'neutral'"
        >
          <input
            type="checkbox"
            class="toggle toggle-warning toggle-sm"
            :checked="isEnabled(key)"
            @change="handleToggle(key, $event)"
          />
        </SettingItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { settingsSchemaMap, uiKindMap } from '@/types/'
  import type { UiKind } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const settings = computed(() => data.value.components.settings)

  const isEnabled = (key: UiKind) => settings.value[key as keyof typeof settings.value] !== undefined

  const slotOrder = ['primary', 'secondary', 'extra'] as const
  const groupedUiKinds = computed(() =>
    slotOrder.map((slot) => ({
      slot,
      items: (Object.entries(uiKindMap) as [UiKind, (typeof uiKindMap)[UiKind]][]).filter(
        ([, v]) => v.primarySlot === slot
      ),
    }))
  )

  const handleToggle = async (key: UiKind, event: Event) => {
    const checkbox = event.target as HTMLInputElement
    const turningOn = checkbox.checked

    // ON: デフォルト値でsettingsを初期化
    if (turningOn) {
      const defaultValue = createDefaultSettings(key)
      omikujiStore.updateComponentSettings(key as keyof typeof settings.value, defaultValue)
      return
    }

    // OFF: 確認ダイアログ
    checkbox.checked = true // 一旦チェックを戻す（ダイアログキャンセル時のため）
    const result = await swalModal.confirmDelete({
      title: `${uiKindMap[key]?.label ?? key} を無効にしますか？`,
      text: 'この設定データは削除されます',
    })

    if (result.isConfirmed) {
      omikujiStore.removeComponentSetting(key as keyof typeof settings.value)
    }
  }

  const createDefaultSettings = (key: UiKind) => {
    const schema = settingsSchemaMap[key]
    if (!schema) return undefined

    return schema.parse({})
  }
</script>
