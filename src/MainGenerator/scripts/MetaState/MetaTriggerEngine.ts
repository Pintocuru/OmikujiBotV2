// src\MainGenerator\scripts\MetaState\MetaTriggerEngine.ts

import { MetaStateService, MetaUpdateEvent } from './MetaStateService'

export class MetaTriggerEngine {
  constructor(private metaState: MetaStateService) {
    metaState.subscribe((event) => this.evaluate(event))
  }

  private evaluate(event: MetaUpdateEvent) {
    // ここで MetaTriggerSchema に従って判定
    // changed / increased / decreased / greaterThanPeak / loop など
  }
}
