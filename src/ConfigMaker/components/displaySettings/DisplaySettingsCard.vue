<!-- src/ConfigMaker/components/display/BaseSettingsEditor.vue -->
<template>
  <!-- 基本表示設定 -->
  <SectionCard>
    <template #header>
      <div>基本表示設定</div>
    </template>

    <template #body>
      <!-- 表示サイズ -->
      <SettingItem label="表示サイズ" description="コンテンツの表示サイズを設定します" @reset="resetMap.displaySize">
        <select v-model="base.displaySize" class="select select-bordered w-full max-w-xs">
          <option v-for="size in displaySize" :key="size" :value="size">
            {{ displaySizeLabels[size] }}
          </option>
        </select>
      </SettingItem>

      <!-- フォントファミリー -->
      <SettingItem
        label="フォントファミリー"
        description="表示に使用するフォントを設定します"
        @reset="resetMap.fontFamily"
      >
        <select v-model="base.fontFamily" class="select select-bordered w-full max-w-xs">
          <option value="">デフォルト</option>
          <option v-for="font in fontFamilyOptions" :key="font" :value="font">
            {{ fontFamilyLabels[font] }}
          </option>
        </select>
      </SettingItem>

      <!-- フキダシアニメーション -->
      <SettingItem
        label="フキダシアニメーション"
        description="フキダシの表示アニメーションを設定します"
        @reset="resetMap.bubbleAnimation"
      >
        <select v-model="base.bubbleAnimation" class="select select-bordered w-full max-w-xs">
          <option v-for="animation in animationLabel" :key="animation" :value="animation">
            {{ animation }}
          </option>
        </select>
      </SettingItem>
    </template>
  </SectionCard>

  <!-- 表示オプション -->
  <SectionCard>
    <template #header>
      <div>表示オプション</div>
    </template>

    <template #body>
      <!-- キャラクターアイコン表示 -->
      <SettingItem
        label="キャラクターアイコン"
        description="右下にキャラクターのサムネイルを表示します"
        @reset="resetMap.showCharacterIcon"
      >
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="base.showCharacterIcon" type="checkbox" class="toggle toggle-primary" />
          <span class="label-text">キャラクターアイコンを表示する</span>
        </label>
      </SettingItem>

      <!-- トースト表示 -->
      <SettingItem label="トースト通知" description="画面上部に通知メッセージを表示します" @reset="resetMap.showToasts">
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="base.showToasts" type="checkbox" class="toggle toggle-primary" />
          <span class="label-text">トースト通知を表示する</span>
        </label>
      </SettingItem>
    </template>
  </SectionCard>

  <SectionCard>
    <template #header>
      <div>エディター設定</div>
    </template>

    <template #body>
      <!-- DaisyUIテーマ -->
      <SettingItem
        label="カラーテーマ"
        description="アプリケーションのカラーテーマを設定します"
        @reset="resetMap.daisyUiTheme"
      >
        <select v-model="base.daisyUiTheme" class="select select-bordered w-full max-w-xs">
          <option v-for="theme in themes" :key="theme" :value="theme">
            {{ theme }}
          </option>
        </select>
      </SettingItem>

      <!-- DaisyUIテーマ -->
      <SettingItem label="ライセンスキー" description="入力したハッシュでモードを判定します" :showReset="false">
        <div class="flex gap-2 items-center">
          <span v-if="isPro && !isGod" class="badge badge-success">PRO</span>
          <span v-if="isGod" class="badge badge-warning">GOD-MODE</span>
          <input type="password" class="input input-bordered flex-1" v-model="licenseKeyHash" placeholder="****" />
          <span v-if="isDev">
            <button class="btn btn-sm btn-primary mr-2" @click="licenseKeyHash = ''">basic</button>
            <button class="btn btn-sm btn-success mr-2" @click="licenseKeyHash = '2c26b46b68ffc68ff99b453c1d304134'">
              PRO
            </button>
            <button class="btn btn-sm btn-warning" @click="licenseKeyHash = '5d41402abc4b2a76b9719d911017c592'">
              GOD-MODE
            </button>
          </span>
        </div>
      </SettingItem>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { displaySize, displaySizeLabels } from '@shared/types'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import { fontFamilyOptions } from '@/types/BotComponents/useFontFamily'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'
  import { BaseSettingsSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { animationLabel } from '@/types/BotComponents/animation'
  import { fontFamilyLabels } from '@/types/BotComponents/useFontFamily'
  import { isDev } from '@/types'
  import { useSettingMode } from '@/types/SettingMode'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro, isGod } = useSettingMode()

  // 基本設定の参照
  const base = computed({
    get: () => data.value.displaySettings.base,
    set: (newValue) => {
      omikujiStore.updateDisplaySettings({
        base: {
          ...data.value.displaySettings.base,
          ...newValue,
        },
      })
    },
  })

  const licenseKeyHash = computed({
    get: () => data.value.displaySettings.licenseKeyHash,
    set: (newValue) => {
      omikujiStore.updateDisplaySettings({
        licenseKeyHash: newValue,
      })
    },
  })

  function setDevLicenseKey() {
    licenseKeyHash.value = '5d41402abc4b2a76b9719d911017c592' // GOD-MODEのハッシュ例
  }

  // 共通リセット関数
  const resetField = (field: keyof typeof base.value) => {
    const schemaDefaults = BaseSettingsSchema.parse({})
    const defaultValue = schemaDefaults[field]

    base.value = {
      ...base.value,
      [field]: defaultValue,
    }
  }

  // フィールドごとのリセット関数マップ
  const resetMap = {
    displaySize: () => resetField('displaySize'),
    bubbleAnimation: () => resetField('bubbleAnimation'),
    fontFamily: () => resetField('fontFamily'),
    showCharacterIcon: () => resetField('showCharacterIcon'),
    showToasts: () => resetField('showToasts'),
    daisyUiTheme: () => resetField('daisyUiTheme'),
  }
</script>
