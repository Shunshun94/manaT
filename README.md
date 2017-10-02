# manaT

まなてぃ - Manager for Trpg characters' info

## これなぁに

TRPG 向けのキャラクターをはじめとするオブジェクトストアとして使います。

## 本アプリで実現したいこと

- ツールが持つキャラクター管理機能を容易に実装可能にする
- 既存のツールとの高い互換性と親和性。既存の資源を活かして実装可能にする

## どうやって起動するの

[Releases](https://github.com/Shunshun94/manaT/releases) から最新版をダウンロードしてきて、展開。
展開した後のディレクトリの中で以下を実行。

```
npm install
npm start
``` 

特に設定しなければ3001番ポートを使用します。

``http://127.0.0.1:3001/``　にアクセスして動作を確認してください。

### ポートを変えたい場合は

``npm config set manat:port (ポート番号)``

### HTTPS にしたい場合は

```bash
npm config set manat:key (秘密鍵へのパス)
npm config set manat:crt (公開鍵へのパス)
npm config set manat:passphrase (秘密鍵のパスワード)
```

HTTP に戻す場合は `key` か `crt` を空欄にしてください。

```bash
npm config set manat:key ""
npm config set manat:crt ""
```

### 状態の保存

データはまなてぃが起動している間に次のコマンドを実行することでローカルに保存できます。

```
npm run dump
```

`curl` を使っています。Windows 環境の場合は curl を導入してください。
[curl](https://curl.haxx.se/)

`dump_取得時間` というファイルが作られます。

次に起動するときは最新の `dump_取得時間` を読みこんで起動するようになっています。


## ライセンス

### 利用しているライブラリ

#### Express

[Express - Node.js web application framework](http://expressjs.com/)

[MIT License](https://github.com/expressjs/express/blob/master/LICENSE) で配布されています。


### 参考にしたアプリケーション

#### どどんとふ

[どどんとふ＠えくすとり～む](http://www.dodontof.com/)

[3-clause BSD license](http://www.dodontof.com/DodontoF/README.html#aboutLicense) (修正 BSD ライセンス) で配布されています。

WebIF の内容を参考にしました。本アプリにはこの WebIF との互換性を可能な限り持たせようとしています。


### 画像

#### default.png

キャラクターのデフォルト画像です。[かなひつじ](https://twitter.com/kana1173_hhf) さんに描いていただきました。

#### background.jpg

マップ背景のデフォルト画像です。自前でとった写真です。

#### floorTile01.png ～ floorTile04.png

[サイバーなゲーム制作](http://condor.netgamers.jp/) が配布なさっている素材を利用して作成しています。
利用条件は同サイトの他、 [ツクマテ](http://tm.lucky-duet.com/viewtopic.php?f=15&t=3222) にも記載があります。

#### floorTile05.png ～ floorTile07.png

[​コミュ将の素材倉庫](https://comshou.wixsite.com/com-sho) が配布なさっている素材を利用して作成しています。
利用条件は同サイトに記載されています。

### 本アプリのライセンス

[3-clause BSD license](LICENSE) (修正 BSD ライセンス) で配布しています。

### 他のドキュメント

- [API](./api.md)
- [データ管理のしくみ](./data.md)
- [GitHub リポジトリ](https://github.com/Shunshun94/manaT)
- [更新履歴](https://github.com/Shunshun94/manaT/releases)
