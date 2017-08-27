# API

まなてぃの API はどどんとふの WEBIF をマネして作っています。
そのため、引数およびレスポンスの説明は「どどんとふならこういう役割」というものになります。
しかし、殆どの値については利用者がその値を異なる意味として利用することは妨げられません。

全ての API は jsonp に対応しています。

## /

起動確認用です。

### URL

`/`

### 引数

なし

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result`    | `OK`     | 処理が正常終了したか否か。正常に取得でき　たら `OK` が、失敗したら理由が入ります
`message`    | `まなてぃは起動しています`     | まなてぃが問題なく起動している旨が入ります


### レスポンス例

```json
{
	"result":"OK",
	"message":"まなてぃは起動しています"
}
```

## addCharacter

キャラクターを追加します。どどんとふの WEBIF [addCharacter](http://www.dodontof.com/DodontoF/README.html#webIf_addCharacter) と引数などの面で互換性があります。

### URL

`/addCharacter`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
必 | `name` | - | `myName` | 追加するキャラクターの名前です。任意の文字列が使えます
任 | `size` | `1` | `3` | 追加するキャラクターの大きさです。1以上の整数で指定します
任 | `x` | `0` | `12` | 追加するキャラクターの X 座標です。任意の整数で指定します
任 | `y` | `0` | `4` | 追加するキャラクターの Y 座標です。任意の整数で指定します
任 | `initiative` | `0` | `5` | 追加するキャラクターのイニシアティブ値 (行動値) です。任意の整数で指定します
任 | `rotation` | `0` | `` | 追加するキャラクターの表示されるコマの傾き具合です。0～360の数字で指定し、何度傾けるかを指定します
任 | `dogTag` | (空文字列) | `4` | キャラクターに振られる連番です。任意の整数で指定します
任 | `draggable` | `false` | `1` | 追加するキャラクターをドラッグ(= 移動) できるかを設定します。 値を指定すれば true に、しなければ false になります
任 | `isHide` | `false` | `1` | 追加するキャラクターをマップマスクの下に隠すか否かを設定します。 値を指定すれば true に、しなければ false になります
任 | `url` | (空文字列) | `http://charasheet.vampire-blood.net/1352909` |　キャラクターの参照 URL です
任 | `info` | (空文字列) | `今麻痺しています。カードは後4枚残しています` | キャラクターのメモ欄に掲載する情報です
任 | `image` | `https://shunshun94.github.io/manaT/images/default.png` | `https://pbs.twimg.com/profile_images/852893935772905477/5YBolAUp_400x400.jpg` | キャラクターのコマに使われる画像の URL です
任 | `counters` | (空文字列) | `HP:32,MP:24,*poison:,*cat:1` | イニシアティブ表に表示されるキャラクター情報です。項目ごとにカンマ区切り、項目の名前と値をコロンで区切ります
任 | `statusAlias` | (空文字列) | `poison:毒,cat:猫化` | どどんとふでは counters の key の先頭に * を入力した場合、その項目が bool 値になります。この場合の表示を置き換えるために用いられます。入力形式は counters と同様です

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result`    | `OK`     | 処理が正常終了したか否か。正常に追加できたら `OK` が、失敗したら理由が入ります
`data`    | 後述 | 追加したキャラクターデータが入ります。ただし、以下のデータについて追加・変更がされています

変更の種類 | キー  | 説明
----------- | ------------- | -----
追加 | `type` | このデータがどんなデータなのかを示します。キャラクターのデータであることを示す `characterData` が代入されています
変更 | `statusAlias` | `statusAlias`　が連想配列の形で入っています
変更 | `counters` | `counters`　が連想配列の形で入っています
追加 | `lastUpdate` | 最終更新時間が1970 年 1 月 1 日 (UTC) から始まるミリ秒単位の時刻値で入っています

### レスポンス例

```json
{
	"result":"OK",
	"data":{
		"type":"characterData",
		"name":"cat",
		"size":2,
		"x":0,
		"y":1,
		"draggable":true,
		"isHide":true,
		"initiative":9,
		"dogTag":1,
		"url":"https://shunshun94.github.io/manaT/",
		"info":"foo",
		"imageName":"https://shunshun94.github.io/manaT/images/default.png",
		"statusAlias":{
			"check":"abc",
			"check2":"def"
		},
		"counters":{
			"HP":"1",
			"MP":"1",
			"*check":"1"
		},
		"lastUpdate":1503782558121
	}
}
```

## removeCharacter

キャラクターを削除します。

### URL

`/removeCharacter`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
必 | `targetName` | - | `myName` | 削除するキャラクターの名前です。 `addCharacter` などで取得できる `name` の値を使います

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result`    | `OK`     | 処理が正常終了したか否か。正常に削除できたら `OK` が、失敗したら理由が入ります

