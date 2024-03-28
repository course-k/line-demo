// モジュールのインポート
const https = require("https");
const express = require("express");
const fs = require("fs");

// 環境変数の取得
// ポート番号
const PORT = process.env.PORT || 3000;
// Messaging APIを呼び出すためのトークン
const TOKEN = process.env.LINE_ACCESS_TOKEN;

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + TOKEN,
};

const HOSTNAME = "api.line.me";

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
      const userData = {
        userId: req.body.events[0].source.userId
      }
      fs.writeFileSync('./user_data.json', JSON.stringify(userData));
  }
  autoReply(req, messages);
});

app.get("/push", (req, res) => {
  res.send("HTTP POST request sent to the webhook URL!");
  const messages = [{ type: "text", text: "Nice to meet you!", }];
  pushMessage(messages);
});

// リスナーの設定
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

function autoReply(req, messages) {

  const dataString = JSON.stringify({
    replyToken: req.body.events[0].replyToken,
    messages: messages,
  });
  const webhookOptions = {
    hostname: HOSTNAME,
    path: "/v2/bot/message/reply",
    method: "POST",
    headers: HEADERS,
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

function pushMessage(messages) {
  const userData = fs.readFileSync('./user_data.json', 'utf-8');
  const userId = userData.userId;
  const dataString = JSON.stringify({
    to: userId,
    messages: messages,
  });
  const webhookOptions = {
    hostname: HOSTNAME,
    path: "/v2/bot/message/push",
    method: "POST",
    headers: HEADERS,
    body: dataString,
  }
  console.log(dataString);
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