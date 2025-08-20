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
          <option v-for="size in displaySizeOptions" :key="size" :value="size">
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

      <!-- DaisyUIテーマ -->
      <SettingItem
        label="カラーテーマ"
        description="アプリケーションのカラーテーマを設定します"
        @reset="resetMap.daisyUiTheme"
      >
        <select v-model="base.daisyUiTheme" class="select select-bordered w-full max-w-xs">
          <option v-for="theme in themeOptions" :key="theme" :value="theme">
            {{ getThemeDisplayName(theme) }}
          </option>
        </select>
      </SettingItem>
    </template>
  </SectionCard>

  <!-- アニメーション設定 -->
  <SectionCard>
    <template #header>
      <div>アニメーション設定</div>
    </template>

    <template #body>
      <!-- フキダシアニメーション -->
      <SettingItem
        label="フキダシアニメーション"
        description="フキダシの表示アニメーションを設定します"
        @reset="resetMap.bubbleAnimation"
      >
        <select v-model="base.bubbleAnimation" class="select select-bordered w-full max-w-xs">
          <option v-for="animation in animationOptions" :key="animation" :value="animation">
            {{ getAnimationDisplayName(animation) }}
          </option>
        </select>
      </SettingItem>

      <!-- アニメーションプレビュー -->
      <div class="mt-4 p-4 bg-base-200 rounded-lg">
        <div class="text-sm text-base-content/70 mb-2">プレビュー:</div>
        <div class="chat chat-start" :class="`animate-${base.bubbleAnimation}`">
          <div class="chat-bubble chat-bubble-primary">このアニメーションでフキダシが表示されます</div>
        </div>
      </div>
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

  <!-- 設定情報 -->
  <SectionCard>
    <template #header>
      <div>設定情報</div>
    </template>

    <template #body>
      <InformationCard>
        <div class="space-y-2 text-sm">
          <p><strong>現在の設定:</strong></p>
          <ul class="list-disc list-inside space-y-1 ml-4">
            <li>表示サイズ: {{ displaySizeLabels[base.displaySize] }}</li>
            <li>
              フォント: {{ base.fontFamily ? fontFamilyLabels[base.fontFamily] || base.fontFamily : 'デフォルト' }}
            </li>
            <li>テーマ: {{ getThemeDisplayName(base.daisyUiTheme) }}</li>
            <li>アニメーション: {{ getAnimationDisplayName(base.bubbleAnimation) }}</li>
            <li>キャラクターアイコン: {{ base.showCharacterIcon ? '表示' : '非表示' }}</li>
            <li>トースト通知: {{ base.showToasts ? '有効' : '無効' }}</li>
          </ul>
        </div>
      </InformationCard>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { displaySize, displaySizeLabels, DisplaySize } from '@shared/types'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import { fontFamilyLabel } from '@/MainGenerator/scripts/useFontFamily'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import InformationCard from '@ConfigComponents/parts/InformationCard.vue'
  import { storeToRefs } from 'pinia'
  import { BaseSettingsSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { animationLabel } from '@/types/BotComponents/animation'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

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

  // 選択肢の定義
  const displaySizeOptions: DisplaySize[] = [...displaySize]
  const animationOptions = [...animationLabel]
  const themeOptions = [...themes]
  const fontFamilyOptions = [...fontFamilyLabel]

  // フォントファミリーのラベル（実際の定義に合わせて調整してください）
  const fontFamilyLabels: Record<string, string> = {
    system: 'システムフォント',
    serif: '明朝体',
    'sans-serif': 'ゴシック体',
    monospace: '等幅フォント',
    cursive: '筆記体',
    fantasy: '装飾フォント',
    // 必要に応じて他のフォントラベルを追加
  }

  // テーマ表示名の取得
  const getThemeDisplayName = (theme: string): string => {
    const themeLabels: Record<string, string> = {
      light: 'ライト',
      dark: 'ダーク',
      cupcake: 'カップケーキ',
      bumblebee: 'バンブルビー',
      emerald: 'エメラルド',
      corporate: 'コーポレート',
      synthwave: 'シンセウェーブ',
      retro: 'レトロ',
      cyberpunk: 'サイバーパンク',
      valentine: 'バレンタイン',
      halloween: 'ハロウィン',
      garden: 'ガーデン',
      forest: 'フォレスト',
      aqua: 'アクア',
      lofi: 'ローファイ',
      pastel: 'パステル',
      fantasy: 'ファンタジー',
      wireframe: 'ワイヤーフレーム',
      black: 'ブラック',
      luxury: 'ラグジュアリー',
      dracula: 'ドラキュラ',
      cmyk: 'CMYK',
      autumn: 'オータム',
      business: 'ビジネス',
      acid: 'アシッド',
      lemonade: 'レモネード',
      night: 'ナイト',
      coffee: 'コーヒー',
      winter: 'ウィンター',
    }
    return themeLabels[theme] || theme
  }

  // アニメーション表示名の取得
  const getAnimationDisplayName = (animation: string): string => {
    const animationLabels: Record<string, string> = {
      slideUp: 'スライドアップ',
      slideDown: 'スライドダウン',
      slideLeft: 'スライド左',
      slideRight: 'スライド右',
      fadeIn: 'フェードイン',
      zoomIn: 'ズームイン',
      bounce: 'バウンス',
      flash: 'フラッシュ',
      pulse: 'パルス',
      shake: 'シェイク',
      swing: 'スイング',
      tada: 'タダー',
      wobble: 'ウォブル',
      jello: 'ジェロ',
      heartBeat: 'ハートビート',
      // 必要に応じて他のアニメーションラベルを追加
    }
    return animationLabels[animation] || animation
  }

  // 共通リセット関数
  const resetField = (field: keyof typeof base.value) => {
    const schema = BaseSettingsSchema.shape[field]
    let defaultValue: any

    try {
      // schemaからデフォルト値を取得
      if ('_def' in schema && schema._def.defaultValue) {
        defaultValue = schema._def.defaultValue()
      } else {
        // catchされた値やdefaultを試す
        defaultValue = schema.parse(undefined)
      }
    } catch {
      // パースに失敗した場合は、スキーマ定義の初期値を使用
      const schemaDefaults = {
        displaySize: 'md',
        bubbleAnimation: 'slideUp',
        fontFamily: undefined,
        showCharacterIcon: true,
        showToasts: true,
        daisyUiTheme: 'dark',
      }
      defaultValue = schemaDefaults[field]
    }

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

<style scoped>
  /* アニメーションクラスの定義（必要に応じて） */
  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* 他のアニメーションも必要に応じて追加 */
</style>
