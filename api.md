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
`result` | `OK`     | 処理が正常終了したか否か。正常に取得できたら `OK` が、失敗したら理由が入ります
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

## addObject

任意のオブジェクトを追加します。
より用途が明確なオブジェクトを追加するための API (addCharacter や addMemo 等) が別途用意されています。

### URL

`/addObject`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
必 | `type` | - | `dummyType` | オブジェクトの型です。同じ種類のオブジェクトは同じ値になります
任 | `imgId` | `(type)_(メモを追加した時間)` | `dummyType_001` | オブジェクトに与えられる ID です。部屋の中で一意である必要があります。  `name` `targetName` `targetId` でも指定できます
任 | `上記以外の任意` | - | `任意の値` | オブジェクトの持つ値です

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に追加できたら `OK` が、失敗したら理由が入ります
`data` | 後述 | 追加されたオブジェクトの中身が入ります。

### レスポンス例

```json
{
	"result":"OK",
	"data":{
		"type":"dummy",
		"value":"ひよこ",
		"imgId":"dummy_1510070022771",
		"lastUpdate":1510070022771
	}
}
```

## addFloorTile

フロアタイルを追加します。

### URL

`/addFloorTile`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
任 | `imgId` | `floorTile_(フロアタイルを追加した時間)` | `floorTile_001` | オブジェクトに与えられる ID です。部屋の中で一意である必要があります。 `name` `targetName` `targetId` でも指定できます
任 | `width` | `1` | `3` | フロアタイルの横幅です
任 | `height` | `1` | `3` | フロアタイルの縦幅です
任 | `x` | `0` | `3` | フロアタイルの x 座標です
任 | `y` | `0` | `3` | フロアタイルの y 座標です
任 | `imageUrl` | `(いずれかのデフォルト画像)` | `http://picture.store.example.com/floorTile.png` | フロアタイルの画像です。`image` `imageSource` でも指定できます

### レスポンス・レスポンス例

addObject 参照

## addDiceSymbol

ダイスシンボルを追加します。

### URL

`/addDiceSymbol`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
任 | `imgId` | `diceSymbol_(ダイスシンボルを追加した時間)` | `diceSymbol_001` | オブジェクトに与えられる ID です。部屋の中で一意である必要があります。 `name` `targetName` `targetId` でも指定できます
任 | `x` | `0` | `3` | ダイスシンボルの x 座標です
任 | `y` | `0` | `3` | ダイスシンボルの y 座標です
任 | `number` | `1` | `8` | ダイス目です
任 | `maxNumber` | `6` | `10` | ダイスの最大の目です。例えば、10面ダイスを想定してれば10になります
任 | `owner` | - | `user_01` | ダイスシンボルの持ち主です

### レスポンス・レスポンス例

addObject 参照


## addMapMask

マップマスクを追加します。

### URL

`/addMapMask`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
任 | `imgId` | `mapMask_(マップマスクを追加した時間)` | `mapMask_001` | オブジェクトに与えられる ID です。部屋の中で一意である必要があります。 `name` `targetName` `targetId` でも指定できます
任 | `width` | `1` | `3` | マップマスクの横幅です
任 | `height` | `1` | `3` | マップマスクの縦幅です
任 | `x` | `0` | `3` | マップマスクの x 座標です
任 | `y` | `0` | `3` | マップマスクの y 座標です
任 | `color` | `16711680` | `255` | マップマスクの色です。16進数6桁のカラーコードを10新法に直したもので指定します
任 | `alpha` | `0.5` | `0.2` | マップマスクの透明度です。0～1で指定します。 `opacity` でも指定できます


### レスポンス・レスポンス例

addObject 参照



## addMapMarker

マップマーカーを追加します。

### URL

`/addMapMarker`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
任 | `imgId` | `mapMarker_(マップマーカーを追加した時間)` | `mapMarker_001` | オブジェクトに与えられる ID です。部屋の中で一意である必要があります。 `name` `targetName` `targetId` でも指定できます
任 | `message` | `-` | `情報` | マップマーカーに記述される情報です
任 | `width` | `1` | `3` | マップマーカーの横幅です
任 | `height` | `1` | `3` | マップマーカーの縦幅です
任 | `x` | `0` | `3` | マップマーカーの x 座標です
任 | `y` | `0` | `3` | マップマーカーの y 座標です
任 | `color` | `false` | `255` | マップマーカーの色です。16進数6桁のカラーコードを10新法に直したもので指定します
任 | `isPaint` | `false` | `true` | マップマーカーの中を塗りつぶすか否かを指定します



### レスポンス・レスポンス例

addObject 参照


## addChit

チットを追加します。

### URL

