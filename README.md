# manaT

まなてぃ - Manager for Trpg characters' info

## これなぁに

TRPG 向けのキャラクターをはじめとするオブジェクトストアとして使います。

## 本アプリで実現したいこと

- ツールが持つキャラクター管理機能を容易に実装可能にする
- 既存のツールとの高い互換性と親和性。既存の資源を活かして実装可能にする

## どうやって起動するの

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


### 本アプリのライセンス

[3-clause BSD license](LICENSE) (修正 BSD ライセンス) で配布しています。

### 他のドキュメント

- [API](./api.md)
- [データ管理のしくみ](./data.md)