### レスポンス例

```json
{
	"result":"OK"
}
```

## changeCharacter

キャラクターのデータを更新します。どどんとふの WEBIF [changeCharacter](http://www.dodontof.com/DodontoF/README.html#webIf_changeCharacter) と引数などの面で互換性があります。

### URL

`/changeCharacter`

### 引数

変更したい値だけ入力します。
入力されなかった値は元の値が使われます (更新されません)。

引数は `targetName` を除いて `addCharacter` のものと同じです。

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
必 | `targetName` | - | `myName` | 更新するキャラクターの名前です。 `addCharacter` などで取得できる `name` の値を使います
任 | `name` | (元の値) | `newName` | 更新後のキャラクターの名前です
任 | `size` | (元の値) | `2` | 更新後のキャラクターの大きさです
任 | `x` | (元の値) | `2` | 更新後のキャラクターの X 座標です
任 | `y` | (元の値) | `3` | 更新後のキャラクターの Y 座標です
任 | `initiative` | (元の値) | `5` | 更新後のキャラクターのイニシアティブ値 (行動値) です
任 | `rotation` | (元の値) | `` | 更新後のキャラクターの表示されるコマの傾き具合です
任 | `dogTag` | (元の値) | `4` | 更新後のキャラクターに振られる連番です
任 | `draggable` | (元の値) | `1` | 更新後にキャラクターをドラッグ(= 移動) できるかを設定します
任 | `isHide` | (元の値) | `1` | 更新後にキャラクターをマップマスクの下に隠すか否かを設定します
任 | `url` | (元の値) | `http://charasheet.vampire-blood.net/1352909` |　更新後のキャラクターの参照 URL です
任 | `info` | (元の値) | `今麻痺しています。カードは後4枚残しています` | 更新後のキャラクターのメモ欄に掲載する情報です
任 | `image` | (元の値) | `https://pbs.twimg.com/profile_images/852893935772905477/5YBolAUp_400x400.jpg` | 更新後のキャラクターのコマに使われる画像の URL です
任 | `counters` | (元の値) | `HP:32,MP:24,*poison:,*cat:1` | 更新後のイニシアティブ表に表示されるキャラクター情報です。一部だけ更新することはできない点に注意してください ※
任 | `statusAlias` | (元の値) | `poison:毒,cat:猫化` | 更新後のイニシアティブ表のエイリアスです。一部だけ更新することはできない点に注意してください

### ※一部だけ更新することはできない

`/addCharacter?room=1&name=こねこ&counters=HP:12,MP:8` とした場合、 counters は次の結果になります。

```json
{
	"HP":"12",
	"MP":"8"
}
```

`/changeCharacter?room=1&targetName=こねこ&counters=MP:8` とすると、 counters は次の結果になります。

```json
{
	"MP":"8"
}
```

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result`    | `OK`     | 処理が正常終了したか否か。正常に更新できたら `OK` が、失敗したら理由が入ります
`data`    | 後述 | 追加したキャラクターデータが入ります。内容は addCharacter のものを参照してください

### レスポンス例

```json
{
	"result":"OK",
	"data":{
		"type":"characterData",
		"name":"ひつじ",
		"size":1,
		"x":8,
		"y":8,
		"draggable":true,
		"isHide":false,
		"initiative":0,
		"dogTag":0,
		"url":"",
		"info":"ひつじなの！",
		"imageName":"https://shunshun94.github.io/manaT/images/default.png",
		"statusAlias":{},
		"counters":{
			"HP":"8",
			"MP":"8"
		},
		"lastUpdate":1503784814628,
		"targetName":"ひつじ"}
	}
}
```


## updateCharacter

キャラクターのデータを更新します。　``changeCharacter`` と異なる点は `counters` と `statusAlias` の一部の更新が可能な点です。

### URL

`/updateCharacter`

### 引数

変更したい値だけ入力します。
入力されなかった値は元の値が使われます (更新されません)。

引数は `changeCharacter` のものと同じです。

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
必 | `targetName` | - | `myName` | 更新するキャラクターの名前です。 `addCharacter` などで取得できる `name` の値を使います
任 | `name` | (元の値) | `newName` | 更新後のキャラクターの名前です
任 | `size` | (元の値) | `2` | 更新後のキャラクターの大きさです
任 | `x` | (元の値) | `2` | 更新後のキャラクターの X 座標です
任 | `y` | (元の値) | `3` | 更新後のキャラクターの Y 座標です
任 | `initiative` | (元の値) | `5` | 更新後のキャラクターのイニシアティブ値 (行動値) です
任 | `rotation` | (元の値) | `` | 更新後のキャラクターの表示されるコマの傾き具合です
任 | `dogTag` | (元の値) | `4` | 更新後のキャラクターに振られる連番です
任 | `draggable` | (元の値) | `1` | 更新後にキャラクターをドラッグ(= 移動) できるかを設定します
任 | `isHide` | (元の値) | `1` | 更新後にキャラクターをマップマスクの下に隠すか否かを設定します
任 | `url` | (元の値) | `http://charasheet.vampire-blood.net/1352909` |　更新後のキャラクターの参照 URL です
任 | `info` | (元の値) | `今麻痺しています。カードは後4枚残しています` | 更新後のキャラクターのメモ欄に掲載する情報です
任 | `image` | (元の値) | `https://pbs.twimg.com/profile_images/852893935772905477/5YBolAUp_400x400.jpg` | 更新後のキャラクターのコマに使われる画像の URL です
任 | `counters` | (元の値) | `HP:32,MP:24,*poison:,*cat:1` | 更新後のイニシアティブ表に表示されるキャラクター情報です。更新・追加したい部分だけ記述すれば、指定しなかった部分は変更されません
任 | `statusAlias` | (元の値) | `poison:毒,cat:猫化` | 更新後のイニシアティブ表のエイリアスです。更新・追加したい部分だけ記述すれば、指定しなかった部分は変更されません

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result`    | `OK`     | 処理が正常終了したか否か。正常に更新できたら `OK` が、失敗したら理由が入ります
`data`    | 後述 | 追加したキャラクターデータが入ります。内容は addCharacter のものを参照してください

### レスポンス例

```json
{
	"result":"OK",
	"data":{
		"type":"characterData",
		"name":"ひつじ",
		"size":1,
		"x":8,
		"y":8,
		"draggable":true,
		"isHide":false,
		"initiative":0,
		"dogTag":0,
		"url":"",
		"info":"ひつじなの！",
		"imageName":"https://shunshun94.github.io/manaT/images/default.png",
		"statusAlias":{},
		"counters":{
			"HP":"32",
			"MP":"8",
			"English":"sheep"
		},
		"lastUpdate":1503784814633,
		"targetName":"ひつじ"
	}
}
```

## getCharacter

指定したキャラクターのデータを取得します。

### URL

`/getCharacter`

### 引数

引数は `removeCharacter` のものと同じです。

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
必 | `targetName` | - | `myName` | 取得するキャラクターの名前です。 `addCharacter` などで取得できる `name` の値を使います

### レスポンス

レスポンスは `changeCharacter` や `updateCharacter` 等と同じです。

キー  | 例            | 説明
----------- | ------------- | -----
`result`    | `OK`     | 処理が正常終了したか否か。正常に更新できたら `OK` が、失敗したら理由が入ります
`data`    | 後述 | 追加したキャラクターデータが入ります。内容は addCharacter のものを参照してください

### レスポンス例

```json
{
	"result":"OK",
	"data":{
		"type":"characterData",
		"name":"ひつじ",
		"size":1,
		"x":8,
		"y":8,
		"draggable":true,
		"isHide":false,
		"initiative":0,
		"dogTag":0,
		"url":"",
		"info":"ひつじなの！",
		"imageName":"https://shunshun94.github.io/manaT/images/default.png",
		"statusAlias":{},
		"counters":{
			"HP":"32",
			"MP":"8",
			"English":"sheep"
		},
		"lastUpdate":1503784814633,
	}
}
```

## getCharacters

指定した部屋の全キャラクターのデータを取得します。
どどんとふの WEBIF [refresh](http://www.dodontof.com/DodontoF/README.html#webIf_refresh) の一部と互換性を持たせています。

### URL

`/getCharacters`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
任 | `characters` | `0` | `1503793750633` | ここで指定した時間以降に更新があったデータのみを取得します。1970 年 1 月 1 日 (UTC) から始まるミリ秒単位の時刻値を入力してください

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に更新できたら `OK` が、失敗したら理由が入ります
`characters` | 後述 | キャラクターデータの配列が入ります。配列の内容は `getCharacter` 等と同じです
`lastUpdateTimes` | `{"characters":1503792479971}` | 取得したデータの最終更新時間を1970 年 1 月 1 日 (UTC) から始まるミリ秒単位の時刻値で表します

### レスポンス例

```json
{
	"result":"OK",
	"characters":[
		{
			"type":"characterData",
			"name":"koneko",
			"size":2,
			"x":0,
			"y":1,
			"draggable":true,
			"isHide":true,
			"initiative":9,
			"dogTag":1,
			"url":"https://shunshun94.github.io/manaT/",
			"info":"foo",
			"imageName":"https://shunshun94.github.io/manaT/images/default.png",
			"statusAlias":{
				"check":"abc",
				"check2":"def"
			},
			"counters":{
				"HP":"1",
				"MP":"1",
				"*check":"1"
			},
			"lastUpdate":1503792479971
		}
	],
	"lastUpdateTimes":{
		"characters":1503792479971
	}
}
```

## removeAll

全テナントのデータを削除します。
最終更新時が指定した時間以前の物のみ削除、ということもできます。

### URL

`/removeAll`

### 接続元制限があります

接続元のアドレスが 127.0.0.1 でなければ失敗するようになっています。
実行する際はまなてぃを実行したマシンから　`127.0.0.1:3001/removeAll` に対してアクセスして実行してください。

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `characters` | 今の時間 | `1503793750633` | 最終更新時間がここで指定した時間以前のデータのみを削除します。1970 年 1 月 1 日 (UTC) から始まるミリ秒単位の時刻値を入力してください。指定がない場合はすべて削除します

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に更新できたら `OK` が、失敗したら理由が入ります

## getAll

全テナントのデータを取得します。

### URL

`/getAll`


### 接続元制限があります

接続元のアドレスが 127.0.0.1 でなければ失敗するようになっています。
実行する際はまなてぃを実行したマシンから　`127.0.0.1:3001/getAll` に対してアクセスして実行してください。

### 引数

なし

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に更新できたら `OK` が、失敗したら理由が入ります
`data` | - | 全テナント・全部屋の情報が連想配列の形で入っています
