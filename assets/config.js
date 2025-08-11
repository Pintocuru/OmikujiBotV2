// assets/config.js

const userConfig = {
 isDiffMode: true, // 差分モードにするか(true:'diff',false:'all')
 threshold: {
  conditions: [], // service / userId / access / gift / comment のうち判定するプロパティ
  service: [], // 通すサービス
  userId: [], // 通すユーザーIDリスト(!IDでネガティブ)
  access: [], // ユーザーの役職
  gift: [], // ギフトの有無
  comment: [] // コメントの内容を参照する
 }
};

if (typeof window !== 'undefined') window.userConfig = userConfig;
