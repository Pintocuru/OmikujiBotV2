<!-- src/ConfigMaker/components/common/BaseDialog/BaseEditDialog.vue -->

<template>
  <dialog ref="dialogRef" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box w-11/12 max-w-5xl h-[80vh] flex flex-col overflow-hidden">
      <!-- ヘッダー -->
      <div class="pb-4 shrink-0">
        <SubSectionHeader :icon="icon" :title="title">
          <button class="btn btn-sm btn-ghost btn-circle" @click="handleCancel">
            <X :size="16" />
          </button>
        </SubSectionHeader>
      </div>

      <!-- 本体: 左サイドバー・メイン・右サイドバー -->
      <div class="flex flex-1 min-h-0 divide-x divide-base-300">
        <!-- 左サイドバー (オプション) -->
        <div v-if="$slots['sidebar-left']" class="hidden md:flex w-60 shrink-0 flex-col bg-base-100">
          <slot name="sidebar-left" />
        </div>

        <!-- メインコンテンツ -->
        <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <slot />
        </div>

        <!-- 右サイドバー (オプション) -->
        <div v-if="$slots['sidebar-right']" class="hidden lg:flex w-72 shrink-0 flex-col bg-base-100">
          <slot name="sidebar-right" />
        </div>
      </div>

      <!-- フッター -->
      <div class="flex justify-between items-center px-4 py-2 border-t border-base-300 bg-base-200 shrink-0">
        <!-- 左側: 任意の補足情報スロット -->
        <div class="text-xs text-base-content">
          <slot name="footer-info" />
        </div>

        <div class="flex gap-2">
          <button class="btn btn-sm btn-ghost" @click="handleCancel">キャンセル</button>
          <button class="btn btn-sm btn-primary gap-1" @click="handleSave">
            <Check :size="14" />
            保存して閉じる
          </button>
        </div>
      </div>
    </div>

    <!-- バックドロップクリックでキャンセル -->
    <form method="dialog" class="modal-backdrop">
      <button @click="handleCancel">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { X, Check } from 'lucide-vue-next'
  import { LucideIconName } from '@shared/utils/LucideIcon/useLucideIcon'

  defineProps<{
    title: string /** SubSectionHeader に渡すタイトル */
    icon: LucideIconName /** SubSectionHeader に渡すアイコン名 (lucide) */
  }>()

  const emit = defineEmits<{
    save: [] /** 保存ボタン押下 */
    cancel: [] /** キャンセル / × / バックドロップ押下 */
  }>()

  const dialogRef = ref<HTMLDialogElement | null>(null)

  const handleSave = () => {
    emit('save')
    dialogRef.value?.close()
  }

  const handleCancel = () => {
    emit('cancel')
    dialogRef.value?.close()
  }

  /** 外部から開くための公開メソッド */
  const showModal = () => dialogRef.value?.showModal()
  /** 外部から閉じるための公開メソッド（保存・キャンセル処理は呼ばない） */
  const close = () => dialogRef.value?.close()

  defineExpose({ showModal, close })
</script>
