<!-- src\ConfigMaker\components\characters\CustomClassSelector.vue -->
<template>
  <div class="space-y-4">
    <!-- プリセットボタン群 -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="preset in PRESETS"
        :key="preset.label"
        type="button"
        class="btn btn-sm"
        @click="applyPreset(preset.classes)"
      >
        {{ preset.label }}
      </button>
    </div>

    <!-- カスタム設定アコーディオン -->
    <SectionCard icon="Settings2" variant="primary" title="カスタム設定" description="フキダシの詳細設定を調整します">
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
            <div>
              <label class="label"><span class="label-text">太さ</span></label>
              <span
                v-for="option in BORDER_WIDTH_OPTIONS"
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
                v-for="color in BORDER_COLOR_OPTIONS"
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
            v-for="radius in BORDER_RADIUS_OPTIONS"
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
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import { watch, onMounted } from 'vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import {
    useClassGenerator,
    PRESETS,
    BORDER_WIDTH_OPTIONS,
    BORDER_COLOR_OPTIONS,
    BORDER_RADIUS_OPTIONS,
  } from './useClassGenerator'

  // Props & Emits
  const props = defineProps<{ modelValue?: string }>()
  const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

  // Composableの使用
  const { settings, updateClasses, parseClasses, applyPreset } = useClassGenerator(emit)

  // 初期化
  onMounted(() => props.modelValue && parseClasses(props.modelValue))
  watch(
    () => props.modelValue,
    (newValue) => newValue && parseClasses(newValue)
  )
</script>
