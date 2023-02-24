import { RyuseiLight, Overlay, Caption, Copy, LanguageName, html, scss, css, javascript, typescript } from '@ryusei/light';

RyuseiLight.register([html(), scss(), css(), javascript(), typescript()]);
RyuseiLight.compose({ Overlay, Caption, LanguageName, Copy });




/** activateRyuseiLight RyuseiLightを有効化するための関数. */
export function activateRyuseiLight() {

  // RyuseiLightの設定.
  const ryuseilight = new RyuseiLight({
    languageName: true,
    copy: {
      html: 'Copy',
      activeHtml: 'Copied'
    }
  });

  /** @type {NodeList} codeHighlighter コードハイライターを適用したいテキスト要素 */
  const codeHighlighter = document.querySelectorAll("pre.code-preview");

  /** @type {object} supportLanguage コードハイライターが適用される言語. */
  const supportLanguage = [
    "html",
    "scss",
    "css",
    "js",
    "ts",
  ]

  /**
   * テキストを整形する処理.
   * 主にインデントの削除を行う関数です.
   * @param target テキストを整形する対象要素.
   */
  function formatSource(target: HTMLElement) {
    /**
     * @type {object} コードの内容.
     *
     * 改行位置で区切り済み.
     * 文字実体参照のため、innerHTMLを使用.
     */
    const stringCode = target.innerHTML.split('\n');

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

    target.innerHTML = insertStr;
  }


  // インデントの数を調整する処理
  (codeHighlighter.length !== 0) && codeHighlighter.forEach(elm => formatSource(elm));


  // 言語毎のスタイルをクラス名毎に設定する。
  supportLanguage.forEach(str => {
    ryuseilight.apply(`.code-preview--${str}`, {
      language: str,
      languageName: true,
      copy: true,
    });
  });

}
