<!-- src/ConfigMaker/UiEditor/FlashBanner/FlashBannerEditor.vue -->
<template>
  <!-- プレビュー -->
  <FlashBannerPreview
    :key="`${flashBanner.component}-${flashBanner.scrollSpeed}-${flashBanner.scrollReturnMode}`"
    :settings="flashBanner"
    :messageText="messageText"
  />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="flashBanner.component"
    :options="flashComponentMap"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- デフォルトカラー設定 -->
  <template v-if="!flashBanner.defaultCharacterKey || !isCharacter">
    <ColorModeSelector
      :model-value="commonStyle.defaultColor"
      @update:model-value="(value) => updateCommonStyleField('defaultColor', value)"
    />
  </template>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- タイトル -->
    <SettingItem label="タイトル" description="タイトルを設定します" :showReset="true" @reset="resetMap.label">
      <input
        type="text"
        class="input input-bordered w-full"
        :value="flashBanner.label"
        @input="(e) => updateField('label', (e.target as HTMLInputElement).value)"
      />
    </SettingItem>

    <!-- ラベル・キャラクターを右側にするか -->
    <SettingItem
      label="ラベル位置"
      description="ラベル・キャラクターを右側に表示するか"
      :showReset="true"
      @reset="resetMap.showCharacterOnRight"
    >
      <label class="flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          v-model="flashBanner.showItemOnRight"
          @change="(e) => updateField('showItemOnRight', (e.target as HTMLInputElement).checked)"
        />
        <span class="ml-2"> {{ flashBanner.showItemOnRight ? '右' : '左' }}側に表示 </span>
      </label>
    </SettingItem>
  </div>

  <!-- アイコンサイズ -->
  <SettingItem
    v-if="isCharacter"
    label="アイコンサイズ"
    description="表示サイズを設定します"
    :showReset="true"
    @reset="resetMap.iconSize"
  >
    <div class="flex items-center gap-4">
      <input
        type="range"
        min="0"
        max="24"
        step="2"
        class="range range-primary flex-1"
        :value="flashBanner.iconSize"
        @input="(e) => updateField('iconSize', Number((e.target as HTMLInputElement).value))"
      />
      <div class="w-12 text-right">{{ flashBanner.iconSize }}px</div>
    </div>
  </SettingItem>

  <!-- 表示時間 -->
  <SettingItem
    v-if="flashBanner.displaySeconds !== null"
    label="表示時間"
    description="0で無限表示 / 1〜60秒で固定表示"
    :showReset="true"
    @reset="resetMap.displaySeconds"
  >
    <div class="flex flex-col gap-3">
      <div v-if="flashBanner.displaySeconds === null">
        <button type="button" class="btn btn-sm btn-outline" @click="updateField('displaySeconds', 30)">
          表示を変更する
        </button>
      </div>
      <div v-else class="flex flex-col gap-3">
        <div class="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="60"
            step="3"
            class="range range-primary flex-1"
            :value="flashBanner.displaySeconds"
            @input="(e) => updateField('displaySeconds', Number((e.target as HTMLInputElement).value))"
          />
          <div class="w-20 text-right">
            {{ flashBanner.displaySeconds === 0 ? '∞' : flashBanner.displaySeconds + '秒' }}
          </div>
        </div>
        この機能は非推奨となりました。v3にて削除予定です。
      </div>
    </div>
  </SettingItem>

  <!-- デフォルトで表示させるキャラクター -->
  <SettingItem
    v-if="isCharacter"
    label="デフォルト表示キャラクター"
    description="コメントがない時に表示するキャラを選びます"
    :showReset="true"
    @reset="resetMap.defaultCharacterKey"
  >
    <CharacterSelectorSingle
      :characters="data.characters"
      :selectedKey="flashBanner.defaultCharacterKey"
      @update:selectedKey="(key) => updateField('defaultCharacterKey', key)"
    />
  </SettingItem>

  <!-- スクロール速度 -->
  <SettingItem
    label="スクロール速度"
    description="テキストのスクロール速度を設定します (px/秒)"
    :showReset="true"
    @reset="resetMap.scrollSpeed"
  >
    <div class="flex items-center gap-4">
      <input
        type="range"
        min="10"
        max="100"
        step="10"
        class="range range-primary flex-1"
        :value="flashBanner.scrollSpeed"
        @input="(e) => updateField('scrollSpeed', Number((e.target as HTMLInputElement).value))"
      />
      <div class="w-20 text-right">{{ flashBanner.scrollSpeed }}px/秒</div>
    </div>
  </SettingItem>

  <!-- スクロール折り返し方式 -->
  <SettingItem
    v-if="flashBanner.component !== 'ticker' && flashBanner.component !== 'scroll'"
    label="スクロール折り返し"
    description="長文スクロール終了後の戻り方を選択します"
    :showReset="true"
    @reset="resetMap.scrollReturnMode"
  >
    <div class="flex gap-3">
      <label v-for="(label, mode) in scrollReturnModeMap" :key="mode" class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          class="radio radio-primary"
          :value="mode"
          :checked="flashBanner.scrollReturnMode === mode"
          @change="updateField('scrollReturnMode', mode)"
        />
        <span class="flex flex-col">
          <span class="font-medium">{{ label.title }}</span>
          <span class="text-xs text-base-content/60">{{ label.description }}</span>
        </span>
      </label>
    </div>
  </SettingItem>

  <!-- デフォルトで表示させるメッセージ -->
  <SettingItem
    label="デフォルトメッセージ"
    description="プレースホルダーが使えます"
    :showReset="true"
    @reset="resetMap.defaultMessage"
  >
    <MessageTextDialog v-model="messageText" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { flashComponentMap, scrollReturnModeMap, FlashBannerSchema } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import CharacterSelectorSingle from '@config/UiEditor/ToastWidgets/CharacterSelectorSingle.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import ColorModeSelector from '@config/components/common/ThemeColorPicker/ColorModeSelector.vue'
  import { useCommonStyleUpdate } from '../CommonStyle/useCommonStyleUpdate'
  import MessageTextDialog from '@config/components/postAction/Message/MessageTextDialog.vue'
  import FlashBannerPreview from './FlashBannerPreview.vue'
  import DisplayStyleSelector from '../CommonStyle/DisplayStyleSelector.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isCharacter } = useVisibilityAccess()
  const { updateCommonStyleField } = useCommonStyleUpdate()

  const flashBanner = computed(() => data.value.components.settings.flashBanner ?? FlashBannerSchema.parse({}))
  const commonStyle = computed(() => data.value.components.commonStyle)

  // Field Updates
  const updateField = (field: keyof typeof flashBanner.value, value: any) => {
    omikujiStore.updateComponentSettings('flashBanner', {
      ...flashBanner.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof typeof flashBanner.value) => {
    const defaults = FlashBannerSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    label: () => resetField('label'),
    iconSize: () => resetField('iconSize'),
    displaySeconds: () => resetField('displaySeconds'),
    showCharacterOnRight: () => resetField('showItemOnRight'),
    defaultCharacterKey: () => resetField('defaultCharacterKey'),
    defaultMessage: () => resetField('defaultMessage'),
    scrollSpeed: () => resetField('scrollSpeed'),
    scrollReturnMode: () => resetField('scrollReturnMode'),
  }

  // Message Text
  const messageText = computed<string>({
    get: () => flashBanner.value.defaultMessage ?? '',
    set: (value) => {
      updateField('defaultMessage', value)
    },
  })
</script>
