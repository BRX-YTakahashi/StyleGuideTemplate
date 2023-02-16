/**
 * @author Y.T
 */


// import plugin
import 'typed-query-selector';


// import ES modules
import * as globalVar from './modules/m_global_variable';
import { bodyFixedOn, disableModal } from './modules/m_fixed_body';
import { scrollToTop, scrollToTop_smooth } from './modules/m_scroll_pagetop';

// import md files for parse and transform
import Markdoc from '@markdoc/markdoc';
import summary from "../docs/summary.md?raw";

// import JS file for bundle
import "./components/wc_practice";
import "./components/wc_copy_color";
import "./components/wc_copy_fontfamily";

// import CSS file for bundle
import "the-new-css-reset/css/reset.css";
import "../Css/styleGuide.scss";





/* ===============================================
  * プラグイン *
=============================================== */

import { RyuseiLight, Overlay, Caption, Copy, LanguageName, html, scss, css, javascript, typescript } from '@ryusei/light';
RyuseiLight.register([html(), scss(), css(), javascript(), typescript()]);
RyuseiLight.compose({ Overlay, Caption, LanguageName, Copy });

/**
 * RyuseiLightの設定.
 */
const ryuseilight = new RyuseiLight({
  languageName: true,
  copy: {
    html: 'Copy',
    activeHtml: 'Copied'
  }
});

/**
 * @type {NodeList} ハイライトするコード
 */
const codeHighlighter = document.querySelectorAll("pre.code-preview");

// インデントの数を調整する処理
codeHighlighter.forEach(e => {
  /**
   * @type {object} コードの内容.
   *
   * 改行位置で区切り済み.
   * 文字実体参照のため、innerHTMLを使用.
   */
  const stringCode = e.innerHTML.split('\n');

  /** @type {String} 挿入する文字列. */
  let insertStr = '';

  /** @type {Number} 1行目のインデント数. */
  let indentCount = 0;

  for (let i = 0; i < stringCode.length; i++) {
    // 1行目のインデント数を取得
    (i === 0) && (indentCount = (stringCode[i].split('  ').length - 1) * 2);

    // 最終行には改行を付与しない
    (i !== stringCode.length - 1) && (insertStr += `${stringCode[i].slice(indentCount)}\n`);
  }

  e.innerHTML = insertStr;
});

// 言語毎のスタイルをクラス名毎に設定する。
ryuseilight.apply('.code-preview--html', {
  language: 'html',
  languageName: true,
  copy: true,
});
ryuseilight.apply('.code-preview--scss', {
  language: 'scss',
  languageName: true,
  copy: true,
});
ryuseilight.apply('.code-preview--css', {
  language: 'css',
  languageName: true,
  copy: true,
});
ryuseilight.apply('.code-preview--js', {
  language: 'js',
  languageName: true,
  copy: true,
});
ryuseilight.apply('.code-preview--ts', {
  language: 'ts',
  languageName: true,
  copy: true,
});




/* ===============================================
  * 汎用 *
=============================================== */

/**
 * 対象要素の状態を全てリセットする.
 *
 * @param {NodeList} elm_array 状態を初期化したい要素の配列
 */
function initializeState(elm_array: any[] | NodeListOf<HTMLInputElement>) {
  elm_array.forEach((e) => {
    e.classList.remove("current");
  });
}




/* ===============================================
  * クリップボードへテキストをコピーする *
=============================================== */

/**
 * @type {NodeList} 全てのコピーボタン
 */
const copyTargetElm = document.querySelectorAll<HTMLInputElement>(".js-copyButton");

/**
 * @type {object} コピーボタン押下後に表示するトースト
 */
const toastElm = document.querySelector<HTMLElement>("#toast");

/**
 * @type {number} タイマーを識別するためのID
 */
let setTimeoutId: number;

/**
 * @function setTimeoutメソッドを設定する
 */
function startSetTimeout() {
  setTimeoutId = window.setTimeout(() => {
    toastElm && toastElm.setAttribute('data-state-toast', 'inactive');
  }, 3000);
}

/**
 * @function 既に設定されているsetTimeoutメソッドを解除する
 */
function clearSetTimeout() {
  clearTimeout(setTimeoutId);
}

