/*パッケージのインポート */
// botがhttpリクエストを処理できるようにhttpsパッケージをインポート
const https = require("https");
// expressパッケージをインポート、インスタンス化
const express = require("express");
const app = express();

/* 環境変数の追加 */
// ポート番号の指定
const PORT = process.env.PORT || 3001;
// Messaging APIを呼び出すためのトークン（別の場所で指定）
const TOKEN = process.env.LINE_ACCESS_TOKEN;

/* ミドルウェアの設定 */
// リクエストオブジェクトをJSON、文字列、配列として扱うための関数
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));

/* ルーティングの設定 */
app.get("/", (_, res) => {
  res.sendStatus(200);
});

app.post("/webhook", (req, _) => {
  if (req.body.events[0].type === "message") {
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",
          text: "Hello, user",
        },
        {
          type: "text",
          text: "May I help you?"
        },
      ],
    });
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + TOKEN,
    };
    const webhookOptions = {
      hostname: "api.line.me",
      path: "/v2/bot/message/reply",
      method: "POST",
      headers: headers,
      body: dataString,
    }
    const request = https.request(webhookOptions, res => {
      res.on("data", d => {
        process.stdout.write(d);
      });
    });
    request.on("error", err => {
      console.error(err);
    });

    request.write(dataString);
    request.end();
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});