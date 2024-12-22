import * as https from "https";
import express, { Request, Response } from "express";
import * as fs from "fs";
import { WebhookEvent } from "./type";
import { ReservationService } from "./reservationService";
import { FlexMessageService } from "./flexMessageService";
import { LineApiService } from "./LineApiService";
import path from "path";

// 型定義
interface UserData {
  userId: string;
}

interface FlexBox {
  type: "box";
  layout: "vertical" | "horizontal";
  contents: Array<FlexComponent>;
}

interface FlexText {
  type: "text";
  text: string;
}

type FlexComponent = FlexBox | FlexText;

interface FlexBubbleStyles {
  header?: {
    backgroundColor?: string;
  };
  hero?: {
    backgroundColor?: string;
    separator?: boolean;
    separatorColor?: string;
  };
  body?: {
    backgroundColor?: string;
    separator?: boolean;
    separatorColor?: string;
  };
  footer?: {
    backgroundColor?: string;
    separator?: boolean;
    separatorColor?: string;
  };
}

interface FlexBubble {
  type: "bubble";
  header?: FlexBox;
  hero?: FlexBox;
  body?: FlexBox;
  footer?: FlexBox;
  styles?: FlexBubbleStyles;
}

interface FlexMessage {
  type: "flex";
  altText: string;
  contents: FlexBubble;
}

interface TextMessage {
  type: "text";
  text: string;
}

type Message = FlexMessage | TextMessage;

// 環境変数の取得
const PORT: number = Number(process.env.PORT) || 3000;
const TOKEN: string = process.env.LINE_ACCESS_TOKEN || "";

const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

const HOSTNAME = "api.line.me";

// Expressアプリケーションオブジェクトの生成
const app = express();

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルーティングの設定-ドメインのルート
app.get("/", (_: Request, res: Response) => {
  res.sendStatus(200);
});

// ルーティングの設定-MessagingAPI
app.post("/webhook", async (req: Request, res: Response) => {
  try {
    await Promise.all(
      req.body.events.map(async (event: WebhookEvent) => {
        switch (event.type) {
          case "message":
            await handleMesssageEvent(event);
            break;
          case "postback":
            await handolePostbackEvent(event);
            break;
        }
      })
    );
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
const handleMesssageEvent = async (event: WebhookEvent) => {
  if (event.message?.type === "text" && event.message.text === "予約確認") {
    const reservation = await ReservationService.getReservation(
      event.source.userId
    );
    if (reservation) {
      const flexMessage = FlexMessageService.createReservationFlex(reservation);
      await LineApiService.replyMessage(event.replyToken, flexMessage);
    } else {
      await LineApiService.replyMessage(event.replyToken, {
        type: "text",
        text: "現在、予約情報がありません。",
      });
    }
  }
};

const handolePostbackEvent = async (event: WebhookEvent) => {
  if (!event.postback) return;

  const data = new URLSearchParams(event.postback.data);
  const action = data.get("action");
  const reservationId = data.get("reservationId");
  if (action === "cancel" && reservationId) {
    const reservation = await ReservationService.cancelReservation(
      reservationId
    );
    if (reservation) {
      const flexMessage = FlexMessageService.createReservationFlex(reservation);
      await LineApiService.replyMessage(event.replyToken, [
        {
          type: "text",
          text: "予約をキャンセルしました。",
        },
        flexMessage,
      ]);
    }
  }
};

// リスナーの設定
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

function pushMessage(messages: Message[]): void {
  console.log("pushmessage called");

  try {
    const userData: UserData = JSON.parse(
      fs.readFileSync("./user_data.json", "utf-8")
    );
    const userId = userData.userId;
    const dataString = JSON.stringify({
      to: userId,
      messages: messages,
    });

    const webhookOptions: https.RequestOptions = {
      hostname: HOSTNAME,
      path: "/v2/bot/message/push",
      method: "POST",
      headers: HEADERS,
      // body は RequestOptions に含まれないので削除
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
  } catch (error) {
    console.error("Error in pushMessage:", error);
  }
}