/**
 * クリップボードへテキストをコピーする.
 *
 * @param {object} elm クリックした要素
 */
function copyText(elm: HTMLElement) {
  navigator.clipboard.writeText(elm.innerText)
    .then(() => {
      // alert(elm.innerText + 'をコピーしました');
    })
    .catch(err => {
      alert(`copy failed: ${err}`);
    });
}

/**
 * コピーボタン毎に処理を追加する.
 *
 * @param {object} elm 各々の要素のコピーボタン
 */
copyTargetElm.forEach((elm) => {
  elm.addEventListener('click', function () {
    clearSetTimeout();

    // type assertion
    if (!(this instanceof HTMLElement)) {
      return;
    }

    /** @type {HTMLElement} thisElm クリックした要素 */
    const thisElm: HTMLElement = this;

    /** @type {HTMLElement} copyTarget コピーする対象の要素 */
    const copyTarget = thisElm.querySelector(".js-copyTarget");

    // type assertion
    if (!(copyTarget instanceof HTMLElement)) {
      return;
    }

    if (toastElm && copyTarget) {
      copyText(copyTarget);
      toastElm.setAttribute('data-state-toast', 'active');
      toastElm.innerText = copyTarget.innerText + ' をコピーしました';
    }

    startSetTimeout();
  });
});




/* ===============================================
  * モーダル関連 *
=============================================== */

/**
 * モーダルの背景.
 *
 * @type {element}
 */
const modalBg = document.querySelector<HTMLElement>(".modal-bg");

modalBg && modalBg.addEventListener('click', disableModal);




/* ===============================================
  * 目次関連 *
=============================================== */

/** @type {NodeList} 目次を格納している要素 */
const indexList = document.querySelectorAll<HTMLInputElement>(".page-index__list");

// /** @type {NodeList} 目次の内容 */
// const indexListItem = document.querySelectorAll<HTMLInputElement>(".page-index__list-item");

/** @type {0 | 1} ページインデックスをクリックした際のフラグ */
let indexClickedFlg = 0;

/** @type {NodeList} コンテンツを表示する箇所 */
const mainContent = document.querySelectorAll<HTMLInputElement>(".main-content");

/** @type {number} コンテンツを表示する箇所の個数(= カテゴリー数)  */
const mainContentLength = mainContent.length;

/** @type {array} アンカーリンク用のIDを格納する配列 */
const idValArray = new Array(mainContentLength);

/** @type {array} 目次に表示するテキストを格納する配列 */
const indexNameArray = new Array(mainContentLength);

/**
 * 目次を生成する処理.
 *
 * @returns {Promise}
 */
let generateIndex = new Promise<void>(function (resolve) {
  // [data-indexname]の個数分、配列を作成する
  for (let i = 0; i < mainContentLength; i++) {
    idValArray[i] = new Array(mainContent[i].querySelectorAll("[data-indexname]").length);
    indexNameArray[i] = new Array(mainContent[i].querySelectorAll("[data-indexname]").length);
  }

  // ↑で作成した配列に[data-indexname]の値を格納する
  for (let i = 0; i < indexNameArray.length; i++) {
    for (let j = 0; j < mainContent[i].querySelectorAll("[data-indexname]").length; j++) {
      idValArray[i][j] = mainContent[i].querySelectorAll("[data-indexname]")[j].getAttribute("id");
      indexNameArray[i][j] = mainContent[i].querySelectorAll("[data-indexname]")[j].getAttribute("data-indexname");
    }
  }
  // console.log(idValArray)
  // console.log(indexNameArray)

  // 作成した配列のデータを目次に落とし込む
  for (let i = 0; i < indexList.length; i++) {
    const indexListElm = indexList[i].querySelector<HTMLElement>("[data-placeholder]");
    indexListElm && indexListElm.remove();

    for (let j = 0; j < idValArray[i].length; j++) {
      /** @type {element} ul.page-index__listに追加するリスト要素 */
      let appendElm_li = document.createElement('li');

      /** @type {element} appendElm_li(li.page-index__list-item)に追加するアンカーリンク要素 */
      let appendElm_a = document.createElement('a');

      appendElm_li.classList.add('page-index__list-item');

      // 一番目の要素はactiveにした状態で生成する。
      j === 0 ? appendElm_li.setAttribute('data-index', 'active') : appendElm_li.setAttribute('data-index', 'inactive');

      appendElm_a.classList.add('page-index__list-item__link');
      appendElm_a.setAttribute('href', `#${idValArray[i][j]}`);

      appendElm_a.append(indexNameArray[i][j]);
      appendElm_li.append(appendElm_a);
      indexList[i].append(appendElm_li);
    }
  }

  resolve();
});

