<!-- src\ConfigMaker\components\componentEditor\FlashBanner\FlashBannerEditor.vue -->
<template>
  <!-- プレビュー -->
  <div class="max-h-56 overflow-y-hidden" :class="[fontFamily]" @click="handlePreviewClick">
    <FlashBannerItem
      :label="flashBanner.label"
      :message="defaultComment || '(デフォルトメッセージが設定されない場合、自動的に枠が非表示になります)'"
      :layers="iconSrc(flashBanner.defaultCharacterKey, 'default')"
      :icon-size="flashBanner.iconSize"
      :color="getCharacterColor(flashBanner.defaultCharacterKey)"
      :show-character-on-right="flashBanner.showCharacterOnRight"
      :label-class="blinkClass"
    />
  </div>

  <!-- デフォルトカラー設定 -->
  <template v-if="!flashBanner.defaultCharacterKey || !isCharacter">
    <ColorModeSelector
      :model-value="commonStyle.defaultColor"
      @update:model-value="(value) => updateCommonStyleField('defaultColor', value)"
    />

    <InformationCard>
      <p>デフォルトカラーは、フキダシ・トースト共通です。</p>
    </InformationCard>
  </template>

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
    label="アイコンサイズ"
    description="アイコンの表示サイズ(px)を設定します"
    :showReset="true"
    @reset="resetMap.iconSize"
  >
    <div class="flex items-center gap-4">
      <input
        type="range"
        min="0"
        max="24"
        step="4"
        class="range range-primary flex-1"
        :value="flashBanner.iconSize"
        @input="(e) => updateField('iconSize', Number((e.target as HTMLInputElement).value))"
      />

      <div class="w-12 text-right">{{ flashBanner.iconSize }}px</div>
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
        v-model="flashBanner.showCharacterOnRight"
        @change="(e) => updateField('showCharacterOnRight', (e.target as HTMLInputElement).checked)"
      />
      <span class="ml-2"> {{ flashBanner.showCharacterOnRight ? '右' : '左' }}側に表示する </span>
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
    <div class="relative w-full">
      <!-- input -->
      <input
        v-model="bubbleText"
        type="text"
        class="input input-bordered input-sm w-full pr-10"
        placeholder="デフォルトメッセージを入力"
        :class="{ hidden: isTextarea }"
      />

      <!-- textarea -->
      <textarea
        v-model="bubbleText"
        rows="3"
        class="textarea textarea-bordered textarea-sm w-full pr-10"
        placeholder="デフォルトメッセージを入力"
        :class="{ hidden: !isTextarea }"
      ></textarea>

      <!-- 切り替えボタン -->
      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
        @click="isTextarea = !isTextarea"
      >
        <AlignLeft v-if="!isTextarea" class="w-4 h-4" />
        <AlignJustify v-else class="w-4 h-4" />
      </button>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { defaultPlaceholdersShortLabels, SettingsFlashBannerSchema, useFontFamily } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import CharacterSelectorSingle from '@config/components/componentEditor/ToastWidgets/CharacterSelectorSingle.vue'
  import { useSettingMode, useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import ColorModeSelector from '@config/components/common/ThemeColorPicker/ColorModeSelector.vue'
  import FlashBannerItem from '@main/ui/FlashBanner/parts/FlashBannerItem.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { AlignLeft, AlignJustify } from 'lucide-vue-next'
  import { useCharacterManager } from '@/ConfigMaker/scripts/CharacterManager/useCharacterManager'
  import { ContentPlaceholder } from '@/MainGenerator/scripts/ContentPlaceholder/processor'
  import { useCommonStyleUpdate } from '../CommonStyle/useCommonStyleUpdate'
  import { useDelayedBlink } from '@main/ui/FlashBanner/parts/useDelayedBlink'

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
    showCharacterOnRight: () => resetField('showCharacterOnRight'),
    defaultCharacterKey: () => resetField('defaultCharacterKey'),
    defaultMessage: () => resetField('defaultMessage'),
  }

  // Message Text
  const isTextarea = ref(true)
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
