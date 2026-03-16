// script.js - index.html / ConfigMaker.html 共通ローダー

window.OmikujiLoader = {
  // 単一スクリプトの動的読み込み
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = src
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    })
  },

  // 単一CSSの動的読み込み
  loadCSS(href) {
    return new Promise((resolve, reject) => {
      const l = document.createElement('link')
      l.rel = 'stylesheet'
      l.href = href
      l.onload = resolve
      l.onerror = reject
      document.head.appendChild(l)
    })
  },

  // CSS・JS をまとめて読み込む
  async loadFrom(base, cssFiles, jsFiles) {
    await Promise.all(cssFiles.map((css) => this.loadCSS(base + css)))
    for (const js of jsFiles) await this.loadScript(base + js)
  },

  // わんコメ未起動エラー表示
  showOneCommeError() {
    document.body.innerHTML = `
      <div style="padding:40px;font-family:sans-serif;text-align:center">
        <p style="font-size:48px;margin:0 0 16px">🐕</p>
        <h1 style="color:#d33;margin:0 0 12px">わんコメが起動していません</h1>
        <p style="color:#666;margin:0">わんコメを起動してから、このページを再読み込みしてください。</p>
      </div>
    `
  },

  // コアファイル読み込み失敗エラー表示
  showLoadError() {
    document.body.innerHTML = `
      <div style="padding:40px;font-family:sans-serif;color:#d33;text-align:center">
        <h1>読み込みエラー</h1>
        <p>必要なコアファイルを読み込めませんでした。</p>
        <p>テンプレートの配置または OmikujiBot のインストールを確認してください。</p>
      </div>
    `
  },

  // BASES を順に試してマウントする共通ロジック
  async run({ cssFiles, jsFiles, mountFn, requireOneComme = false }) {
    const BASES = ['http://localhost:11180/templates/custom/OmikujiBot/scripts/', './scripts/']

    // Vue と onesdk が揃うまで最大5秒待つ
    await this._waitFor(() => {
      const vueReady = typeof window.Vue !== 'undefined'
      const sdkReady = !requireOneComme || window.__onesdkLoaded !== undefined
      return vueReady && sdkReady
    }, 5000)

    if (requireOneComme && window.__onesdkLoaded === false) {
      this.showOneCommeError()
      return
    }

    for (const base of BASES) {
      try {
        await this.loadFrom(base, cssFiles, jsFiles)
        // assetBase への書き込み
        window.OmikujiBot = window.OmikujiBot || {}
        window.OmikujiBot.assetBase = base.replace(/scripts\/$/, '')
        console.log('✔ 読み込み成功:', base)
        mountFn()
        return
      } catch {
        console.warn('⚠ 読み込み失敗:', base)
      }
    }

    this.showLoadError()
  },

  _waitFor(conditionFn, timeout = 3000) {
    return new Promise((resolve, reject) => {
      if (conditionFn()) return resolve()
      const interval = 50
      let elapsed = 0
      const timer = setInterval(() => {
        elapsed += interval
        if (conditionFn()) {
          clearInterval(timer)
          resolve()
        } else if (elapsed >= timeout) {
          clearInterval(timer)
          reject(new Error('タイムアウト: Vue または onesdk の読み込みを待機中'))
        }
      }, interval)
    })
  },
}
