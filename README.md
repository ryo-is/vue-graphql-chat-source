# vue-graphql-chat

AWSAmplifyとAWSAppSyncを使ってチャットできるアプリです。
amplify-cliなどで `aws-exports.js` を生成して、 `src` 直下に配置してください。
または `aws-exports-default.js` の内容を書き換えて、 `aws-exports.js` を生成してください。

Cognitoでログインしたユーザーが利用することができます。
ですので初めにCognitoにサインアップしてユーザーを作成してください。

AppSyncはCognito認証しているのでログインしないと呼び出せません。

## セットアップ

```
$ yarn (or npm i)
$ yarn serve
```
