<!-- src\ConfigMaker\components\postAction\items\VariableDeclarationChecker.vue -->
<template>
  <div v-if="hasAnyDeclarations" class="space-y-2">
    <!-- 予約語の変数宣言 -->
    <div v-if="hasReservedDeclarations" class="alert alert-success py-2">
      <span class="text-xs">
        変数プレースホルダー(予約語)
        <span v-for="decl in reservedDeclarations" :key="decl.name + decl.value" class="mx-1">
          {{ decl.name }}={{ decl.value }}
        </span>
      </span>
    </div>

    <!-- カスタム変数宣言 + rand + select -->
    <div v-if="hasCustomDeclarations" class="alert alert-warning py-2">
      <span class="text-xs">
        変数プレースホルダー
        <span v-for="decl in customDeclarations" :key="decl.name + decl.value" class="mx-1">
          var: {{ decl.name }} = {{ decl.value }}
        </span>
        <span v-for="(func, index) in randFunctions" :key="'rand-' + index" class="mx-1">
          rand({{ func.min }},{{ func.max }})
        </span>
        <span v-for="(func, index) in selectFunctions" :key="'select-' + index" class="mx-1">
          select({{ func.options }})
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { AlertCircle } from 'lucide-vue-next'
  import {
    RAND_PATTERN,
    RESERVED_KEYS,
    SELECT_PATTERN,
    VAR_DECLARATION_PATTERN,
  } from '@main/scripts/VariablePlaceholder/ReservedKeys'

  // Props
  const props = defineProps<{
    text: string
  }>()

  interface VariableDeclaration {
    name: string
    value: string
  }

  interface RandFunction {
    min: string
    max: string
  }

  interface SelectFunction {
    options: string
  }

  // テキスト内の変数宣言を全て抽出
  const allVariableDeclarations = computed<VariableDeclaration[]>(() => {
    const matches = props.text.matchAll(VAR_DECLARATION_PATTERN)
    const declarations: VariableDeclaration[] = []

    for (const match of matches) {
      if (match[1] && match[2]) {
        declarations.push({
          name: match[1].trim(),
          value: match[2].trim(),
        })
      }
    }

    return declarations
  })

  // rand関数を抽出
  const randFunctions = computed<RandFunction[]>(() => {
    const matches = props.text.matchAll(RAND_PATTERN)
    const functions: RandFunction[] = []

    for (const match of matches) {
      if (match[1] && match[2]) {
        functions.push({
          min: match[1],
          max: match[2],
        })
      }
    }

    return functions
  })

  // select関数を抽出
  const selectFunctions = computed<SelectFunction[]>(() => {
    const matches = props.text.matchAll(SELECT_PATTERN)
    const functions: SelectFunction[] = []

    for (const match of matches) {
      if (match[1]) {
        functions.push({
          options: match[1].trim(),
        })
      }
    }

    return functions
  })

  // 予約語を使った変数宣言
  const reservedDeclarations = computed(() => {
    return allVariableDeclarations.value.filter((decl) => RESERVED_KEYS.includes(decl.name))
  })

  // カスタム変数宣言（予約語以外）
  const customDeclarations = computed(() => {
    return allVariableDeclarations.value.filter((decl) => !RESERVED_KEYS.includes(decl.name))
  })

  // 予約語の宣言が存在するかチェック
  const hasReservedDeclarations = computed(() => reservedDeclarations.value.length > 0)

  // カスタム宣言・関数が存在するかチェック
  const hasCustomDeclarations = computed(
    () => customDeclarations.value.length > 0 || randFunctions.value.length > 0 || selectFunctions.value.length > 0
  )

  // 何らかの宣言が存在するかチェック
  const hasAnyDeclarations = computed(() => hasReservedDeclarations.value || hasCustomDeclarations.value)
</script>