`/addChit`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
任 | `imgId` | `chit_(チットを追加した時間)` | `chit_001` | オブジェクトに与えられる ID です。部屋の中で一意である必要があります。 `name` `targetName` `targetId` でも指定できます
任 | `info` | `-` | `情報` | チットに記述される情報です。`message` でも指定できます
任 | `width` | `1` | `3` | チットの横幅です
任 | `height` | `1` | `3` | チットの縦幅です
任 | `x` | `0` | `3` | チットの x 座標です
任 | `y` | `0` | `3` | チットの y 座標です
任 | `imageUrl` | `https://shunshun94.github.io/manaT/images/default.png` | `http://picture.store.example.com/myCharacter.png` | チットの画像です。`image` `imageSource` でも指定できます


### レスポンス・レスポンス例

addObject 参照



## addMemo

メモを追加します。どどんとふの WEBIF [addMemo](http://www.dodontof.com/DodontoF/README.html#webIf_addMemo) と引数などの面で互換性があります。

### URL

`/addMemo`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
必 | `message` | - | `共有したい情報` | メモの内容です
任 | `imgId` | `memo_(メモを追加した時間)` | `myMemo_001` | メモに与えられる ID です。部屋の中で一意である必要があります。 `name` でも指定できます

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に追加できたら `OK` が、失敗したら理由が入ります
`data` | 後述 | 追加されたメモの中身が入ります。

### レスポンス例

```json
{
	"result":"OK",
	"data":{
		"type":"memo",
		"imgId":"memo_1504970408416",
		"message":"ひよこ",
		"rotation":0,
		"draggable":true,
		"y":0,
		"x":0,
		"width":1,
		"lastUpdate":1504970408418
	}
}
```

## removeObject

オブジェクトを削除します。

### URL

`/removeObject`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
必 | `targetId` | - | `myMemo_001` | 削除するオブジェクトの ID です。オブジェクトの情報に含まれている `imgId` の値です。 `targetName` `imgId` でも指定できます

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に削除できたら `OK` が、失敗したら理由が入ります

### レスポンス例

```json
{
	"result":"OK"
}
```

## changeObject

オブジェクトを更新します。

### URL

`/changeObject`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
必 | `targetId` | - | `myMemo_001` | 更新するメモの ID です。メモの情報に含まれている `imgId` の値です。 `targetName` `imgId` でも指定できます
任 | `上記以外の任意` | - | `任意の値` | オブジェクトの持つ値を更新・追加します

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に更新できたら `OK` が、失敗したら理由が入ります
`data` | 後述 | 更新後のメモの中身が入ります。

### レスポンス例

addObject と同じであるため省略


## getObjects

部屋内にあるオブジェクトを取得します。

## URL

`/getObjets`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
任 | `type` | - | `memo` | 取得するオブジェクトの型を指定します。指定した場合、その型のオブジェクトのみを取得します

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に取得できたら `OK` が、失敗したら理由が入ります
`characters` | 後述 | オブジェクトの配列が入ります。配列の内容は `getCharacters` 等と同じです
`lastUpdateTimes` | `{"characters":1503792479971}` | 取得したデータの最終更新時間を1970 年 1 月 1 日 (UTC) から始まるミリ秒単位の時刻値で表します

## changeMemo

メモを更新します。どどんとふの WEBIF [changeMemo](http://www.dodontof.com/DodontoF/README.html#webIf_changeMemo) と引数などの面で互換性があります。

### URL

`/changeMemo`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
必 | `message` | - | `共有したい情報だよ` | 更新後のメモの内容です
必 | `targetId` | - | `myMemo_001` | 更新するメモの ID です。メモの情報に含まれている `imgId` の値です。 `targetName` `imgId` でも指定できます

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に更新できたら `OK` が、失敗したら理由が入ります
`data` | 後述 | 更新後のメモの中身が入ります。

### レスポンス例

```json
{
	"result":"OK",
	"data":{
		"type":"memo",
		"imgId":"memo_1504970408416",
		"message":"ひよこだよー",
		"rotation":0,
		"draggable":true,
		"y":0,
		"x":0,
		"width":1,
		"lastUpdate":1504970508438
	}
}
```

## removeMemo

removeObject と同じです。

### URL

`/removeMemo`

## getMemos

指定した部屋の全メモのデータを取得します。
どどんとふの WEBIF [refresh](http://www.dodontof.com/DodontoF/README.html#webIf_refresh) の一部と互換性を持たせています。

### URL

`/getMemos`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
任 | `characters` | `0` | `1503793750633` | ここで指定した時間以降に更新があったメモのみを取得します。1970 年 1 月 1 日 (UTC) から始まるミリ秒単位の時刻値を入力してください

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に取得できたら `OK` が、失敗したら理由が入ります
`characters` | 後述 | メモデータの配列が入ります。配列の内容は `addMemo` 等の `data` と同じです

### レスポンス例

```json
{
	"result":"OK",
	"memos":[
		{
			"type":"memo",
			"imgId":"memo_1504970408416",
			"message":"ひよこ",
			"rotation":0,
			"draggable":true,
			"y":0,
			"x":0,
			"width":1,
			"lastUpdate":1504970408418
		},
		{
			"type":"memo",
			"imgId":"memo_1504970408433",
			"message":"ひつじ",
			"rotation":0,
			"draggable":true,
			"y":0,
			"x":0,
			"width":1,
			"lastUpdate":1504970408433
		}
	]
}
```

## setMap

部屋のマップ情報を更新します。

### URL

`/setMap`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
任 | `image` | 現在の値 | `https://shunshun94.github.io/manaT/images/background.jpg` | マップの背景画像を指定します。指定しなければ変化しません。 `imageSource` でも指定できます
任 | `xMax` | 現在の値 | `25` | マップの横幅を指定します。指定しなければ変化しません。 `width` `x` `size` でも指定できます (`size` の場合は `xMax` と `yMax` が同じ値になります)。
任 | `yMax` | 現在の値 | `20` | マップの縦幅を指定します。指定しなければ変化しません。 `height` `y` `size` でも指定できます (`size` の場合は `xMax` と `yMax` が同じ値になります)。 

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に更新できたら `OK` が、失敗したら理由が入ります
`mapData` | 後述 | マップの情報が入ります。背景画像, 横幅 (`xMax`)、縦幅 (`yMax`) が入ります

### レスポンス例

```json
{
	"result":"OK",
	"mapData":{
		"mapData":{
			"imageSource":"https://shunshun94.github.io/manaT/images/background.jpg",
			"xMax":32,
			"yMax":18
		}
	}
}
```
## getMap

部屋のマップ情報を取得します。ただし、マップ上のオブジェクトの情報は含みません。
どどんとふの WEBIF [refresh](http://www.dodontof.com/DodontoF/README.html#webIf_refresh) の一部と互換性を持たせています。

### URL

`/getMap`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に取得できたら `OK` が、失敗したら理由が入ります
`mapData` | 後述 | マップの情報が入ります。背景画像, 横幅 (`xMax`)、縦幅 (`yMax`) が入ります

### レスポンス例

```json
{
	"result":"OK",
	"mapData":{
		"imageSource":"https://shunshun94.github.io/manaT/images/background.jpg",
		"xMax":32,
		"yMax":18
	},
	"lastUpdateTimes":{
		"map":1504970408470
	}
}
```


## refresh

部屋の各種情報を一括して取得します。

### url

`/refresh`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
任 | `characters` | `0` | `1503793750633` | 部屋のオブジェクト情報を取得したい場合に必要です。`getObjects` と同じです
任 | `map` | `0` | `t` | 部屋のマップ情報を取得したい場合に必要です。 `getMap` と同じです

### レスポンス

キー  | 例            | 説明
----------- | ------------- | -----
`result` | `OK`     | 処理が正常終了したか否か。正常に取得できたら `OK` が、失敗したら理由が入ります
`characters` | 後述 | キャラクターデータの配列が入ります。配列の内容は `getObject` と同じです。 `characters` を引数で与えていなければ値は返ってきません
`mapData` | 後述 | マップデータが入ります。データの内容は `getMap` と同じです。`map` を引数で与えていなければ値は返ってきません
`lastUpdateTimes` | `{"characters":1503792479971}` | 取得したデータの最終更新時間を1970 年 1 月 1 日 (UTC) から始まるミリ秒単位の時刻値で表します

## DodontoFServer.rb

どどんとふの WEB IF との互換性のためにある機能です。

### URL

`/DodontoFServer.rb`

### 引数

必須 | パラメータ  | デフォルト値 | 例 | 説明
----------- | ------------- | ----- | ----- | -----
任 | `tenant` | 接続元の IP アドレス | `myService` | テナント名が入ります。テナントについては [データ管理のしくみ](./data.md) をご覧ください
必 | `room` | - | `myRoom` | 部屋名です。任意の文字列が使えます。部屋については [データ管理のしくみ](./data.md) をご覧ください
必 | `webif` | - | `refresh` | 実行するコマンドの名称です。どどんとふの WEB IF と同じものを利用します。どどんとふの WEB IF については [「どどんとふ」マニュアル](http://www.dodontof.com/DodontoF/README.html#aboutWebIf) をご覧ください

他の引数については呼び出すコマンドを参照してください。

### 呼び出せるコマンド

`DodontoFServer.rb` はどどんとふのすべての WEB IF に対応しているわけではありません。
対応については以下をご覧ください。

webif 引数 | 呼び出されるコマンド | どんなコマンドか
--- | --- | ---
`addCharacter` | `addCharacter` | キャラクターを追加する
`changeCharacter` | `changeCharacter` | キャラクターを更新する
`addMemo` | `addMemo` | メモを追加する
`changeMemo` | `changeMemo` | メモを更新する
`refresh` | `refresh` | 部屋の各種情報を一括して取得する

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
