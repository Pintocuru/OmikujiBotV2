<!-- src/MainGenerator/userVisits/ViewUserVisits.vue -->
<!-- ! このコード郡は「ユーザーに属性付けるプラグイン」で使います -->
<template>
 <div class="max-w-6xl mx-auto p-4 min-h-screen max-h-screen overflow-hidden flex flex-col">
  <!-- Header Component -->
  <ViewUserHeader
   :show-display-settings="showDisplaySettings"
   :show-team-display="showTeamDisplay"
   :display-settings="displaySettings"
   :filter-settings="filterSettings"
   :custom-property-settings="customPropertySettings"
   :sort-by="sortBy"
   :total-users="totalUsers"
   :syoken-users="syokenUsers"
   :score-statistics="scoreStatistics"
   :status-statistics="statusStatistics"
   :service-statistics="serviceStatistics"
   @update:show-display-settings="showDisplaySettings = $event"
   @update:show-team-display="showTeamDisplay = $event"
   @toggle-display="toggleDisplay"
   @toggle-filter="toggleFilter"
   @toggle-custom-property="toggleCustomProperty"
   @set-sort-option="setSortOption"
   @add-user="addUser"
   @reset-filters="resetFilters"
  />

  <!-- Scrollable Content Area -->
  <div class="flex-1 overflow-y-auto">
   <!-- Team Display (Color Groups) -->
   <div v-if="showTeamDisplay" class="space-y-4">
    <div v-for="colorGroup in colorGroups" :key="colorGroup.color" class="mb-3">
     <div class="flex items-center gap-2 mb-2">
      <div
       :style="{ backgroundColor: colorGroup.color }"
       class="w-4 h-4 rounded-full border border-gray-300 whitespace-nowrap"
      ></div>
      <span class="text-sm font-medium text-gray-700 whitespace-nowrap">
       チーム ({{ colorGroup.count }}人)
      </span>
      <span class="text-xs text-gray-500 ml-2">
       平均スコア: {{ Math.round(colorGroup.averageScore) }}
      </span>
     </div>
     <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <ViewUserCard
       v-for="user in colorGroup.users"
       :key="user.userId"
       :user="user"
       :display-settings="displaySettings"
       :custom-property-settings="customPropertySettings"
       @update-custom-property="updateUserCustomProperty"
       @hide-user="hideUser"
      />
     </div>
    </div>
   </div>

   <!-- Regular User List with vuedraggable -->
   <div v-else class="pb-4">
    <draggable
     v-model="draggableUsers"
     :disabled="sortBy !== 'manual'"
     item-key="userId"
     class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
     ghost-class="ghost"
     chosen-class="chosen"
     drag-class="drag"
     :force-fallback="true"
    >
     <template #item="{ element: user }">
      <div :key="user.userId" class="draggable-item">
       <ViewUserCard
        :user="user"
        :display-settings="displaySettings"
        :custom-property-settings="customPropertySettings"
        :draggable="sortBy === 'manual'"
        @update-custom-property="updateUserCustomProperty"
        @hide-user="hideUser"
       />
      </div>
     </template>
    </draggable>

    <!-- Hidden Users List -->
    <div v-if="hiddenUsersList.length > 0" class="mt-6 border-t pt-4">
     <h3 class="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
      <EyeOff class="w-4 h-4" />
      非表示ユーザー ({{ hiddenUsersList.length }}人)
     </h3>
     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      <div
       v-for="user in hiddenUsersList"
       :key="user.userId"
       class="bg-gray-100 p-3 rounded-lg border-2 border-dashed border-gray-300"
      >
       <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
         <div class="text-sm text-gray-600">{{ user.name }}</div>
         <div class="text-xs text-gray-500">({{ user.service }})</div>
        </div>
        <button
         @click="unhideUser(user.userId)"
         class="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 bg-white rounded border"
        >
         表示
        </button>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { toRef, computed } from 'vue';
import { ServiceVisitType } from '@omiken/shared/sdk/subscribe/GetUserVisits';
import ViewUserCard from './ViewUserCard.vue';
import ViewUserHeader from './ViewUserHeader.vue';
import { useUserVisits } from './useUserVisits';
import { UserVisitPlus } from './useCustomProperties';
import { EyeOff } from 'lucide-vue-next';
import draggable from 'vuedraggable';

// Props
const props = defineProps<{
 userVisitsData: Record<string, ServiceVisitType> | null;
}>();

// Use composables
const {
 // Display settings
 showDisplaySettings,
 showTeamDisplay,
 displaySettings,
 toggleDisplay,

 // Filter and sort
 nameFilter,
 syokenFilter,
 serviceFilter,
 statusFilter,
 minScore,
 maxScore,
 sortBy,
 sortOrder,
 filteredUsers,
 resetFilters,

 // Custom properties
 customPropertySettings,
 updateUserCustomProperty,
 toggleCustomProperty,

 // User management
 hideUser,
 unhideUser,
 addUser,
 updateManualOrder,

 // Statistics
 totalUsers,
 syokenUsers,
 hiddenUsersList,
 colorGroups,
 scoreStatistics,
 statusStatistics,
 serviceStatistics
} = useUserVisits(toRef(props, 'userVisitsData'));

// Filter settings object for header component
const filterSettings = computed(() => ({
 nameFilter: nameFilter.value,
 syokenFilter: syokenFilter.value,
 serviceFilter: serviceFilter.value,
 statusFilter: statusFilter.value,
 minScore: minScore.value,
 maxScore: maxScore.value
}));

// Filter toggle functions for header component
const toggleFilter = (filterKey: string) => {
 switch (filterKey) {
  case 'syoken':
   syokenFilter.value = !syokenFilter.value;
   break;
 }
};

// Sort option setter for header component
const setSortOption = (option: string) => {
 if (sortBy.value === option) {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
 } else {
  sortBy.value = option;
  sortOrder.value = 'asc';
 }
};

// Draggable用のcomputed
const draggableUsers = computed({
 get(): UserVisitPlus[] {
  return filteredUsers.value;
 },
 set(value: UserVisitPlus[]) {
  if (sortBy.value === 'manual') {
   updateManualOrder(value);
  }
 }
});
</script>

<style scoped>
.ghost {
 opacity: 0.5;
 background: #c8ebfb;
}

.chosen {
 cursor: grabbing;
 transform: scale(1.02);
}

.drag {
 transform: rotate(5deg);
}

.draggable-item {
 transition: transform 0.2s ease;
}
</style>
