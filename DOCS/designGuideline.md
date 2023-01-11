# デザインガイドライン

スタイルガイド自体のデザインガイドラインについてまとめています。

## 概要

基本的には[Material Design 2のガイドライン](https://material.io/)を踏襲して作成しています。

一部のコンポーネント類に関しては[Appleのデザインガイドライン](https://developer.apple.com/design/human-interface-guidelines/guidelines/overview/)を踏襲して使用している箇所もあります。

## 詳細

### フォント

**※外部フォントの読み込みに関してはパフォーマンスが著しく低下するので、いったん無効化して解決策を模索中です...**

#### 英語

**[Roboto](https://fonts.google.com/specimen/Roboto?query=roboto)**

Material Designの[推奨フォントである](https://material.io/develop/web/guides/typography#basic-usage)。\
クセもなく可読性も良好。

[woff, woff2](https://google-webfonts-helper.herokuapp.com/fonts/roboto?subsets=latin)

#### 日本語

**[M PLUS 1p](https://fonts.google.com/specimen/M+PLUS+1p?query=m+plus+1p)**

硬すぎず、ある程度の柔らかさを感じさせる字体。\
あまり堅苦しい印象にしたくなかったので、柔らかさを感じるフォントを採用した。

[Official](https://mplusfonts.github.io/)

[woff, woff2](https://google-webfonts-helper.herokuapp.com/fonts/m-plus-1p?subsets=latin)

#### コード

**[IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono?query=ibm)**

好み。\
コードに用いるフォントは明確に違う自体にしたかった。\
（コーディングには[Ricty](https://rictyfonts.github.io/)を使用しているが、このページで使うにはライセンス的に厳しそうなので除外）

[Official](https://www.ibm.com/plex/)

[woff, woff2](https://google-webfonts-helper.herokuapp.com/fonts/ibm-plex-mono?subsets=latin)

### その他

#### Elevation（階層）について

UI構造に応じて陰影のサイズを調整し、階層を表現しています。([詳細はこちら](https://material.io/design/environment/elevation.html#elevation-in-material-design))

`box-shadow`の値は[こちら](https://gist.github.com/serglo/f9f0be9a66fd6755a0bda85f9c64e85f)を引用し、CSS変数として使用できるようにしています。

```css
:root {
  --elevation-0: none;
  --elevation-1: 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20);
  --elevation-2: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.20);
  --elevation-3: 0 3px 4px 0 rgba(0,0,0,0.14), 0 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20);
  --elevation-4: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.20);
  --elevation-6: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20);
  --elevation-8: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.20);
  --elevation-9: 0 9px 12px 1px rgba(0,0,0,0.14), 0 3px 16px 2px rgba(0,0,0,0.12), 0 5px 6px -3px rgba(0,0,0,0.20);
  --elevation-12: 0 12px 17px 2px rgba(0,0,0,0.14), 0 5px 22px 4px rgba(0,0,0,0.12), 0 7px 8px -4px rgba(0,0,0,0.20);
  --elevation-16: 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.20);
  --elevation-24: 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.20);
}
```

```css
/* 使用例 */
.test {
  box-shadow: var(--elevation-レイヤーレベル)
}
```
