/**
 * @author Y.T
 */


/* ===============================================
  * スクロール関連 *
=============================================== */

/**
 * ページTOPへスクロール.
 * アニメーション無し.
 */
export const scrollToTop = function(elm: HTMLElement) {
  elm.scroll({
    top: 0,
    behavior: "auto" // = instant ( https://github.com/microsoft/TypeScript-DOM-lib-generator/commit/fe01c9a6d6afde86bd15f2588dc9360416a2beb4 )
  });
}

/**
 * ページTOPへスクロール.
 * アニメーションあり.
 */
export const scrollToTop_smooth = function(elm: HTMLElement) {
  elm.scroll({
    top: 0,
    behavior: "smooth"
  });
}
