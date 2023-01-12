/**
 * @author Y.T
 */


/** import ES modules */
import * as globalVar from './m_global_variable';


/**
 * 現在のスクロール位置.
 *
 * @type {number}
 */
let scrollPosition = 0;

/**
 * モーダルの表示状態を判定するフラグ
 *
 * @type {boolean} modalStateFlg
 */
let modalStateFlg = false;

/**
 * html に scroll-behavior: smooth が設定されているか判定するフラグ.
 *
 * @type {boolean}
 */
const SMOOTH_SCROLL_FLG = globalVar.rootElm && (getComputedStyle(globalVar.rootElm).getPropertyValue("scroll-behavior") === "smooth");




/* ===============================================
  * モーダル関連 *
=============================================== */

/**
 * モーダル有効時の背景固定を有効化する.
 */
export function bodyFixedOn() {
  if (globalVar.rootElm && globalVar.bodyElm) {
    modalStateFlg = true;

    globalVar.iOS ? (
      SMOOTH_SCROLL_FLG && (globalVar.rootElm.style.scrollBehavior = "auto"),
      scrollPosition = window.pageYOffset,
      globalVar.bodyElm.style.cssText = `position: fixed; top: -${scrollPosition}px; height: 100vh; overflow: hidden;`
    )
    : globalVar.bodyElm.style.overflow = "hidden";

    modalStateFlg && globalVar.rootElm.setAttribute("data-bodyfixedstate", "fixed");
  }
}

/**
 * モーダル有効時の背景固定を無効化する.
 */
export function bodyFixedOff() {
  if (globalVar.rootElm && globalVar.bodyElm) {
    modalStateFlg = false;

    globalVar.iOS ? (
      globalVar.bodyElm.style.removeProperty("position"),
      globalVar.bodyElm.style.removeProperty("top"),
      window.scrollTo({
        top: scrollPosition,
        left: 0,
        behavior: 'auto'
      }),
      globalVar.bodyElm.style.removeProperty("overflow"),
      globalVar.rootElm.style.height = "",
      SMOOTH_SCROLL_FLG && (globalVar.rootElm.style.scrollBehavior = "smooth")
    )
    : globalVar.bodyElm.style.removeProperty("overflow");

    !modalStateFlg && globalVar.rootElm.setAttribute("data-bodyfixedstate", "unfixed");
  }
}

/** モーダルの無効化 */
export function disableModal() {
  const activeModal = document.querySelectorAll<HTMLInputElement>("[data-state-modal='active']");

  activeModal.forEach(e => {
    e.setAttribute("data-state-modal", "inactive");
  });

  bodyFixedOff();
}