/**
 * アクティブな目次の切り替え.
 *
 * カテゴリーが切り替わる毎に、対応した目次に切り替える.
 *
 * @param {string} category 切り替え先のカテゴリー名
 */
function activateIndexSwitch(category: string) {
  /** @type {NodeList} インデックスを切り替える判定を行う要素 */
  const detectIntersectTarget = document.querySelectorAll<HTMLInputElement>(`.main-content[data-category="${category}"] .js-intersectTarget`);

  /** @type {array} IntersectionObserver のオプション */
  const options = {
    root: null,
    rootMargin: "-50% 0%",
    threshold: 0
  };

  /** @constructor IntersectionObserverのコンストラクタ */
  const observer = new IntersectionObserver(intersectedFunc, options);

  /** detectIntersectTargetそれぞれを監視対象に設定する. */
  detectIntersectTarget.forEach(function (elm) {
    observer.observe(elm);
  });

  /**
   * 監視対象が交差した時の処理.
   *
   * @param {object} entries
   */
  function intersectedFunc(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (indexClickedFlg == 0) {
          const currentActiveIndex = document.querySelector<HTMLElement>(`.page-index[data-category="${category}"] .page-index__list-item[data-index="active"]`);
          currentActiveIndex && currentActiveIndex.setAttribute("data-index", "inactive");

          let entryTarget = document.querySelector<HTMLElement>(`a[href='#${entry.target.id}']`);
          if (entryTarget) {
            const newActiveIndex = <Element>entryTarget.parentNode;
            newActiveIndex && newActiveIndex.setAttribute("data-index", "active");
          }
        }
      }
    });
  }

  // インデックスをクリックした際の処理
  // indexListItem.forEach(function (e) {
  //   e.addEventListener("click", function () {
  //     indexClickedFlg = 1;

  //     indexListItem.forEach(function (changeAttrElm) {
  //       changeAttrElm.setAttribute("data-index", "inactive");
  //     });

  //     e.setAttribute("data-index", "active");

  //     window.setTimeout(function () {
  //       indexClickedFlg = 0;
  //     }, 500);
  //   });
  // });
}

// インデックスの生成が終わった時点で、アクティブな目次の切り替え処理を発火させる
generateIndex
  .then(function () {
    activateIndexSwitch("welcome");
  })
  .catch(function () {
    alert('ERROR');
  });




/* ===============================================
  * カテゴリーの切り替え *
=============================================== */

/** @type {element} ページ下部のカテゴリーリスト */
const categoryTabElm = document.querySelector<HTMLElement>(".category-tab__list");

/** @type {NodeList} カテゴリーリストの要素 */
const categoryTabContentElm = document.querySelectorAll<HTMLInputElement>(".category-tab__list-item");

/** @type {NodeList} 目次の表示内容や構造を管理するための構造 */
let pageIndexElm = document.querySelectorAll<HTMLInputElement>(".page-index");

// /** @type {number} スクロール量 */
// let scrollTotal = globalVar.rootElm && (globalVar.rootElm.scrollHeight - globalVar.rootElm.clientHeight);

/** @type {element} カテゴリータブを拡大するボタン */
const categoryTabExpandBtn = document.querySelector<HTMLElement>(".category-tab__list-item--expand");

/** @type {string} クエリで指定されているカテゴリー名 */
const debugModeVal = new URLSearchParams(window.location.search).get('cat');

/** @type {string} クエリで指定されているコマンド */
const modeVal = new URLSearchParams(window.location.search).get('mode');

/**
 * アクティブなカテゴリーの切り替え.
 *
 * @param {string} cat アクティブになっているカテゴリーの属性値
 * @param {string} className アクティブにするカテゴリーのクラス名
 */
