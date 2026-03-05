<!-- src/ConfigMaker/components/postAction/items/VariableDeclarationChecker.vue -->
<!-- !使用しない -->
<template>
  <div class="space-y-2">
    <!-- 予約語の変数宣言 -->
    <div v-if="hasReservedDeclarations" class="alert alert-success py-2">
      <span class="text-xs">
        予約語
        <span v-for="decl in reservedDeclarations" :key="decl.name + decl.value" class="mx-1">
          {{ decl.name }}={{ decl.value }}
        </span>
      </span>
    </div>

    <!-- カスタム変数宣言 + calc + rand -->
    <div class="alert alert-warning py-2">
      <span class="text-xs">
        <a
          class="link no-underline hover:underline"
          href="https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/core/ConfigEditor/sub/VariablePlaceholder.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          変数プレースホルダー
        </a>

        <span v-for="decl in customDeclarations" :key="decl.name + decl.value" class="mx-1">
          var: {{ decl.name }} = {{ decl.value }}
        </span>

        <span v-for="(func, index) in randFunctions" :key="'rand-' + index" class="mx-1">
          rand({{ func.min }},{{ func.max }})
        </span>
        <span v-if="!hasAnyDeclarations">なし</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PatternMatcher } from '@main/scripts/VariablePlaceholder/PatternMatcher'

  // Props
  const props = defineProps<{
    text: string
  }>()

  // テキスト内の変数宣言を全て抽出
  const allVariableDeclarations = computed(() => {
    return PatternMatcher.extractVariableDeclarations(props.text)
  })

  // rand関数を抽出
  const randFunctions = computed(() => {
    return PatternMatcher.extractRandFunctions(props.text)
  })

  // 予約語を使った変数宣言
  const reservedDeclarations = computed(() => {
    return PatternMatcher.filterReservedDeclarations(allVariableDeclarations.value)
  })

  // カスタム変数宣言（予約語以外）
  const customDeclarations = computed(() => {
    return PatternMatcher.filterCustomDeclarations(allVariableDeclarations.value)
  })

  // 予約語の宣言が存在するかチェック
  const hasReservedDeclarations = computed(() => reservedDeclarations.value.length > 0)

  // カスタム宣言・calc・関数が存在するかチェック
  const hasCustomDeclarations = computed(() => customDeclarations.value.length > 0 || randFunctions.value.length > 0)

  // 何らかの宣言が存在するかチェック
  const hasAnyDeclarations = computed(() => hasReservedDeclarations.value || hasCustomDeclarations.value)
</script>
