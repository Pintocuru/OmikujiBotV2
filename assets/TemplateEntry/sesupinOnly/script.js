const omikujiBotName = 'ZZZ_OmikujiBot'

// 'dev' にすると localhost から読む、'dist' にすると ./scripts/ 固定
const OMIKUJI_MODE = 'dev'

window.OmikujiLoader = {
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = src
      s.onload = resolve
      s.onerror = () => reject(new Error(`スクリプト読み込み失敗: ${src}`))
      document.head.appendChild(s)
    })
  },

  loadCSS(href) {
    return new Promise((resolve, reject) => {
      const l = document.createElement('link')
      l.rel = 'stylesheet'
      l.href = href
      l.onload = resolve
      l.onerror = () => reject(new Error(`CSS読み込み失敗: ${href}`))
      document.head.appendChild(l)
    })
  },

  async loadFrom(base, cssFiles, jsFiles) {
    await Promise.all(cssFiles.map((css) => this.loadCSS(base + css)))
    for (const js of jsFiles) await this.loadScript(base + js)
  },

  showOneCommeError() {
    document.body.innerHTML = `
      <div style="padding:40px;font-family:sans-serif;text-align:center">
        <p style="font-size:48px;margin:0 0 16px">🐕</p>
        <h1 style="color:#d33;margin:0 0 12px">わんコメが起動していません</h1>
        <p style="color:#666;margin:0">わんコメを起動してから、このページを再読み込みしてください。</p>
      </div>
    `
  },

  showLoadError(detail = '') {
    document.body.innerHTML = `
      <div style="padding:40px;font-family:sans-serif;color:#d33;text-align:center">
        <h1>読み込みエラー</h1>
        <p>必要なファイルを読み込めませんでした。</p>
        <p style="font-size:13px;color:#888">scripts/ フォルダが正しい場所にあるか確認してください。</p>
        ${detail ? `<pre style="font-size:11px;color:#aaa;margin-top:12px">${detail}</pre>` : ''}
      </div>
    `
  },

  _waitForVue(timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (typeof window.Vue !== 'undefined') return resolve()
      const interval = 50
      let elapsed = 0
      const timer = setInterval(() => {
        elapsed += interval
        if (typeof window.Vue !== 'undefined') {
          clearInterval(timer)
          resolve()
        } else if (elapsed >= timeout) {
          clearInterval(timer)
          reject(new Error('タイムアウト: Vue の読み込みを待機中'))
        }
      }, interval)
    })
  },

  getBase() {
    if (OMIKUJI_MODE === 'dev') {
      return `http://localhost:11180/templates/custom/${omikujiBotName}/scripts/`
    }
    return './scripts/'
  },

  async run({ cssFiles, jsFiles, mountFn, requireOneComme = false }) {
    const BASE = this.getBase()
    console.log(`[OmikujiLoader] mode=${OMIKUJI_MODE} base=${BASE}`)

    try {
      await this._waitForVue()
    } catch {
      this.showLoadError('Vue が読み込まれませんでした。')
      return
    }

    if (requireOneComme) {
      if (window.__onesdkLoaded === false) {
        this.showOneCommeError()
        return
      }
      const sdkReady = await new Promise((resolve) => {
        if (window.__onesdkLoaded === true) return resolve(true)
        let elapsed = 0
        const timer = setInterval(() => {
          elapsed += 50
          if (window.__onesdkLoaded === true) {
            clearInterval(timer)
            resolve(true)
          } else if (window.__onesdkLoaded === false || elapsed >= 3000) {
            clearInterval(timer)
            resolve(false)
          }
        }, 50)
      })
      if (!sdkReady) {
        this.showOneCommeError()
        return
      }
    }

    try {
      await this.loadFrom(BASE, cssFiles, jsFiles)
    } catch (e) {
      this.showLoadError(e.message)
      return
    }

    window.OmikujiBot = window.OmikujiBot || {}
    window.OmikujiBot.assetBase = BASE.replace(/scripts\/$/, '')

    try {
      mountFn()
    } catch (e) {
      console.error('mount 失敗:', e)
    }
  },
}
