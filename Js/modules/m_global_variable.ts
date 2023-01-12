/**
 * @author Y.T
 */


/* ===============================================
  * Global Variables *
=============================================== */

/**
 * ドキュメントのルート要素(= html要素)
 *
 * @type {object}
 */
export let rootElm = document.querySelector<HTMLElement>("html");

/**
 * ドキュメントのbody要素
 *
 * @type {object}
 */
export let bodyElm = document.querySelector<HTMLElement>("body");

/**
 * 画面幅(ビューポート).
 *
 * @type {number}
 * @function refreshWindowSize
 */
export let screenWidth: number = window.innerWidth;

/**
 * 画面高(ビューポート).
 *
 * @type {number}
 * @function refreshWindowSize
 */
export let screenHeight: number = window.innerHeight;

/** モバイルデバイスを判定する画面幅 */
export const MOBILE_SCREEN_WIDTH = 768;

/** デスクトップデバイスを判定する画面幅 */
export const DESKTOP_SCREEN_WIDTH = 1200;

/**
 * ユーザーエージェント.
 *
 * @type {string} 小文字に変換済み
 */
export const userAgent: string = window.navigator.userAgent.toLowerCase();

/**
 * iOS端末の判定.
 *
 * @type {boolean} [true | false]
 */
export const iOS: boolean = userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1 || userAgent.indexOf("macintosh") > -1 && "ontouchend" in document;

/**
 * Android端末の判定.
 *
 * @type {boolean} [true | false]
 */
export const Android: boolean = userAgent.indexOf("android") > -1 && "ontouchend" in document;

/**
 * デフォルトのアニメーション速度.
 *
 * CSS変数から値を取得しています.
 *
 * @type {number} [--transitionDuration-default] アニメーション速度.単位はms.
 * @type {number} [undefined] 変数が存在しない場合、300を代入。
 */
export const defaultAnimationSpeed: number = getComputedStyle(document.documentElement).getPropertyValue("--transitionDuration-default") ? Number(getComputedStyle(document.documentElement).getPropertyValue("--transitionDuration-default").replace("ms", "")) : 300;


/* ===============================================
  * DOMツリー構築後に値を再代入する *
  TODO: type="module"で読み込むので、ここの処理は必要ないかも
=============================================== */

document.addEventListener("DOMContentLoaded", function() {
  rootElm = document.querySelector<HTMLElement>("html");
  bodyElm = document.querySelector<HTMLElement>("body");
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
});


/* ===============================================
  * 画面リサイズ時に値を再代入する *
=============================================== */

/** 画面幅の値を再代入する */
function reassignmentWindowSize() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
}

/** resizeイベント発火時、画面幅が異なる時に値を再代入する */
function refreshWindowSize() {
  screenWidth !== window.innerWidth && reassignmentWindowSize();
}

window.onresize = refreshWindowSize;
