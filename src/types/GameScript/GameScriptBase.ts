// src/types/GameScript/GameScriptBase.ts
import { UserManager } from '@/MainGenerator/stores/UserManager/UserManager'

// store のマネージャ呼び出し
export abstract class GameScriptBase {
  protected userSession?: UserManager

  // 初期化メソッド(GameScriptManagerから呼ばれる)
  initialize(userSession?: UserManager) {
    this.userSession = userSession
  }
}
