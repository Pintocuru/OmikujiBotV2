<!-- src/ConfigMaker/components/UiEditor/FlashBanner/FlashBannerEditor.vue -->
<template>
  <!-- プレビュー -->
  <div class="max-h-56 overflow-y-hidden" :class="[fontFamily]" @click="handlePreviewClick">
    <FlashBannerRenderer
      :settings="flashBanner"
      :message="defaultComment || '(デフォルトメッセージが設定されない場合、自動的に枠が非表示になります)'"
      :layers="iconSrc(flashBanner.defaultCharacterKey, 'default')"
      :color="getCharacterColor(flashBanner.defaultCharacterKey)"
      :label-class="blinkClass"
    />
  </div>

  <!-- デフォルトカラー設定 -->
  <template v-if="!flashBanner.defaultCharacterKey || !isCharacter">
    <ColorModeSelector
      :model-value="commonStyle.defaultColor"
      @update:model-value="(value) => updateCommonStyleField('defaultColor', value)"
    />
  </template>

  <!-- コンポーネント選択 -->
  <SettingItem v-if="isPro" label="表示スタイル" description="表示形式を選択" forceMode="pro">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(style, key) in flashComponentMap"
        :key="key"
        class="badge cursor-pointer"
        :class="flashBanner.component === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('component', key)"
      >
        {{ style }}
      </div>
    </div>
  </SettingItem>

  <!-- タイトル -->
  <SettingItem label="タイトル" description="タイトルを設定します" :showReset="true" @reset="resetMap.label">
    <input
      type="text"
      class="input input-bordered w-full"
      :value="flashBanner.label"
      @input="(e) => updateField('label', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>

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
    label="表示時間"
    description="0で無限表示 / 1〜60秒で固定表示"
    :showReset="true"
    @reset="resetMap.displaySeconds"
  >
    <div class="flex flex-col gap-3">
      <!-- null時：変更ボタン -->
      <div v-if="flashBanner.displaySeconds === null">
        <button type="button" class="btn btn-sm btn-outline" @click="updateField('displaySeconds', 30)">
          表示を変更する
        </button>
      </div>

      <!-- 数値時：スライダー表示 -->
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
      </div>
    </div>
  </SettingItem>

  <!-- ラベル・キャラクターを右側にするか -->
  <SettingItem
    label="ラベル位置"
    description="ラベル・キャラクターを右側に表示するかどうか"
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
      <span class="ml-2"> {{ flashBanner.showItemOnRight ? '右' : '左' }}側に表示する </span>
    </label>
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

  <!-- デフォルトで表示させるメッセージ -->
  <SettingItem label="デフォルトメッセージ" description="プレースホルダーが使えます">
    <MessageTextEditor v-model="bubbleText" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { defaultPlaceholdersShortLabels, flashComponentMap, SettingsFlashBannerSchema, useFontFamily } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import CharacterSelectorSingle from '@config/components/UiEditor/ToastWidgets/CharacterSelectorSingle.vue'
  import { useSettingMode, useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import ColorModeSelector from '@config/components/common/ThemeColorPicker/ColorModeSelector.vue'
  import FlashBannerRenderer from '@main/ui/FlashBanner/parts/FlashBannerRenderer.vue'
  import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
  import { ContentPlaceholder } from '@main/scripts/ContentPlaceholder/processor'
  import { useCommonStyleUpdate } from '../CommonStyle/useCommonStyleUpdate'
  import { useDelayedBlink } from '@main/ui/FlashBanner/parts/useDelayedBlink'
  import MessageTextEditor from '@config/components/postAction/Message/MessageTextEditor.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro } = useSettingMode()

  const { isCharacter } = useVisibilityAccess()
  const { getCharacterColor, iconSrc } = useCharacterManager()
  const { updateCommonStyleField } = useCommonStyleUpdate()
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))

  const flashBanner = computed(() => data.value.components.settings.flashBanner ?? SettingsFlashBannerSchema.parse({}))
  const commonStyle = computed(() => data.value.components.commonStyle)

  // Blink Control (コンポーザブル使用)
  const { blinkClass, triggerBlink } = useDelayedBlink({
    transitionDuration: 0, // エディターではTransition待ちなし
    blinkDuration: 750,
  })

  /** プレビュークリック時にブリンク */
  const handlePreviewClick = async () => {
    defaultMessageRefreshKey.value++
    await triggerBlink(false) // 遅延なしで即座にブリンク
  }

  // Field Updates
  const updateField = (field: keyof typeof flashBanner.value, value: any) => {
    omikujiStore.updateComponentSettings('flashBanner', {
      ...flashBanner.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof typeof flashBanner.value) => {
    const defaults = SettingsFlashBannerSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    label: () => resetField('label'),
    iconSize: () => resetField('iconSize'),
    displaySeconds: () => resetField('displaySeconds'),
    showCharacterOnRight: () => resetField('showItemOnRight'),
    defaultCharacterKey: () => resetField('defaultCharacterKey'),
    defaultMessage: () => resetField('defaultMessage'),
  }

  // Message Text
  const bubbleText = computed<string>({
    get: () => flashBanner.value.defaultMessage ?? '',
    set: (value) => {
      updateField('defaultMessage', value)
    },
  })

  // Default Comment with Placeholders
  const defaultMessageRefreshKey = ref(0)

  const defaultComment = computed(() => {
    void defaultMessageRefreshKey.value
    const contentPlaceholder = new ContentPlaceholder(data.value.placeholders)
    contentPlaceholder.updateResolvedValues(defaultPlaceholdersShortLabels)
    return contentPlaceholder.processText(bubbleText.value)
  })
</script>
