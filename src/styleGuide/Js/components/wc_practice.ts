/* ===============================================
  * Web Components *
    reference: ( https://kinsta.com/jp/blog/web-components/ )
=============================================== */


/* Web Components とは */
/*
 * Custom Elements, Shadow DOM, HTML Template という技術的要素をまとめた言葉。
 *  - Custom Elements: 独自のhtml要素を作ることが出来る。
 *  - ShadowDOM: 通常のDOMと切り離してカプセル化されたDOMツリーを作成するAPI。
 *  - HTMLTemplate: html要素を自作するAPI。<template></template>等を利用する。
 */

/* Shadow DOM (以下SDM) の活用 */
/*
 * 外部からCSSやJSの影響を受けないようカプセル化することができる。
 *
 *  const shadow = this.attachShadow({ mode: "VALUE"});
 *
 *  VALUE: open   => 外部ページのJSのでもSDMにアクセスできる。
 *         closed => Web Components内でのみSDMにアクセスできる。
 *
 *
 * 生成したSDMは他のDOM要素と同様に操作することが出来る。
 *
 *   connectedCallback() {
 *    const shadow = this.attachShadow({mode: "closed"});
 *
 *    shadow.innerHTML = `
 *      <style>
 *        p {
 *          color: red;
 *        }
 *      </style>
 *
 *      <p>Hello ${this.name}!</p>
 *    `;
 *   }
 *
 * ↑で定義されていないテキストのスタイルに関してはページから継承をするが、
 * コンポーネント外のJSやCSSで変更することはできない。
 *
 * また、ページ上の他の文章や他のコンポーネント（今回であれば <hello-world>）に
 * 影響を与えることもできない。
 *
 * Web Componentsで生成した要素には、CSSの :host セレクタを使用することで、
 * ある程度スタイルを指定することができる。
 *
 *    :host {
 *      transform: rotate(180deg);
 *    }
 *
 *    :host(.classname) {
 *      transform: rotate(180deg);
 *    }
 */

/* HTML Template */
/*
 * スクリプト内でHTMLを定義するのは何かと実用的ではない場合も多いので、
 * テンプレートを使用することで、Web Componentで使用できるHTMLの
 * 構造をページで定義することができる。
 *
 * メリット
 *  - JS内の文字列を書き換えること無く、HTMLのコードを触ることができる。
 *  - コンポーネントは、種類ごとにJSのクラスを作成することなくカスタマイズできる。
 *  - HTMLはHTMLとして定義するほうが楽なので、
 *    コンポーネントのレンダリング前にサーバーや
 *    クライアントで修正することも可能。
 *
 *  テンプレートは <template></template> で定義する。
 *  IDを付与してコンポーネントクラス内で参照できるようにすると、管理が楽。
 *
 *  例：
 *    <template id="hello-world">
 *      <style>
 *        p {
 *          color: red;
 *        }
 *      </style>
 *
 *      <p class="hw-text"></p>
 *      <p class="hw-text"></p>
 *      <p class="hw-text"></p>
 *    </template>
 *
 *    connectedCallback() {
 *      const shadow = this.attachShadow({mode:"closed"}),
 *            template = document.getElementById("hello-world").content.cloneNode(true),
 *            hwMsg = `Hello ${this.name}`;
 *
 *      template.forEach(n => n.textContent = hwMsg);
 *
 *      shadow.append(template);
 *    }
 */

/* Template Slot */
/*
 * TODO： 余力が出来たら勉強する！
 */

/* スタイリングのコツ */
/*
 * - SDMの仕様を避け、カスタム要素に直接コンテンツを追加する。
 * - :hostクラスを使用する。
 * - カスタムプロパティを使用する。(カスタムプロパティはWeb Componentsにカスケードされる)
 * - part属性を利用する。
 * - カスタム属性にスタイルを直接記述する。
 */


/* ===============================================
  * 練習0: Hello World *
=============================================== */
export class HelloWorld extends HTMLElement {
  name: string;

  // connectedCallback() {
  //   this.textContent = "Hello World!";
  // }

  // 各オブジェクト作成時(= コンポーネント初期化時)に実行される。
  // デフォルトの設定や、その他のプリレンダリング処理を行う。
  constructor() {
    super();
    this.name = "World";//属性が存在しない時の値
  }

  // 監視する属性名のプロパティの配列を返す
  static get observedAttributes() {
    return ["name"];
  }

  // HTMLで属性が定義された時やJSで属性が変更された時に呼び出される。
  attributeChangedCallback(property: string | number, oldValue: string | number, newValue: string | number) {
    if (oldValue === newValue) return;
    // @ts-ignore
    this[property] = newValue;
  }

  // Web ComponentがDOMに追加された時に呼び出され、必要なレンダリングを全て実行する
  connectedCallback() {
    this.textContent = `Hello ${this.name}`;
  }
}

customElements.define("hello-world", HelloWorld);


/* ===============================================
  * 練習1: 現在時刻の表示 *
=============================================== */
export class SimpleClock extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();//親クラスのコンストラクタを参照するため、必須。

    // Create Shadow DOM
    this.shadow = this.attachShadow({
      mode: "open"//shadow rootの外側から操作できるようになる
    });

    // create h1 element displays current time under the shadow DOM
    const now = new Date();
    const clockElement = document.createElement("h1");
    clockElement.textContent = `Current time is ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    this.shadow.append(clockElement);
  }
}

// 即時関数
(function main() {
  // defined SimpleClock export class named simple-clock
  customElements.define("simple-clock", SimpleClock);
})();

export {}