function switchCategory(cat: string, className: string) {
  const switchElm = document.querySelectorAll<HTMLInputElement>(`${className}`);

  switchElm.forEach((e) => {
    if (cat === e.getAttribute("data-category")) {
      e.classList.add('current');
    }
  });
}

// カテゴリータブ切り替え時の処理全般
categoryTabContentElm.forEach((e) => {
  const selectedTab: HTMLElement = e;
  const selectedCategoryName = selectedTab ? selectedTab.getAttribute("data-category") : "error";

  if (selectedTab.getAttribute("data-category") !== "expand") {
    selectedTab.addEventListener('click', () => {
      if (globalVar.rootElm) {
        selectedTab.getAttribute("data-category") === globalVar.rootElm.getAttribute("data-category") ? scrollToTop_smooth(globalVar.rootElm) : scrollToTop(globalVar.rootElm);

        initializeState(categoryTabContentElm);
        initializeState(mainContent);
        initializeState(pageIndexElm);

        selectedTab.classList.add("current");
        globalVar.rootElm.setAttribute("data-category", selectedTab.getAttribute("data-category") as string);
        switchCategory(selectedCategoryName as string, ".main-content");
        switchCategory(selectedCategoryName as string, ".page-index");

        activateIndexSwitch(`${e.getAttribute("data-category")}`);
      }
    });
  }
});

// /**
//  * スクロールに応じてカテゴリータブの状態を変化させる
//  */
// const changeStateWithScroll = function () {
//   scrollTotal = globalVar.rootElm && (globalVar.rootElm.scrollHeight - globalVar.rootElm.clientHeight);

//   if (globalVar.rootElm && scrollTotal && categoryTabElm) {
//     if ((globalVar.rootElm.scrollTop / scrollTotal) > 0.1) {
//       categoryTabElm.setAttribute('data-state-category-tab', 'shrinked');
//     } else if (!categoryTabElm.getAttribute('data-state-category-tab')) {
//       return
//     } else {
//       categoryTabElm.setAttribute('data-state-category-tab', 'expanded');
//     }
//   }
// }

// if (categoryTabElm) {
//   document.addEventListener('scroll', changeStateWithScroll);
// }

if (categoryTabExpandBtn && categoryTabElm) {
  categoryTabExpandBtn.addEventListener('click', function () {
    categoryTabElm.setAttribute('data-state-category-tab', 'expanded');
  });
}

// クエリでカテゴリーが指定されている時に、対応したカテゴリーがデフォルトで開くようにする
if (debugModeVal) {
  initializeState(categoryTabContentElm);
  initializeState(mainContent);
  initializeState(pageIndexElm);

  const currentCategoryTab = document.querySelector<HTMLElement>(`.category-tab__list-item[data-category=${debugModeVal}]`);
  currentCategoryTab && currentCategoryTab.classList.add("current");
  globalVar.rootElm && globalVar.rootElm.setAttribute("data-category", `${debugModeVal}`);
  switchCategory(`${debugModeVal}`, ".main-content");
  switchCategory(`${debugModeVal}`, ".page-index");
  activateIndexSwitch(`${debugModeVal}`);
}

// クエリでモードが指定されている時の処理
if (modeVal) {
  globalVar.rootElm && globalVar.rootElm.setAttribute('data-mode', `${modeVal}`);
}




/* ===============================================
  * マークダウンの内容を出力する処理 *
=============================================== */

interface documentElms {
  [key: string]: string
}

/**
 * @type {any} documentElms
 *
 * data-doc-detailで指定した値とimportした.mdを紐付ける
 */
const documentElms: documentElms = {
  summary: summary,
}

/** @type {NodeList} outputArea .mdをパースした内容を出力する場所 */
const outputArea = document.querySelectorAll(`[data-doc-detail]`);

