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
      <button class="code" type="button">
        ${copyVal}
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="copy" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-copy fa-w-14 fa-lg icon--copy"><path fill="currentColor" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path></svg>
      </button>
    `;

    (displayPropVal === errorTxt) && this.setAttribute("error", "true");
  }
}

customElements.define("copy-fontfamily", CopyFontFamily);

export {}
