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
app.use(
  express.urlencoded({
    extended: true,
  })
);

/* ルーティングの設定 */
app.get("/", (_, res) => {
  res.sendStatus(200);
});

app.post("/webhook", function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!");
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
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});



// const express = require("express");
// const app = express();
// const port = process.env.PORT || 3001;

// app.get("/", (req, res) => res.type('html').send(html));

// const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// server.keepAliveTimeout = 120 * 1000;
// server.headersTimeout = 120 * 1000;

// const html = `
// <!DOCTYPE html>
// <html>
//   <head>
//     <title>Hello from Render!</title>
//     <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
//     <script>
//       setTimeout(() => {
//         confetti({
//           particleCount: 100,
//           spread: 70,
//           origin: { y: 0.6 },
//           disableForReducedMotion: true
//         });
//       }, 500);
//     </script>
//     <style>
//       @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
//       @font-face {
//         font-family: "neo-sans";
//         src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
//         font-style: normal;
//         font-weight: 700;
//       }
//       html {
//         font-family: neo-sans;
//         font-weight: 700;
//         font-size: calc(62rem / 16);
//       }
//       body {
//         background: white;
//       }
//       section {
//         border-radius: 1em;
//         padding: 1em;
//         position: absolute;
//         top: 50%;
//         left: 50%;
//         margin-right: -50%;
//         transform: translate(-50%, -50%);
//       }
//     </style>
//   </head>
//   <body>
//     <section>
//       Hello from Render!
//     </section>
//   </body>
// </html>
// `
