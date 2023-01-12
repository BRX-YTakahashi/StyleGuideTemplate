# Style Guide Template

DEMO: <https://brx-ytakahashi.github.io/StyleGuideTemplate/styleGuide/>

----

お手軽にスタイルガイドを作成するためのテンプレートです。

## スタイルガイドの技術仕様

[こちら](https://github.com/BRX-YTakahashi/StyleGuideTemplate/blob/master/DOCS/technicalSpecifications.md)を参照してください。

## スタイルガイドのデザインガイドライン

[こちら](https://github.com/BRX-YTakahashi/StyleGuideTemplate/blob/master/DOCS/designGuideline.md)を参照してください。

## 使い方

### 環境構築

Node.js, npm環境が必須です。\
**Node.js, npmの導入はインストール方法が多岐に渡るため、各自で対応してください。**

推奨バージョンは下記を参照してください。

Node.js : `v16.16.0`\
npm     : `8.16.0`

> バージョン確認方法
>
> ```Terminal
> node -v
> npm -v
> ```

推奨バージョンを導入後、各々の環境にクローンしてから、\
プロジェクトのルートディレクトリで下記コマンドを実行してください。

```Terminal
npm install
```

### 開発

主に開発時に使用します。\
HMRが有効になっているライブサーバーが立ち上がり、保存した内容が即座に反映されます。

```Terminal
npm run dev
```

### ビルド

作業ファイルをバンドルし、実際に公開するファイルをビルドするコマンド。
> = プロダクションビルド

```Terminal
npm run build
```

### プレビュー

ビルドしたプロダクションビルドがどのように表示されるか確認するためのコマンド。\
ライブサーバーが立ち上がり、表示確認ができます。

```Terminal
npm run preview
```

### デモページへの反映

[gh-pages](https://github.com/tschaub/gh-pages)というライブラリーを使用して、GitHub Pagesでビルド後のページが確認できるようにしています。

TODO: `index.html`を設置している箇所がルートではなく`/styleGuide`直下なので、デプロイ後に生成される[URL](https://brx-ytakahashi.github.io/StyleGuideTemplate/)だと404エラーになってしまう。要調整。

## その他

GitHub Pages検証のために追記。
