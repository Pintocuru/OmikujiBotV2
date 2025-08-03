<!-- src/MainGenerator/userVisits/ViewUserCard.vue -->
<template>
 <div
  :class="[
   'bg-white rounded-lg shadow-sm hover:shadow-md transition-all border',
   draggable ? 'cursor-move' : '',
   'p-1 relative'
  ]"
 >
  <!-- 非表示ボタン -->
  <div class="absolute top-2 right-2 z-10">
   <button
    @click="$emit('hide-user', user.userId)"
    class="text-red-500 hover:text-red-700 text-xs"
    title="非表示"
   >
    <EyeOff class="w-4 h-4" />
   </button>
  </div>

  <!-- User Header -->
  <div class="flex items-start gap-2">
   <img
    :src="user.profileImage"
    :alt="user.name"
    class="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
   />
   <div class="flex-1 min-w-0">
    <h3 class="text-sm font-semibold text-gray-800 truncate pb-1">
     {{ user.name }}
     <!-- ステータス -->
     <span class="text-xs text-gray-500">
      <span v-if="displaySettings.service" class="text-xs text-gray-500">
       ({{ getServiceLabel(user.service) }})
      </span>
      <!-- ステータス ＋ その他の項目を横並びに -->
      <!-- ステータス（初見） -->
      <span
       v-if="displaySettings.isSyoken"
       class="inline-flex items-center px-1 py-0.5 rounded-full font-medium"
       :class="user.isSyoken ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
      >
       {{ user.isSyoken ? '初見' : '' }}
      </span>

      <!-- コメント回数 -->
      <span v-if="displaySettings.count" class="px-1">コメント: {{ user.count }}回</span>

      <!-- ギフト金額 -->
      <span v-if="displaySettings.totalPrice" class="px-1">
       ギフト: ¥{{ user.totalPrice.toLocaleString() }}
      </span>

      <!-- 最終訪問 -->
      <span v-if="displaySettings.timestamp" class="px-1">
       最終: {{ formatTimestamp(user.timestamp) }}
      </span>

      <!-- ID -->
      <span v-if="displaySettings.userId" class="px-1 truncate">ID: {{ user.userId }}</span>
     </span>
    </h3>
    <!-- Custom Properties (横一列) -->
    <div v-if="hasVisibleCustomProperties" class="flex items-center gap-2 text-sm">
     <!-- Custom Color -->
     <div v-if="customPropertySettings.color" class="flex items-center gap-1">
      <Palette class="w-3 h-3 text-gray-400 flex-shrink-0" />
      <ColorPicker
       :model-value="getCustomProperty(user.userId, 'color')"
       @update:model-value="updateCustomProperty(user.userId, 'color', $event)"
       size="sm"
      />
     </div>

     <!-- Custom Score -->
     <div v-if="customPropertySettings.score" class="flex items-center gap-1">
      <Trophy class="w-3 h-3 text-gray-400 flex-shrink-0" />
      <input
       type="number"
       :value="getCustomProperty(user.userId, 'score')"
       @input="
        updateCustomProperty(
         user.userId,
         'score',
         parseInt(($event.target as HTMLInputElement).value) || 0
        )
       "
       class="w-12 px-1 py-0.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
       placeholder="0"
      />
     </div>

     <!-- Custom Status -->
     <div v-if="customPropertySettings.status" class="flex items-center gap-1 flex-1 min-w-0">
      <FileText class="w-3 h-3 text-gray-400 flex-shrink-0" />
      <input
       type="text"
       :value="getCustomProperty(user.userId, 'status')"
       @input="
        updateCustomProperty(user.userId, 'status', ($event.target as HTMLInputElement).value)
       "
       class="w-full px-1 py-0.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
       placeholder="ステータス"
      />
     </div>
    </div>
   </div>
  </div>

  <!-- Drag Handle (when draggable) -->
  <div v-if="draggable" class="absolute top-2 right-2">
   <GripVertical class="w-3 h-3 text-gray-300" />
  </div>
 </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { Palette, Trophy, FileText, GripVertical, EyeOff } from 'lucide-vue-next';
import ColorPicker from '@ConfigComponents/parts/ColorPicker.vue';
import { UserVisitType } from '@shared/types/subscribe/UserVisitSchema';
import { ServiceType } from '@onecomme.com/onesdk/types/Service';
import { serviceLabels } from './constants';

interface Props {
 user: UserVisitType;
 displaySettings: Record<string, boolean>;
 customPropertySettings: Record<string, boolean>;
 draggable?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
 'update-custom-property': [userId: string, property: any, value: any];
 'hide-user': [userId: string];
}>();

const hasVisibleCustomProperties = computed(() => {
 return Object.values(props.customPropertySettings).some((visible) => visible);
});

const getServiceLabel = (service: ServiceType | undefined) => {
 return service ? serviceLabels[service] || service : '';
};

const getCustomProperty = (userId: string, property: string) => {
 // UserVisitType に customData が含まれている場合
 const customData = (props.user as any).customData;
 return (
  customData?.[property] || (property === 'color' ? '#3B82F6' : property === 'score' ? 0 : '')
 );
};

const updateCustomProperty = (userId: string, property: string, value: any) => {
 emit('update-custom-property', userId, property, value);
};

const formatTimestamp = (timestamp: string) => {
 return new Date(timestamp).toLocaleString('ja-JP', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
 });
};
</script>
