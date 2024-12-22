import axios from "axios";
import { LineMessage } from "./type";

export class LineApiService {
    private static readonly LINE_MESSAGING_API = 'https://api.line.me/v2/bot';
    private static readonly headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_ACCESS_TOKEN}`
    }
    static async replyMessage(replyToken: string, messages:LineMessage|LineMessage[]) {
        const url = `${this.LINE_MESSAGING_API}/message/reply`;
        const data = {
            replyToken,
            messages: Array.isArray(messages)? messages: [messages]
        };
        try {
            await axios.post(url, data, {headers:this.headers})
        } catch (error) {
            console.error('Erro sending reply:', error);
            throw error;
        }
    };
    static async pushMessage(to:string, messages: LineMessage | LineMessage[]) {
        const url = `${this.LINE_MESSAGING_API}/message/push`;
        const data = {
            to,
            messages:Array.isArray(messages)?messages:[messages]
        }

        try {
            await axios.post(url,data,{headers:this.headers});
        } catch (error) {
            console.error('Error sending push message:', error);
            throw error;
        }
    }
}