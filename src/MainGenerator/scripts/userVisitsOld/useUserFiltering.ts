// src/MainGenerator/userVisits/useUserFiltering.ts
import { ref, computed, Ref } from 'vue';
import { UserVisitPlus, CustomProperties } from './useCustomProperties';
import { UserVisitType } from '@omiken/shared/types/';

export const useUserFiltering = (
 allUsers: Ref<UserVisitPlus[]>,
 hiddenUsers: Ref<Set<string>>,
 manualOrder: Ref<string[]>,
 getCustomProperty: <T extends UserVisitType>(user: T, property: keyof CustomProperties) => any
) => {
 // Filter settings
 const nameFilter = ref('');
 const syokenFilter = ref(false);
 const serviceFilter = ref('');
 const statusFilter = ref('');
 const minScore = ref(0);
 const maxScore = ref(100);

 // Sort settings
 const sortBy = ref('name');
 const sortOrder = ref<'asc' | 'desc'>('asc');

 // Filtered and sorted users
 const filteredUsers = computed((): UserVisitPlus[] => {
  let users = allUsers.value.filter((user) => {
   // Hidden users filter
   if (hiddenUsers.value.has(user.userId)) return false;

   // Name filter
   if (nameFilter.value && !user.name.toLowerCase().includes(nameFilter.value.toLowerCase())) {
    return false;
   }

   // Syoken filter
   if (syokenFilter.value && !user.isSyoken) return false;

   // Service filter
   if (serviceFilter.value && user.service !== serviceFilter.value) return false;

   // Status filter
   if (statusFilter.value) {
    const userStatus = getCustomProperty(user, 'status') || '';
    if (!userStatus.toLowerCase().includes(statusFilter.value.toLowerCase())) {
     return false;
    }
   }

   // Score filter
   const userScore = getCustomProperty(user, 'score') || 0;
   if (userScore < minScore.value || userScore > maxScore.value) {
    return false;
   }

   return true;
  });

  // Apply sorting
  users.sort((a, b) => {
   let aValue: any;
   let bValue: any;

   switch (sortBy.value) {
    case 'name':
     aValue = a.name.toLowerCase();
     bValue = b.name.toLowerCase();
     break;

    case 'score':
     aValue = getCustomProperty(a, 'score') || 0;
     bValue = getCustomProperty(b, 'score') || 0;
     break;

    case 'status':
     aValue = getCustomProperty(a, 'status') || '';
     bValue = getCustomProperty(b, 'status') || '';
     break;

    case 'timestamp':
     aValue = new Date(a.timestamp).getTime();
     bValue = new Date(b.timestamp).getTime();
     break;

    case 'totalPrice':
     aValue = a.totalPrice;
     bValue = b.totalPrice;
     break;

    case 'count':
     aValue = a.count;
     bValue = b.count;
     break;

    case 'manual':
     const aIndex = manualOrder.value.indexOf(a.userId);
     const bIndex = manualOrder.value.indexOf(b.userId);
     aValue = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
     bValue = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
     break;

    default:
     aValue = a.name.toLowerCase();
     bValue = b.name.toLowerCase();
   }

   if (typeof aValue === 'string' && typeof bValue === 'string') {
    return sortOrder.value === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
   } else {
    return sortOrder.value === 'asc'
     ? (aValue as number) - (bValue as number)
     : (bValue as number) - (aValue as number);
   }
  });

  return users;
 });

 // Reset filters
 const resetFilters = () => {
  nameFilter.value = '';
  syokenFilter.value = false;
  serviceFilter.value = '';
  statusFilter.value = '';
  minScore.value = 0;
  maxScore.value = 100;
 };

 // Filter by color (for team display)
 const filterByColor = (color: string) => {
  return filteredUsers.value.filter((user) => {
   const userColor = getCustomProperty(user, 'color') || '#3B82F6';
   return userColor === color;
  });
 };

 return {
  // Filter settings
  nameFilter,
  syokenFilter,
  serviceFilter,
  statusFilter,
  minScore,
  maxScore,

  // Sort settings
  sortBy,
  sortOrder,

  // Computed data
  filteredUsers,

  // Actions
  resetFilters,
  filterByColor
 };
};
