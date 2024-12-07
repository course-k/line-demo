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
app.use(express.urlencoded({ extended: true }));

// ルーティングの設定-ドメインのルート
app.get("/", (_, res) => {
  res.sendStatus(200);
});

//ルーティングの設定-MessaginAPI
app.post("/webhook", (req, res) => {
  res.send("HTTP POST request sent to the webhook URL!");
  let messages = [];
  switch (req.body.events[0].type) {
    case "follow":
      messages.push({ type: "text", text: "Nice to meet you!" });
      const userData = {
        userId: req.body.events[0].source.userId,
      };
      fs.writeFileSync("./user_data.json", JSON.stringify(userData));
  }
});

app.get("/basic-flex", (req, res) => {
  res.send("Flex request sent to the webhook URL!");
  // headerブロック
  const header = {
    type: "box",
    layout: "vertical",
    contents: [
      // コンポーネント
      { type: "text", text: "Header" },
    ],
  };

  // heroブロック
  const hero = {
    type: "box",
    layout: "vertical",
    contents: [
      // コンポーネント
      { type: "text", text: "hero" },
    ],
  };

  // bodyブロック
  const body = {
    type: "box",
    layout: "vertical",
    contents: [
      // コンポーネント
      { type: "text", text: "body" },
    ],
  };

  // footerブロック
  const footer = {
    type: "box",
    layout: "vertical",
    contents: [
      // コンポーネント
      { type: "text", text: "footer" },
    ],
  };

  const messages = [
    {
      type: "flex",
      altText: "This is a flex message.",
      contents: {
        // コンテナ
        type: "bubble",
        header,
        hero,
        body,
        footer,
        styles: {
          header: {
            backgroundColor: "#FFB5C5",
          },
        },
      },
    },
  ];
  pushMessage(messages);
});

// リスナーの設定
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

function pushMessage(messages) {
  console.log("pushmessage called");
  const userData = JSON.parse(fs.readFileSync("./user_data.json", "utf-8"));
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
  };
  const request = https.request(webhookOptions, (res) => {
    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });
  request.on("error", (err) => {
    console.error(err);
  });

  request.write(dataString);
  console.log("pushmessage done");
  request.end();
}
