<!-- src/ConfigMaker/components/appItems/navigation/SidebarItemMenu.vue -->
<template>
  <div class="dropdown dropdown-end" @click.stop>
    <button tabindex="0" class="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity">
      <MoreHorizontal class="w-3 h-3" />
    </button>

    <ul
      tabindex="0"
      class="dropdown-content menu z-50 w-32 rounded-md border border-base-300 bg-base-100 shadow-lg p-1"
    >
      <!-- 有効/無効 -->
      <li>
        <button class="flex items-center gap-2 text-xs" @click="handleToggle">
          <component :is="item.isEnabled === false ? Eye : EyeOff" class="w-3 h-3" />
          {{ item.isEnabled === false ? '有効にする' : '無効にする' }}
        </button>
      </li>

      <!-- 複製 -->
      <li>
        <button class="flex items-center gap-2 text-xs" @click="handleDuplicate">
          <Copy class="w-3 h-3" />
          複製
        </button>
      </li>

      <li class="menu-title p-0"><hr class="border-base-300" /></li>

      <!-- 削除 -->
      <li>
        <button
          class="flex items-center gap-2 text-xs text-error hover:bg-error hover:text-error-content"
          @click="handleDelete"
        >
          <Trash2 class="w-3 h-3" />
          削除
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { Eye, EyeOff, Copy, Trash2, MoreHorizontal } from 'lucide-vue-next'
  import { RecordCategoryType } from '@/types/OmikujiData/'
  import { BaseRecordType } from '@shared/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

  const props = defineProps<{
    item: BaseRecordType
    category: RecordCategoryType
  }>()

  const omikujiStore = useOmikujiStore()
  const navigationStore = useNavigationStore()

  // フォーカスを外してdropdownを閉じる
  const close = () => {
    ;(document.activeElement as HTMLElement)?.blur()
  }

  const handleToggle = () => {
    omikujiStore.updateItem(props.category, props.item.key, {
      ...props.item,
      isEnabled: !Boolean(props.item.isEnabled),
    })
    swalToast.success({ title: '有効・無効をを更新しました' })
    close()
  }

  const handleDuplicate = () => {
    omikujiStore.duplicateItem(props.category, props.item.key)
    swalToast.success({ title: 'イベントを複製しました' })
    close()
  }

  const handleDelete = async () => {
    close()
    const name = props.item.name || '名前未設定'
    const result = await swalModal.confirmDelete({
      title: `「${name}」を削除しますか？`,
    })
    if (!result.isConfirmed) return

    navigationStore.selectNextItem()
    omikujiStore.removeItem(props.category, props.item.key)
    swalToast.success({ title: `「${name}」を削除しました` })
  }
</script>
