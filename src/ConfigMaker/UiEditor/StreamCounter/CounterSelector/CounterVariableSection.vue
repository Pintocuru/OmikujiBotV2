<!-- src/ConfigMaker/UiEditor/StreamCounter/CounterSelector/CounterVariableSection.vue -->
<template>
  <SettingItem label="変数カウンター" description="変数プレースホルダー名とラベルを入力">
    <div class="flex flex-col gap-3">
      <!-- 追加フォーム -->
      <div class="flex flex-wrap gap-2 items-end">
        <div class="form-control">
          <label class="label"><span class="label-text-alt">変数名</span></label>
          <input
            v-model="variableInput.target"
            type="text"
            placeholder="point など"
            class="input input-bordered input-sm w-32"
          />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text-alt">表示名</span></label>
          <input
            v-model="variableInput.label"
            type="text"
            placeholder="ポイント"
            class="input input-bordered input-sm w-32"
          />
        </div>
        <button
          class="btn btn-sm btn-primary"
          :disabled="!variableInput.target || !variableInput.label || addDisabled"
          @click="addVariable"
        >
          追加
        </button>
      </div>

      <!-- 登録済み一覧 -->
      <div class="flex flex-col gap-2">
        <template v-for="c in variableItems" :key="c.id">
          <!-- 編集モード -->
          <div v-if="editingId === c.id" class="flex flex-wrap gap-2 items-end">
            <div class="form-control">
              <label class="label"><span class="label-text-alt">変数名</span></label>
              <input
                v-model="editingInput.target"
                type="text"
                class="input input-bordered input-sm w-32"
                @keyup.enter="commitEdit"
                @keyup.esc="cancelEdit"
              />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text-alt">表示名</span></label>
              <input
                v-model="editingInput.label"
                type="text"
                class="input input-bordered input-sm w-32"
                @keyup.enter="commitEdit"
                @keyup.esc="cancelEdit"
              />
            </div>
            <button class="btn btn-sm btn-success" @click="commitEdit">保存</button>
            <button class="btn btn-sm btn-ghost" @click="cancelEdit">キャンセル</button>
          </div>

          <!-- 表示モード -->
          <div v-else class="badge badge-accent gap-2">
            <button class="btn btn-ghost btn-xs px-0 min-h-0 h-auto" @click="startEdit(c)">
              <Pencil class="w-3 h-3" />
            </button>
            {{ c.label }} ({{ c.target }})
            <button class="btn btn-ghost btn-xs px-0 min-h-0 h-auto" @click="emit('remove', c.id)">
              <X class="w-3 h-3" />
            </button>
          </div>
        </template>
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { reactive, ref, computed } from 'vue'
  import { Pencil, X } from 'lucide-vue-next'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import type { CounterItem } from './counterTypes'

  const props = defineProps<{
    counters: CounterItem[]
    addDisabled: boolean // maxCounters 到達時
  }>()

  const emit = defineEmits<{
    (e: 'add', item: Omit<CounterItem, 'id'>): void
    (e: 'remove', id: string): void
    (e: 'update', payload: { id: string; patch: { target: string; label: string } }): void
  }>()

  const variableInput = reactive({ target: '', label: '' })
  const editingId = ref<string | null>(null)
  const editingInput = reactive({ target: '', label: '' })

  const variableItems = computed(() => props.counters.filter((c) => c.type === 'variable'))

  const addVariable = () => {
    if (!variableInput.target || !variableInput.label || props.addDisabled) return
    emit('add', { type: 'variable', target: variableInput.target, label: variableInput.label })
    variableInput.target = ''
    variableInput.label = ''
  }

  const startEdit = (c: CounterItem) => {
    editingId.value = c.id
    editingInput.target = c.target
    editingInput.label = c.label ?? ''
  }

  const commitEdit = () => {
    if (!editingId.value || !editingInput.target || !editingInput.label) return
    emit('update', { id: editingId.value, patch: { target: editingInput.target, label: editingInput.label } })
    editingId.value = null
  }

  const cancelEdit = () => {
    editingId.value = null
  }
</script>
