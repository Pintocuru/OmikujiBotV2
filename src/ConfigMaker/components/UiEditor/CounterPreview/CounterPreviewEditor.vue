<!-- src/ConfigMaker/components/UiEditor/CounterPreview/CounterPreviewEditor.vue -->
<template>
  <!-- プレビュー -->
  <HudPreview :isAdminOnly="true">
    <div :class="[fontFamily]">
      <CounterPreviewManager :counterSetting="counter" :count="0" :users="generateDummyUserNames(100)" /></div
  ></HudPreview>

  <!-- テーマカラー -->
  <DaisyUiThemeEditor :model-value="counter.color" @update:model-value="(newValue) => updateField('color', newValue)" />

  <!-- コンポーネント選択 -->
  <SettingItem v-if="isPro" label="表示スタイル" description="カウンターの表示形式を選択" forceMode="pro">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(style, key) in counterComponentMap"
        :key="key"
        class="badge cursor-pointer"
        :class="counter.component === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('component', key)"
      >
        {{ style }}
      </div>
    </div>
  </SettingItem>

  <!-- 設定項目 -->
  <SettingItem label="対象ルールキー" description="どのルールを対象にするか">
    <div class="flex flex-wrap gap-2">
      <!-- すべて -->
      <div
        class="badge cursor-pointer"
        :class="counter.ruleKey === '' ? 'badge-primary' : 'badge-outline'"
        @click="updateField('ruleKey', '')"
      >
        すべて
      </div>
      <!-- 通常のルール -->
      <div
        v-for="(value, key) in rulesComment"
        :key="key"
        class="badge cursor-pointer"
        :class="counter.ruleKey === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('ruleKey', key)"
      >
        {{ value.name || '名称未設定' }}
      </div>
    </div>
  </SettingItem>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- カウンターの対象 -->
    <SettingItem label="対象カウント種別" description="カウンターの対象を選択">
      <div class="flex gap-2 flex-wrap">
        <div
          class="badge cursor-pointer"
          :class="counter.target === 'draw' ? 'badge-primary' : 'badge-outline'"
          @click="updateField('target', 'draw')"
        >
          実行回数
        </div>
        <div
          class="badge cursor-pointer"
          :class="counter.target === 'user' ? 'badge-primary' : 'badge-outline'"
          @click="updateField('target', 'user')"
        >
          ユーザー数
        </div>
      </div>
    </SettingItem>

    <!-- ラベル名 -->
    <SettingItem label="ラベル" description="カウンターのラベルを設定" :showReset="true" @reset="resetMap.label">
      <input
        type="text"
        class="input input-bordered w-full"
        :value="counter.label"
        @input="(e) => updateField('label', (e.target as HTMLInputElement).value)"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { counterComponentMap, SettingsCounterSchema, useFontFamily } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import DaisyUiThemeEditor from '@config/components/common/ThemeColorPicker/DaisyUiThemeEditor.vue'
  import CounterPreviewManager from '@main/ui/CounterPreview/parts/CounterPreviewManager.vue'
  import { generateDummyUserNames } from '@main/ui/GameRanking/parts/useDummyBotMessages'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro } = useSettingMode()
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))

  const rulesComment = computed(() => data.value.comments)

  const counter = computed(() => data.value.components.settings.counter ?? SettingsCounterSchema.parse({}))

  // 更新関数
  const updateField = (field: keyof typeof counter.value, value: any) => {
    omikujiStore.updateComponentSettings('counter', {
      ...counter.value,
      [field]: value,
    })
  }

  // リセット関数
  const resetField = (field: keyof typeof counter.value) => {
    const defaults = SettingsCounterSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    ruleKey: () => resetField('ruleKey'),
    component: () => resetField('component'),
    target: () => resetField('target'),
    label: () => resetField('label'),
    color: () => resetField('color'),
  }
</script>
