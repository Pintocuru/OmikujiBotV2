<!-- src/ConfigMaker/components/appInfo/settings/GeneratorSettingsEditor.vue -->
<template>
  <!-- ジェネレーター設定 -->
  <SubSectionHeader icon="Sparkles" title="ジェネレーター設定" description="UI・効果音など、配信挙動に関わる設定" />

  <!-- 基本ディレイ時間設定 -->
  <SettingItem
    label="投稿の基本遅延時間"
    description="BOTメッセージの表示や投稿を遅延（秒）"
    :showReset="true"
    @reset="resetMap.basicDelaySeconds"
  >
    <div class="flex flex-col gap-2">
      <div class="flex justify-between text-xs">
        <span>{{ settings.basicDelaySeconds }}s</span>
      </div>

      <input
        type="range"
        min="0"
        max="3"
        step="0.5"
        class="range range-accent"
        :value="settings.basicDelaySeconds"
        @input="(e) => updateField('basicDelaySeconds', Number((e.target as HTMLInputElement).value))"
      />
    </div>
  </SettingItem>

  <!-- 効果音を鳴らす -->
  <SettingItem label="効果音を鳴らす" description="BOTの効果音を再生するか">
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" class="toggle toggle-primary" :checked="settings.soundEnabled" @change="handleMuteSound" />
      <span>{{ settings.soundEnabled ? '音を鳴らす' : 'ミュートする' }}</span>
    </label>
  </SettingItem>

  <!-- ツールでのコメントをユーザーリストに入れるか -->
  <SettingItem
    label="外部コメントのリスト入り"
    description="配信中にツールコメントをユーザーとして扱うか"
    :showReset="true"
    @reset="resetMap.includeExternalComments"
  >
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        :checked="settings.includeExternalComments"
        @change="includeExternalComments"
      />
      <span>配信中、ツールのコメントを{{ settings.includeExternalComments ? 'カウントする' : '弾く' }}</span>
    </label>
    <p class="text-xs opacity-70 mt-1">
      ※ 通常は OFF で問題ありません。BOT で賑やかしを行いたい場合のみ ON にしてください
    </p>
  </SettingItem>

  <!-- UI配置モード -->
  <SettingItem label="UI配置モード" description="単体アイテムの表示位置を設定します">
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="option in uiPlacementOptions"
        :key="option.value"
        type="button"
        class="badge badge-lg gap-1 cursor-pointer border-2 transition-all"
        :class="
          settings.uiPlacement === option.value
            ? 'badge-primary border-primary'
            : 'badge-ghost border-base-300 hover:border-primary hover:badge-outline'
        "
        @click="updateField('uiPlacement', option.value)"
      >
        <component :is="option.icon" class="w-3 h-3" />
        {{ option.label }}
      </button>
    </div>
    <p class="text-xs opacity-70 mt-1">
      {{ currentPlacementDescription }}
    </p>
  </SettingItem>

  <!-- VisitUserにユーザーを入れない -->
  <SettingItem
    label="ユーザーを記録しないリスト"
    description="BOTや管理者の名前を正規表現で指定"
    :showReset="true"
    @reset="resetMap.ignoreUserPattern"
  >
    <MessageTextEditor v-model="bubbleText" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsSchema, SoundKeyType, soundMap } from '@/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import type { SettingsType } from '@/types/OmikujiData/SettingsSchema'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import MessageTextEditor from '@config/components/postAction/Message/MessageTextEditor.vue'
  import { playSoundResolved } from '@/common/sounds'
  import { AlignCenter, LayoutTemplate } from 'lucide-vue-next'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const settings = computed(() => data.value.settings)

  const updateField = <K extends keyof SettingsType>(field: K, value: any) => {
    omikujiStore.updateSettings({ [field]: value })
  }

  // 効果音切り替え
  const handleMuteSound = (event: Event) => {
    const checked = (event.target as HTMLInputElement).checked
    updateField('soundEnabled', checked)
  }

  // 外部コメントのリスト入り
  const includeExternalComments = () => {
    updateField('includeExternalComments', !settings.value.includeExternalComments)
  }

  // uiPlacement の選択肢
  const uiPlacementOptions = [
    { value: 'center' as const, label: '中央配置', icon: AlignCenter },
    { value: 'embedded' as const, label: '位置を自動にする', icon: LayoutTemplate },
  ]

  const uiPlacementDescriptions: Record<string, string> = {
    center: '単体のアイテムを画面中央に大きく表示します',
    embedded: '位置指定を行わず、外部レイアウトに従って表示します',
  }

  const currentPlacementDescription = computed(() => uiPlacementDescriptions[settings.value.uiPlacement] ?? '')

  // ignoreUserPattern の双方向バインディング
  const bubbleText = computed<string>({
    get: () => settings.value.ignoreUserPattern ?? '',
    set: (value: string) => {
      const normalized = value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join('|')
      updateField('ignoreUserPattern', normalized)
    },
  })

  const resetField = (field: keyof typeof settings.value) => {
    const defaults = SettingsSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    ignoreUserPattern: () => resetField('ignoreUserPattern'),
    basicDelaySeconds: () => resetField('basicDelaySeconds'),
    includeExternalComments: () => resetField('includeExternalComments'),
  }

  // 効果音: OFF → ON になったときにプレビュー再生
  const playRandomSound = () => {
    const keys = Object.keys(soundMap) as SoundKeyType[]
    if (keys.length === 0) return
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    playSoundResolved(randomKey)
  }

  watch(
    () => settings.value.soundEnabled,
    (newVal, oldVal) => {
      if (!oldVal && newVal) playRandomSound()
    }
  )
</script>
