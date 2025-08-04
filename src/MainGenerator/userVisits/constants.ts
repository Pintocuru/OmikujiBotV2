// src/MainGenerator/userVisits/constants.ts
import { ServiceType } from '@onecomme.com/onesdk/types/Service';
import { UserVisitType } from '@shared/types/';

export const serviceLabels: Record<ServiceType, string> = {
 youtube: 'YouTube',
 twicas: 'TwitCasting',
 twitch: 'Twitch',
 niconama: 'ニコ生',
 showroom: 'SHOWROOM',
 bilibili: 'bilibili',
 mirrativ: 'Mirrativ',
 mixch: 'MixCh',
 twitter: 'Twitter',
 doneru: 'Doneru',
 tiktok: 'TikTok',
 streamlabs: 'Streamlabs',
 kick: 'Kick',
 vtips: 'VTips',
 external: 'External',
 system: 'System'
};

export const displayLabels = {
 userId: 'ID',
 badges: 'バッジ',
 timestamp: 'Time',
 isSyoken: '初見',
 count: 'コメ数',
 totalPrice: 'ギフト額',
 service: 'サービス'
};

export const customPropertyLabels = {
 color: 'カラー',
 score: 'スコア',
 status: 'ステータス'
};

export type CustomPropertyKey = 'color' | 'score' | 'status';

export const sortOptions = [
 { key: 'name', label: '名前順' },
 { key: 'score', label: 'スコア順' },
 { key: 'status', label: 'ステータス順' },
 { key: 'timestamp', label: '最新コメント順' },
 { key: 'totalPrice', label: 'ギフト額順' },
 { key: 'count', label: 'コメント数順' },
 { key: 'manual', label: '手動順序' }
];
