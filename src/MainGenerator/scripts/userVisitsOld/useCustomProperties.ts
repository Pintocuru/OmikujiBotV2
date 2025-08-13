// src/MainGenerator/userVisits/useCustomProperties.ts
import { ref } from 'vue';
import { UserVisitType } from '@omiken/shared/types/';

// カスタムプロパティの型定義
export interface CustomProperties {
 color: string;
 score: number;
 status: string;
}

// カスタムプロパティを含むUserVisitType
export type UserVisitPlus = UserVisitType & {
 customData?: CustomProperties;
};

export const useCustomProperties = () => {
 // Custom property display settings
 const customPropertySettings = ref({
  color: true,
  score: true,
  status: true
 });

 const getCustomProperty = <T extends UserVisitType>(user: T, property: keyof CustomProperties) => {
  const customData = (user as any).customData;
  return customData?.[property] ?? getDefaultValue(property);
 };

 const updateCustomProperty = <T extends UserVisitType>(
  user: T,
  property: keyof CustomProperties,
  value: CustomProperties[keyof CustomProperties]
 ) => {
  // ユーザーオブジェクトにcustomDataがない場合は初期化
  if (!(user as any).customData) {
   (user as any).customData = {};
  }
  (user as any).customData[property] = value;
 };

 const initializeCustomProperties = <T extends UserVisitType>(user: T): UserVisitPlus => {
  const userWithCustom = user as UserVisitPlus;

  // customDataが存在しない場合は初期化
  if (!userWithCustom.customData) {
   userWithCustom.customData = {
    color: '#3B82F6',
    score: 0,
    status: ''
   };
  } else {
   // 既存のcustomDataがある場合は、不足しているプロパティのみ追加
   if (userWithCustom.customData.color === undefined) {
    userWithCustom.customData.color = '#3B82F6';
   }
   if (userWithCustom.customData.score === undefined) {
    userWithCustom.customData.score = 0;
   }
   if (userWithCustom.customData.status === undefined) {
    userWithCustom.customData.status = '';
   }
  }

  return userWithCustom;
 };

 const getDefaultValue = (
  property: keyof CustomProperties
 ): CustomProperties[keyof CustomProperties] => {
  const defaults: CustomProperties = {
   color: '#3B82F6',
   score: 0,
   status: ''
  };
  return defaults[property];
 };

 const toggleCustomProperty = (key: keyof typeof customPropertySettings.value) => {
  customPropertySettings.value[key] = !customPropertySettings.value[key];
 };

 return {
  customPropertySettings,
  getCustomProperty,
  updateCustomProperty,
  initializeCustomProperties,
  toggleCustomProperty,
  getDefaultValue
 };
};
