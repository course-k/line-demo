// モジュールのインポート
const https = require("https");
const express = require("express");

// 環境変数の取得
// ポート番号
const PORT = process.env.PORT || 3000;
// Messaging APIを呼び出すためのトークン
const TOKEN = process.env.LINE_ACCESS_TOKEN;

// Expressアプリケーションオブジェクトの生成
const app = express();

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));

// ルーティングの設定-ドメインのルート
app.get("/", (_, res) => {
  res.sendStatus(200);
});

//ルーティングの設定-MessaginAPI
app.post("/webhook", (req, res) => {
  res.send("HTTP POST request sent to the webhook URL!");
  let messages = [];
  switch (req.body.events[0].type) {
    case "message":
      messages.push({ type: "text", text: "Hello, user", })
      messages.push({ type: "text", text: "May I help you?", })
      break;
    case "follow":
      messages.push({ type: "text", text: "Nice to meet you!", });
  }
  autoReply(req, messages);
});

// リスナーの設定
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

function autoReply(req, messages) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + TOKEN,
  };
  const dataString = JSON.stringify({
    replyToken: req.body.events[0].replyToken,
    messages: messages,
  });
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