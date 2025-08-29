<!-- src\ConfigMaker\components\characters\CustomClassSelector.vue -->
<template>
  <div class="space-y-4">
    <!-- プリセットボタン群 -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="preset in presets"
        :key="preset.label"
        type="button"
        class="btn btn-sm"
        @click="applyPreset(preset.classes)"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
  <!-- カスタム設定アコーディオン -->
  <SectionCard variant="primary" :isOpen="false">
    <template #header>
      <div>カスタム設定</div>
    </template>

    <template #body>
      <div class="space-y-4">
        <!-- Padding設定 -->
        <SettingItem label="余白設定" description="要素の内側の余白を調整します">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text">左右: px-{{ settings.paddingX }}</span>
              </label>
              <input
                type="range"
                min="0"
                max="12"
                v-model.number="settings.paddingX"
                class="range range-primary range-sm"
                @input="updateClasses"
              />
            </div>
            <div>
              <label class="label">
                <span class="label-text">上下: py-{{ settings.paddingY }}</span>
              </label>
              <input
                type="range"
                min="0"
                max="12"
                v-model.number="settings.paddingY"
                class="range range-secondary range-sm"
                @input="updateClasses"
              />
            </div>
          </div>
        </SettingItem>

        <!-- Border設定 -->
        <SettingItem label="枠線設定" description="要素の枠線の太さと色を設定します">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="">
              <label class="label"><span class="label-text">太さ</span></label>

              <span
                v-for="option in borderWidthOptions"
                :key="`label-${option.value}`"
                class="join-item btn btn-sm"
                :class="{ 'btn-active': settings.borderWidth === option.value }"
                @click="((settings.borderWidth = option.value), updateClasses())"
              >
                {{ option.label }}
              </span>
            </div>

            <div v-if="settings.borderWidth !== 'border-0'">
              <label class="label"><span class="label-text">色</span></label>

              <span
                v-for="color in borderColorOptions"
                :key="`label-${color.value}`"
                class="join-item btn btn-sm"
                :class="{ 'btn-active': settings.borderColor === color.value }"
                @click="((settings.borderColor = color.value), updateClasses())"
              >
                {{ color.label }}
              </span>
            </div>
          </div>
        </SettingItem>

        <!-- Border Radius設定 -->
        <SettingItem label="角丸設定" description="要素の角の丸みを調整します">
          <span
            v-for="radius in borderRadiusOptions"
            :key="`label-${radius.value}`"
            class="join-item btn btn-sm"
            :class="{ 'btn-active': settings.borderRadius === radius.value }"
            @click="((settings.borderRadius = radius.value), updateClasses())"
          >
            {{ radius.label }}
          </span>
        </SettingItem>

        <!-- カスタムクラス入力 -->
        <SettingItem label="追加クラス" description="その他のTailwindCSSクラスを直接入力できます">
          <input
            type="text"
            class="input input-bordered w-full"
            placeholder="例: shadow-lg hover:shadow-xl transition-all"
            v-model="settings.customClasses"
            @input="updateClasses"
          />
        </SettingItem>
      </div>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { reactive, watch, onMounted } from 'vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'

  interface Preset {
    label: string
    classes: string
  }

  interface Settings {
    paddingX: number
    paddingY: number
    borderWidth: string
    borderColor: string
    borderRadius: string
    customClasses: string
  }

  // Props & Emits
  const props = defineProps<{ modelValue?: string }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

  // 設定オプション
  const borderWidthOptions = [
    { label: 'なし', value: 'border-0' },
    { label: '1px', value: 'border' },
    { label: '2px', value: 'border-2' },
    { label: '4px', value: 'border-4' },
  ]

  const borderColorOptions = [
    { label: '白', value: 'border-white' },
    { label: '黒', value: 'border-black' },
  ]

  const borderRadiusOptions = [
    { label: 'なし', value: 'rounded-none' },
    { label: '標準', value: 'rounded-md' },
    { label: '大', value: 'rounded-xl' },
    { label: 'Full', value: 'rounded-full' },
  ]

  // プリセット定義
  const presets: Preset[] = [
    { label: 'デフォルト', classes: 'px-4 py-4 rounded-xl' },
    { label: 'ラウンド', classes: 'px-8 py-2 rounded-full' },
    { label: 'カード', classes: 'px-6 py-6 mt-2 border border-white rounded-md' },
    { label: 'ボタン', classes: 'px-6 py-2 border-2 border-white rounded-md' },
    { label: 'ミニマル', classes: 'px-2 py-2 rounded-none' },
  ]

  // リアクティブな設定
  const settings = reactive<Settings>({
    paddingX: 4,
    paddingY: 4,
    borderWidth: 'border',
    borderColor: 'border-white',
    borderRadius: 'rounded-xl',
    customClasses: '',
  })

  // ユーティリティ関数
  const generateClasses = (): string => {
    const classes: string[] = []

    if (settings.paddingX > 0) classes.push(`px-${settings.paddingX}`)
    if (settings.paddingY > 0) classes.push(`py-${settings.paddingY}`)

    if (settings.borderWidth !== 'border-0') {
      classes.push(settings.borderWidth, settings.borderColor)
    }

    if (settings.borderRadius !== 'rounded-none') {
      classes.push(settings.borderRadius)
    }

    if (settings.customClasses.trim()) {
      classes.push(settings.customClasses.trim())
    }

    return classes.filter(Boolean).join(' ')
  }

  const updateClasses = () => emit('update:modelValue', generateClasses())

  const parseClasses = (classString: string) => {
    const classes = classString.split(' ')
    const parsers: Record<string, (cls: string) => void> = {
      'px-': (cls) => (settings.paddingX = parseInt(cls.replace('px-', '')) || 0),
      'py-': (cls) => (settings.paddingY = parseInt(cls.replace('py-', '')) || 0),
      border: (cls) => {
        if (['border', 'border-2', 'border-4'].includes(cls)) settings.borderWidth = cls
        else if (['border-white', 'border-black'].includes(cls)) settings.borderColor = cls
      },
      rounded: (cls) => (settings.borderRadius = cls),
    }

    // Reset
    Object.assign(settings, {
      paddingX: 0,
      paddingY: 0,
      borderWidth: 'border-0',
      borderColor: 'border-white',
      borderRadius: 'rounded-none',
      customClasses: '',
    })

    classes.forEach((cls) => {
      const parser = Object.keys(parsers).find((key) => cls.startsWith(key))
      if (parser) parsers[parser](cls)
    })
  }

  const applyPreset = (classes: string) => {
    parseClasses(classes)
    updateClasses()
  }

  // 初期化
  onMounted(() => props.modelValue && parseClasses(props.modelValue))
  watch(
    () => props.modelValue,
    (newValue) => newValue && parseClasses(newValue)
  )
</script>
