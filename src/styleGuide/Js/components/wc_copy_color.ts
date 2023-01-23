/**
 * @author Y.T
 */


/**
 * カラーチップを生成するためのWebComponents
 */
class CopyColorVal extends HTMLElement {
  value: string;
  font: string;

  constructor() {
    super();
    this.value = "EMPTY";
    this.font = "#000";
  }

  static get observedAttributes() {
    return ["value", "font"];
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

    /**
     * カラーチップのフォントの色.
     *
     *  @type {string} fontColor
     */
    let fontColor = (this.font === "white") ? "#fff" : "#000";

    // const shadow = this.attachShadow({mode: "open"});

    // shadow.innerHTML = `
    this.innerHTML = `
      <button type="button" class="code color-tile--color-sample js-copyButton" style="background-color:${customPropVal};color:${fontColor}">
        <span class="color-tile__text color-tile__text--hex">${displayPropVal}</span>
        <span class="color-tile__text color-tile__text--property">${customPropName}</span>
        <span class="color-tile__text color-tile__text--value js-copyTarget">${copyVal}</span>
        <svg class="svg-inline--fa fa-copy fa-w-14 fa-lg icon--copy"><use xlink:href="#copyIcon"></use></svg>
      </button>
    `;

    (displayPropVal === errorTxt) && this.setAttribute("error", "true");
  }
}

customElements.define("copy-color", CopyColorVal);

export {}
