<!-- src/ConfigMaker/UiEditor/WinnerGroup/WinnerGroupEditor.vue -->
<template>
  <!-- プレビュー -->
  <HudPreview maxHeightClass="max-h-96" :isAdminOnly="true">
    <div :class="[fontFamily]">
      <WinnerGroupSelector
        :key="previewKey"
        :winnerSetting="winnerSetting"
        :users="previewUsers"
        :isVisible="true"
        @click="handleClick"
      />
    </div>
  </HudPreview>

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="winnerSetting.component"
    :options="winnerComponentMap"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- 設定項目 -->
  <SettingItem label="対象イベントキー" description="どのイベントを対象にするか">
    <div class="flex flex-wrap gap-2">
      <!-- すべて -->
      <div
        class="badge cursor-pointer"
        :class="winnerSetting.targetEventKey === '' ? 'badge-primary' : 'badge-outline'"
        @click="updateField('targetEventKey', '')"
      >
        すべて
      </div>
      <!-- 通常のイベント -->
      <div
        v-for="(value, key) in rulesComment"
        :key="key"
        class="badge cursor-pointer"
        :class="winnerSetting.targetEventKey === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('targetEventKey', key)"
      >
        {{ value.name || '名称未設定' }}
      </div>
    </div>
  </SettingItem>

  <!-- タイトル -->
  <SettingItem label="タイトル" description="タイトルを設定します" :showReset="true" @reset="resetMap.label">
    <input
      type="text"
      class="input input-bordered w-full"
      :value="winnerSetting.label"
      @input="(e) => updateField('label', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>

  <!-- テーマカラー -->
  <SettingItem label="テーマカラー" description="テーマカラーを選択">
    <select
      class="select select-bordered"
      :value="winnerSetting.color"
      @change="(e) => updateField('color', (e.target as HTMLSelectElement).value)"
    >
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
  </SettingItem>

  <!-- クエリ文字列(クリックしたときのスクリプト実行パラメータ) -->
  <SettingItem label="クエリ文字列" description="スクリプト実行のパラメータ" :showReset="true" @reset="resetMap.label">
    <input
      type="text"
      class="input input-bordered w-full"
      :value="winnerSetting.queryString"
      @input="(e) => updateField('queryString', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { WinnerGroupSchema, useFontFamily, winnerComponentMap } from '@/types/'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import WinnerGroupSelector from '@main/ui/WinnerGroup/parts/WinnerGroupSelector.vue'
  import { generateDummyWinnerUsers } from '@/common/MockUser/MockGenerators'
  import { parseQueryString } from '@/GameScripts/parseQueryString'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import DisplayStyleSelector from '../CommonStyle/DisplayStyleSelector.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro } = useSettingMode()
  const previewKey = ref(0)
  const rulesComment = computed(() => data.value.comments)
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))

  const winnerSetting = computed(() => data.value.components.settings.winnerGroup ?? WinnerGroupSchema.parse({}))
  const queryCount = computed(() => {
    const parsed = parseQueryString(winnerSetting.value.queryString)
    const count = Number(parsed?.count)
    return Number.isFinite(count) ? count : 0
  })

  const previewUsers = ref<UserVisitRecord[]>([])

  const updateField = (field: keyof typeof winnerSetting.value, value: any) => {
    omikujiStore.updateComponentSettings('winnerGroup', {
      ...winnerSetting.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof typeof winnerSetting.value) => {
    const defaults = WinnerGroupSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    component: () => resetField('component'),
    label: () => resetField('label'),
    color: () => resetField('color'),
    queryString: () => resetField('queryString'),
  }

  // WinnerGroup の実行
  const handleClick = () => {
    previewKey.value++
    previewUsers.value = generateDummyWinnerUsers(queryCount.value ?? 2)
  }

  // 初回実行
  onMounted(() => handleClick())
</script>
