import * as https from 'https';
import express, { Request, Response } from 'express';
import * as fs from 'fs';

// 型定義
interface UserData {
  userId: string;
}

interface WebhookEvent {
  type: string;
  source: {
    userId: string;
  };
}

interface FlexBox {
  type: 'box';
  layout: 'vertical' | 'horizontal';
  contents: Array<FlexComponent>;
}

interface FlexText {
  type: 'text';
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
  type: 'bubble';
  header?: FlexBox;
  hero?: FlexBox;
  body?: FlexBox;
  footer?: FlexBox;
  styles?: FlexBubbleStyles;
}

interface FlexMessage {
  type: 'flex';
  altText: string;
  contents: FlexBubble;
}

interface TextMessage {
  type: 'text';
  text: string;
}

type Message = FlexMessage | TextMessage;

// 環境変数の取得
const PORT: number = Number(process.env.PORT) || 3000;
const TOKEN: string = process.env.LINE_ACCESS_TOKEN || '';

const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`
};

const HOSTNAME = 'api.line.me';

// Expressアプリケーションオブジェクトの生成
const app = express();

// ミドルウェアの設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルーティングの設定-ドメインのルート
app.get('/', (_: Request, res: Response) => {
  res.sendStatus(200);
});

// ルーティングの設定-MessagingAPI
app.post('/webhook', (req: Request, res: Response) => {
  res.send('HTTP POST request sent to the webhook URL!');
  const messages: Message[] = [];
  
  if (req.body.events && req.body.events.length > 0) {
    const event: WebhookEvent = req.body.events[0];
    
    switch (event.type) {
      case 'follow':
        messages.push({ type: 'text', text: 'Nice to meet you!' });
        const userData: UserData = {
          userId: event.source.userId
        };
        fs.writeFileSync('./user_data.json', JSON.stringify(userData));
        break;
    }
  }
});

app.get('/basic-flex', (_: Request, res: Response) => {
  res.send('Flex request sent to the webhook URL!');
  
  // headerブロック
  const header: FlexBox = {
    type: 'box',
    layout: 'vertical',
    contents: [
      { type: 'text', text: 'Header' }
    ]
  };

  // heroブロック
  const hero: FlexBox = {
    type: 'box',
    layout: 'vertical',
    contents: [
      { type: 'text', text: 'hero' }
    ]
  };

  // bodyブロック
  const body: FlexBox = {
    type: 'box',
    layout: 'vertical',
    contents: [
      { type: 'text', text: 'body' }
    ]
  };

  // footerブロック
  const footer: FlexBox = {
    type: 'box',
    layout: 'vertical',
    contents: [
      { type: 'text', text: 'footer' }
    ]
  };

  const messages: Message[] = [
    {
      type: 'flex',
      altText: 'This is a flex message.',
      contents: {
        type: 'bubble',
        header,
        hero,
        body,
        footer,
        styles: {
          header: {
            backgroundColor: '#FFB5C5'
          },
          hero: {
            backgroundColor: '#B5D8FF',
            separator: true,
            separatorColor: '#FFFFFF'
          },
          body: {
            backgroundColor: '#FFECB3',
            separator: true,
            separatorColor: '#FFFFFF'
          },
          footer: {
            backgroundColor: '#B8E6C0',
            separator: true,
            separatorColor: '#FFFFFF'
          }
        }
      }
    }
  ];
  
  pushMessage(messages);
});

// リスナーの設定
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

function pushMessage(messages: Message[]): void {
  console.log('pushmessage called');
  
  try {
    const userData: UserData = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
    const userId = userData.userId;
    const dataString = JSON.stringify({
      to: userId,
      messages: messages
    });

    const webhookOptions: https.RequestOptions = {
      hostname: HOSTNAME,
      path: '/v2/bot/message/push',
      method: 'POST',
      headers: HEADERS,
      // body は RequestOptions に含まれないので削除
    };

    const request = https.request(webhookOptions, (res) => {
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });

    request.on('error', (err) => {
      console.error(err);
    });

    request.write(dataString);
    console.log('pushmessage done');
    request.end();
  } catch (error) {
    console.error('Error in pushMessage:', error);
  }
}