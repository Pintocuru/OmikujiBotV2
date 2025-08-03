// src/MainGenerator/userVisits/useUserVisits.ts
import { computed, Ref, watch } from 'vue';
import { ServiceType } from '@onecomme.com/onesdk/types/Service';
import { ServiceVisitType, UserVisitType } from '@shared/types/UserVisitSchema';
import { useCustomProperties, UserVisitPlus } from './useCustomProperties';
import { useUserManagement } from './useUserManagement';
import { useUserFiltering } from './useUserFiltering';
import { useDisplaySettings } from './useDisplaySettings';
import { useUserStatistics } from './useUserStatistics';

export const useUserVisits = (userVisitsData: Ref<Record<string, ServiceVisitType> | null>) => {
 // 各機能のフック
 const customPropsHook = useCustomProperties();
 const userManagementHook = useUserManagement();
 const displaySettingsHook = useDisplaySettings();

 // すべてのユーザーデータを統合（カスタムプロパティ付き）
 const allUsers = computed((): UserVisitPlus[] => {
  const users: UserVisitPlus[] = [];

  // 既存のユーザーデータから追加
  Object.entries(userVisitsData.value || {}).forEach(([serviceKey, serviceData]) => {
   Object.values(serviceData.user).forEach((user) => {
    const userWithService = {
     ...user,
     service: serviceData.serviceKey as ServiceType
    };

    // カスタムプロパティを初期化
    const userWithCustom = customPropsHook.initializeCustomProperties(userWithService);
    users.push(userWithCustom);
   });
  });

  // 手動追加されたユーザーを追加
  Object.values(userManagementHook.additionalUsers.value).forEach((user) => {
   const userWithCustom = customPropsHook.initializeCustomProperties(user);
   users.push(userWithCustom);
  });

  return users;
 });

 // フィルタリング機能
 const filteringHook = useUserFiltering(
  allUsers,
  userManagementHook.hiddenUsers,
  userManagementHook.manualOrder,
  customPropsHook.getCustomProperty
 );

 // 統計データ
 const statisticsHook = useUserStatistics(
  filteringHook.filteredUsers,
  allUsers,
  userManagementHook.hiddenUsers,
  customPropsHook.getCustomProperty,
  displaySettingsHook.showTeamDisplay
 );

 // ユーザー追加時の処理（カスタムプロパティは自動で初期化される）
 const addUser = (user: UserVisitType) => {
  const userWithCustom = customPropsHook.initializeCustomProperties(user);
  userManagementHook.addUser(userWithCustom);
 };

 // ユーザー削除時の処理（カスタムプロパティの明示的な削除は不要）
 const removeAddedUser = (userId: string) => {
  userManagementHook.removeAddedUser(userId);
 };

 // 手動ソート時の順序更新
 const updateManualOrder = (users: UserVisitPlus[]) => {
  if (filteringHook.sortBy.value === 'manual') {
   userManagementHook.updateManualOrder(users);
  }
 };

 // カスタムプロパティ更新のヘルパー関数
 const updateUserCustomProperty = (
  userId: string,
  property: keyof import('./useCustomProperties').CustomProperties,
  value: any
 ) => {
  const user = allUsers.value.find((u) => u.userId === userId);
  if (user) {
   customPropsHook.updateCustomProperty(user, property, value);
  }
 };

 // ユーザー取得のヘルパー関数
 const getUserById = (userId: string): UserVisitPlus | undefined => {
  return allUsers.value.find((user) => user.userId === userId);
 };

 // Initialize custom properties when data changes
 watch(
  () => userVisitsData.value,
  (newValue) => {
   if (!newValue) return;

   Object.values(newValue).forEach((serviceData) => {
    if (!serviceData?.user) return;
   });
  },
  { immediate: true }
 );

 return {
  // Display settings
  ...displaySettingsHook,

  // Filter and sort
  ...filteringHook,

  // Custom properties
  ...customPropsHook,
  updateUserCustomProperty,
  getUserById,

  // User management
  hideUser: userManagementHook.hideUser,
  unhideUser: userManagementHook.unhideUser,
  addUser,
  removeAddedUser,
  updateManualOrder,

  // Data
  allUsers,

  // Statistics
  ...statisticsHook
 };
};