outputArea.forEach(e => {
  const attributeVal = e.getAttribute('data-doc-detail');

  if (attributeVal) {
    if (attributeVal in documentElms) {
      // ローカルの.mdファイルを読み込む時の処理

      const parsedMd = Markdoc.parse(documentElms[attributeVal]);
      const transformedMd = Markdoc.transform(parsedMd);

      e.innerHTML = Markdoc.renderers.html(transformedMd);


      // アンカーリンクを付与する処理
      /** @type {NodeList} anchorLinks 目次エリアのhref属性を持つ要素を取得する */
      const anchorLinks = e.querySelectorAll("article > h2:first-of-type + ul > li > ul a[href^='#']");

      /** @type {NodeList} anchorLinkTargets h1以外の見出し要素を取得する */
      const anchorLinkTargets = e.querySelectorAll("h2, h3, h4, h5, h6");

      if (anchorLinks.length === anchorLinkTargets.length) {
        for (const index in anchorLinks) {
          if (anchorLinks[index].innerHTML) {
            const idName = anchorLinks[index].getAttribute("href")?.replace("#", "");
            idName && anchorLinkTargets[index].setAttribute("id", idName);
          } else {
            break;
          }
        }
      }

    } else if (attributeVal.includes('github')) {
      // GitHubにアップしている.mdファイルを読み込むときの処理

      fetch(attributeVal, { mode: "cors" })
        .then((response) => response.text())
        .then((data) => {
          const parsedMd = Markdoc.parse(data);
          const transformedMd = Markdoc.transform(parsedMd);

          e.innerHTML = Markdoc.renderers.html(transformedMd);
          e.innerHTML += `<h2>取得元</h2><a href="${attributeVal}" target="_blank">${attributeVal}</a>`;
        });
    }
  }
});





/* ===============================================
  * ドキュメントリーダー *
=============================================== */

/** @type {NodeList} ドキュメントを設置している要素 */
const docsName = document.querySelectorAll<HTMLInputElement>(".markdown-body[data-doc-name]");

/** @type {array} ドキュメントリーダーに関連する要素 */
const activateReaderElm = [
  document.querySelector<HTMLElement>(".document-reader[data-state-modal='inactive']"),
  document.querySelector<HTMLElement>(".modal-bg[data-state-modal='inactive']")
];

/** @type {NodeList} ドキュメントリーダーを閉じるボタン */
const docsReaderCloseBtn = document.querySelectorAll<HTMLInputElement>(".document-reader__close-btn--top, .document-reader__close-btn-txt");

/** @type {number} オフセット */
let offset: number = 0;

/** @type {number} スクロールした位置 */
let scrollPosition: number = 0;

/** @type {boolean} requestAnimationFrame用のフラグ */
let ticking: boolean = false;

/**
 * ドキュメントリーダーの高さを変更する.
 *
 * @param {element} elm ドキュメントリーダーの要素
 */
function changeHeightWithScroll(elm: HTMLElement) {
  if (scrollPosition < offset) {
    globalVar.iOS ? scrollPosition < 0 ? elm.setAttribute('data-state-reader', 'shrinked') : '' : scrollPosition <= 0 ? elm.setAttribute('data-state-reader', 'shrinked') : '';
  } else {
    globalVar.iOS ? scrollPosition > 0 ? elm.setAttribute('data-state-reader', 'expanded') : '' : scrollPosition >= 0 ? elm.setAttribute('data-state-reader', 'expanded') : '';
  }

  offset = scrollPosition;
}

/**
 * スクロールに応じて、ドキュメントリーダーの高さを変化させる.
 *
 * @todo 処理の見直しをする予定
 */
function detectScrollInModal() {
  const readerElm = document.querySelector<HTMLElement>(".document-reader");

  readerElm && readerElm.addEventListener('scroll', function () {
    if (!ticking) {
      scrollPosition = readerElm.scrollTop;

      window.requestAnimationFrame(function () {
        changeHeightWithScroll(readerElm);
        ticking = false;
      });

      ticking = true;
    }
  });
}

/**
 * ドキュメントリーダーの要素全てに処理を適応する
 *
 * @todo 画面リサイズ時の処理を追加する
 */
docsName.forEach(e => {
  const documentReaderText = e.querySelector<HTMLElement>(".js-placeholderText");
  documentReaderText && (documentReaderText.innerHTML = `"${e.getAttribute("data-doc-name")}"&nbsp;`);

  e.addEventListener('click', () => {
    const readerElm = document.querySelector<HTMLElement>(".document-reader");

    if (readerElm) {
      if (globalVar.screenWidthDoc <= globalVar.MOBILE_SCREEN_WIDTH) {
        readerElm.setAttribute('data-state-reader', 'shrinked')

        scrollToTop_smooth(readerElm);

        activateReaderElm.forEach(e => {
          const modalState = e;

          modalState && modalState.setAttribute('data-state-modal', 'active');
        });

        bodyFixedOn();

        const documentReaderTextPlace = document.querySelector<HTMLElement>(".document-reader .markdown-body");
        const documentReaderOutputText = e.querySelector<HTMLElement>(".markdown-output");
        (documentReaderTextPlace && documentReaderOutputText) && (documentReaderTextPlace.innerHTML = documentReaderOutputText.innerHTML);

        detectScrollInModal();
      }
    }
  });
});

