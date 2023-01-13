# 技術仕様

スタイルガイドの技術仕様についてまとめています。

- [技術仕様](#技術仕様)
  - [実装機能](#実装機能)
    - [ページ内目次 （ `nav.page-index` ）](#ページ内目次--navpage-index-)
      - [具体例\_\_ページ内目次](#具体例__ページ内目次)
    - [初期表示カテゴリーの指定](#初期表示カテゴリーの指定)
    - [カスタム要素](#カスタム要素)
      - [color](#color)
        - [使用方法\_\_color](#使用方法__color)
        - [具体例\_\_color](#具体例__color)
        - [出力結果\_\_color](#出力結果__color)
      - [font-family](#font-family)
        - [使用方法\_\_font-family](#使用方法__font-family)
        - [具体例\_\_font-family](#具体例__font-family)
        - [出力結果\_\_font-family](#出力結果__font-family)
    - [マークダウン形式のドキュメント読み込み](#マークダウン形式のドキュメント読み込み)
      - [流れ\_\_マークダウン形式のドキュメント読み込み](#流れ__マークダウン形式のドキュメント読み込み)
      - [使用方法\_\_マークダウン形式のドキュメント読み込み](#使用方法__マークダウン形式のドキュメント読み込み)
        - [GitHubにアップしている`.md`ファイルの読み込み方](#githubにアップしているmdファイルの読み込み方)
  - [導入済みプラグイン](#導入済みプラグイン)
    - [コードハイライター ： Ryusei Light](#コードハイライター--ryusei-light)
  - [今後の課題](#今後の課題)
    - [やること](#やること)
    - [やりたいこと](#やりたいこと)

## 実装機能

- [ページ内目次 （ `nav.page-index` ）](#ページ内目次--navpage-index-)
- [初期表示カテゴリーの指定](#初期表示カテゴリーの指定)
- [カスタム要素](#カスタム要素)
  - [color](#color)
  - [font-family](#font-family)
- [マークダウン形式のドキュメント読み込み](#マークダウン形式のドキュメント読み込み)

### ページ内目次 （ `nav.page-index` ）

`div.main-content` 内の `section.section-style[data-indexname]` を取得して動的にページ内目次を作成するようにしているため、手動で入力する必要はありません。

目次に表示したい要素には、↓のパラメーター類をすべて付与してください。

```text
js-intersectTarget : IntersectionObserverの判定用クラス。
id=""              : 目次のアンカーリンクに設定する値。
data-indexname     : 目次に表示するテキスト。
```

#### 具体例__ページ内目次

```html
<section class="js-intersectTarget" id="summary" data-indexname="概要">
  <!-- コンテンツ -->
</section>
```

### 初期表示カテゴリーの指定

ページを読み込むたびに"Get Started"画面へ戻るのは煩わしいので、\
クエリの値に応じて、該当するカテゴリを直接表示するようにしています。

例

```text
styleGuide/index.html
styleGuide/index.html?cat=rule
styleGuide/index.html?cat=design
styleGuide/index.html?cat=code
```

> 処理に関しては、`src/styleGuide/Js/index.ts`内で
>
> ```text
> // クエリでカテゴリーが指定されている時に、対応したカテゴリーがデフォルトで開くようにする
> ```
>
> と検索すれば、処理内容を確認できます。

### カスタム要素

CSS変数の"color"や"font-family"のように繰り返しが多い要素に関しては、\
Web Componentsを用いたカスタム要素を作成しています。

```text
color        : src/styleGuide/Js/components/wc_copyColorVal.js
font-family  : src/styleGuide/Js/components/wc_copyFontFamily.js
```

#### color

##### 使用方法__color

1. CSS変数を記述するファイル（`variable.css`など）に変数を登録。
2. html（や、`.hbs`などのテンプレートHTML）に↓を埋め込んでください。

    ```html
    <copy-color value="CUSTOM_PROPERTY_NAME" font="FONT_COLOR"></copy-color>
    ```

    ```text
    value :  variable.css に登録したCSS変数の名前。"--"は抜いて登録してください。
    font  :  div.color-tile--colorsample のフォントの色。`black`か`white`で指定してください。
    ```

##### 具体例__color

CSS

```css
:root {
  --color-error: #e25858;
}
```

HTML

```html
<copy-color value="color-error" font="white"></copy-color>
```

##### 出力結果__color

最終的に、DOMには下記の構造が出力されます。

```html
<copy-color value="color-error" font="white">
  <div class="color-tile--colorsample" style="background-color: #e25858;color:#fff">
    #e25858
  </div>

  <div class="color-tile--colorname">
    color-error
    <button class="code" type="button">
      var(--color-error)
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="copy" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-copy fa-w-14 fa-lg icon--copy"><path fill="currentColor" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path></svg>
    </button>
  </div>
</copy-color>
```

TODO: SVGをテンプレート化する

#### font-family

##### 使用方法__font-family

1. CSS変数を記述するファイル（`variable.css`など）に変数を登録。
2. htmlに↓を埋め込んでください。

    ```html
    <copy-fontfamily value="CUSTOM_PROPERTY_NAME" name="FONT_NAME" class="font-family__list-item"></copy-fontfamily>
    ```

    ```param
    value :  variable.css に登録したCSS変数の名前。"--"は抜いて登録してください。
    name  :  表示するフォント名。
    ```

##### 具体例__font-family

CSS

```css
:root {
  --yu-gothic: "游ゴシック体", YuGothic, "游ゴシック Medium", "Yu Gothic Medium", "Yu Gothic", "Open Sans", "メイリオ", sans-serif;
}
```

HTML

```html
<copy-fontfamily value="yu-gothic" name="游ゴシック体" class="font-family__list-item"></copy-fontfamily>
```

##### 出力結果__font-family

最終的に、DOMには下記の構造が出力されます。

```html
<copy-fontfamily value="yu-gothic" name="游ゴシック体" class="font-family__list-item">
  <span class="font-family__sample-txt" style="font-family: &quot;游ゴシック体&quot;, YuGothic, &quot;游ゴシック Medium&quot;, &quot;Yu Gothic Medium&quot;, &quot;Yu Gothic&quot;, &quot;Open Sans&quot;, &quot;メイリオ&quot;, sans-serif">游ゴシック体</span>
  <button class="code" type="button">
    var(--yu-gothic)
    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="copy" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-copy fa-w-14 fa-lg icon--copy"><path fill="currentColor" d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path></svg>
  </button>
</copy-fontfamily>
```

### マークダウン形式のドキュメント読み込み

[Markdoc](https://markdoc.dev/)というプラグインを使用し、`.md`ファイルを読み込めるようにしています。

**230113追記：**\
GitHubにアップしている`.md`ファイルも読み込めるようにしました。

#### 流れ__マークダウン形式のドキュメント読み込み

1. `StyleGuide_temp/src/styleGuide/Js/index.ts`で`.md`形式のファイルを読み込み。
2. Markdocでマークダウン形式のテキストをhtmlに変換。
3. あらかじめ用意しておいた[GitHubのマークダウンスタイル](https://github.com/sindresorhus/github-markdown-css)が適用される。

また、ドキュメントの物量を考慮し、モバイルでは表示させていません。\
読む際には、ボタンを押下することでモーダルが展開し、リーディングに専念できる仕様としています。\
（自分は「リーダーモーダル」と呼称しています。）

#### 使用方法__マークダウン形式のドキュメント読み込み

1. お好みのディレクトリに`.md`ファイルを設置してください。
2. `.md`ファイルをimportする記述を`StyleGuide_temp/src/styleGuide/Js/index.ts`に追加してください。

    ```TypeScript
    import NAME from "../docs/NAME.md?raw";
    ```

    例

    ```TypeScript
    import summary from "../docs/summary.md?raw";
    ```

    > ファイル名とimportする時の名前は併せてください。

3. `index.ts`内の`documentElms`というオブジェクトに、importした内容を追加してください。

    **`documentElms`は、importしたobjectと紐付けるために必須のオブジェクトです！**

    ```TypeScript
    const documentElms = {
      summary: summary,
      NAME: NAME // ←add
    }
    ```

    `key`と`value`は揃えてください。

4. htmlに↓を埋め込んでください。

    ```html
    <div class="markdown-body material__button--animate" data-doc-name="例">
      <div class="markdown-output" data-doc-detail="NAME"></div>
      <button type="button" class="markdown__modal-trigger d-md-none">
        <p class="markdown__modal-trigger-txt"><span class="js-placeholderText"></span>を読む</p>
      </button>
    </div>
    ```

    `data-doc-name`に入力した値がボタンの`span.js-placeholderText`に挿入されます。

    `data-doc-detail`には、3で追加したkeyを入力してください。\
    `div.markdown-output[data-doc-detail="KEY"]`に、紐付いた`.md`ファイルの内容が出力されます。

##### GitHubにアップしている`.md`ファイルの読み込み方

↑の手順1, 2, 3はスルーして大丈夫です。

手順4で入力する`data-doc-detail`にはGitHubにアップしている`.md`ファイルの**RAWのURL**を設定してください。

<img width="1237" alt="スクリーンショット 2023-01-13 16 41 59" src="https://user-images.githubusercontent.com/96507904/212265347-8fc85f0e-df5a-4bab-9a54-b1d6e8c339a5.png">

## 導入済みプラグイン

### コードハイライター ： [Ryusei Light](https://light.ryuseijs.com/)

クラス名を付与するだけで適応されるように、\
頻出言語に関してはクラスを用意しています。

HTML

```html
code-preview--html
```

sass

```html
code-preview--scss
```

CSS

```html
code-preview--css
```

JavaScript

```html
code-preview--js
```

TypeScript

```html
code-preview--ts
```

HTMLに関しては、ソースコードをそのまま放り込むと構造の部分が表示されなくなってしまうため、\
実体参照符号を使用してください。

```text
&lt;div class="PLACEHOLDER"&gt;

  表記する内容  ↑↓  表示される内容

<div class="PLACEHOLDER">
```

## 今後の課題

### やること

- [ ] 目次部分が長くなった時の処理を追加する
- [ ] モバイルでの目次表示を実装
- ダークモード関連の対応
    > 現状だと懸念点が多いため、完全にサポートしてはいません。
  - [ ] スイッチ実装
  - [ ] 調色
- [ ] TypeScriptの記述をリファクタリングする
- [ ] Responsive Utilityの内容を改訂する

### やりたいこと

- [ ] スタイルガイド内検索機能の実装
- [ ] variables.cssから登録されているCSSを取得して自動的に追加されるようにする
    > 一部実装済みだが、細かく分類分けしたい場合等もあるので、運用方法を検討する必要あり。
- [ ] スタイルガイドの構造のリファクタリング
- [ ] アニメーションに関する項目を追加する
