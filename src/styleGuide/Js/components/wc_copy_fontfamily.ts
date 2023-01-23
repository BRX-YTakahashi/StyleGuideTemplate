/**
 * @author Y.T
 */


/**
 * font-familyを表示するエリアを生成するためのWebComponents
 */

class CopyFontFamily extends HTMLElement {
  value: string;
  name: string;

  constructor() {
    super();
    this.value = "EMPTY";
    this.name = "UNDEFINED";
  }

  static get observedAttributes() {
    return ["value", "name"];
  }

  attributeChangedCallback(property: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;

    // @ts-ignore
    this[property] = newValue;
  }

  connectedCallback() {
    /**
     * 変数が見つからない時に表示する文字.
     *
     *  @type {string} errorTxt
     */
    const errorTxt = "NOT FOUND";

    /**
     * CSS変数の名前.
     *
     *  @type {string} customPropName
     */
    let customPropName = this.value;

    /**
     * CSS変数の値.
     *
     * @type {string} customPropVal
     */
    let customPropVal = getComputedStyle(document.documentElement).getPropertyValue(`--${this.value}`);

    /**
     * フロントに表示するCSS変数の値を処理.
     *
     * valueで設定したCSS変数が存在するか否かで対応する値を代入する.
     *
     * @type {string} displayPropVal
     */
    let displayPropVal = !(customPropVal) ? errorTxt : customPropVal;

    /**
     * コピーするテキスト.
     *
     *  @type {string} copyVal
     */
    let copyVal = (displayPropVal === errorTxt) ? "値を確認してください" : `var(--${customPropName})`;

    // const shadow = this.attachShadow({mode: "open"});

    // shadow.innerHTML = `
    this.innerHTML = `
      <span class="font-family__sample-txt" style='font-family:${customPropVal}'>${this.name}</span>
      <button class="code js-copyButton" type="button">
        <span class="js-copyTarget">${copyVal}</span>
        <svg class="svg-inline--fa fa-copy fa-w-14 fa-lg icon--copy"><use xlink:href="#copyIcon"></use></svg>
      </button>
    `;

    (displayPropVal === errorTxt) && this.setAttribute("error", "true");
  }
}

customElements.define("copy-fontfamily", CopyFontFamily);

export {}