docsReaderCloseBtn.forEach(e => e.addEventListener('click', disableModal));




/** モバイル端末で:activeのスタイルが適応されるようにする */
window.addEventListener('touchstart', function () { }, true);




/* ===============================================
  * ページ読み込み後の処理 *
=============================================== */
window.addEventListener('load', () => {
  globalVar.rootElm && globalVar.rootElm.setAttribute('data-page-loaded', 'true');


  // const insertPropertyFontFace = `
  //   /* roboto-100 - latin */
  //   @font-face {
  //     font-family: 'Roboto';
  //     font-style: normal;
  //     font-weight: 100;
  //     font-display: swap;
  //     src: local(''),
  //         /* url('./fonts/roboto-v30-latin-100.woff2') format('woff2'), */
  //         url('./fonts/roboto-v30-latin-100.woff') format('woff')
  //   }
  //   /* roboto-regular - latin */
  //   @font-face {
  //     font-family: 'Roboto';
  //     font-style: normal;
  //     font-weight: 400;
  //     font-display: swap;
  //     src: local(''),
  //         /* url('./fonts/roboto-v30-latin-regular.woff2') format('woff2'), */
  //         url('./fonts/roboto-v30-latin-regular.woff') format('woff');
  //   }
  //   /* roboto-700 - latin */
  //   @font-face {
  //     font-family: 'Roboto';
  //     font-style: normal;
  //     font-weight: 700;
  //     font-display: swap;
  //     src: local(''),
  //         /* url('./fonts/roboto-v30-latin-700.woff2') format('woff2'), */
  //         url('./fonts/roboto-v30-latin-700.woff') format('woff');
  //   }
  //   /* m-plus-1p-100 - japanese */
  //   @font-face {
  //     font-family: 'M PLUS 1p';
  //     font-style: normal;
  //     font-weight: 100;
  //     font-display: swap;
  //     src: local(''),
  //         /* url('./fonts/m-plus-1p-v27-japanese-100.woff2') format('woff2'), */
  //         url('./fonts/m-plus-1p-v27-japanese-100.woff') format('woff');
  //   }
  //   /* m-plus-1p-regular - japanese */
  //   @font-face {
  //     font-family: 'M PLUS 1p';
  //     font-style: normal;
  //     font-weight: 400;
  //     font-display: swap;
  //     src: local(''),
  //         /* url('./fonts/m-plus-1p-v27-japanese-regular.woff2') format('woff2'), */
  //         url('./fonts/m-plus-1p-v27-japanese-regular.woff') format('woff');
  //   }
  //   /* m-plus-1p-700 - japanese */
  //   @font-face {
  //     font-family: 'M PLUS 1p';
  //     font-style: normal;
  //     font-weight: 700;
  //     font-display: swap;
  //     src: local(''),
  //         /* url('./fonts/m-plus-1p-v27-japanese-700.woff2') format('woff2'), */
  //         url('./fonts/m-plus-1p-v27-japanese-700.woff') format('woff');
  //   }
  //   /* ibm-plex-mono-regular - latin */
  //   @font-face {
  //     font-family: 'IBM Plex Mono';
  //     font-style: normal;
  //     font-weight: 400;
  //     font-display: swap;
  //     src: local(''),
  //         /* url('./fonts/ibm-plex-mono-v12-latin-regular.woff2') format('woff2'), */
  //         url('./fonts/ibm-plex-mono-v12-latin-regular.woff') format('woff');
  //   }
  // `

  // document.querySelector<HTMLElement>('head').insertAdjacentHTML('beforeend', `<style id="js-fontFace"></style>`);
  // document.querySelector<HTMLElement>('#js-fontFace').innerHTML = insertPropertyFontFace;
});
