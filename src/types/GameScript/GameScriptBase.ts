// src/types/GameScript/GameScriptBase.ts
import { UserManager } from '@main/stores/UserManager/UserManager'

// store のマネージャ呼び出し
export abstract class GameScriptBase {
  protected userManager?: UserManager

  // 初期化メソッド(GameScriptManagerから呼ばれる)
  initialize(userSession?: UserManager) {
    this.userManager = userSession
  }
}
