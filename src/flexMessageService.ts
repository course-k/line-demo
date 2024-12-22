import { stat } from "fs";
import {
  FlexMessage,
  ReservationData,
  ReservationStatus,
  StatusConfig,
} from "./type";

export class FlexMessageService {
  private static readonly statusConfig: Record<
    ReservationStatus,
    StatusConfig
  > = {
    confirmed: { color: "#27AE60", text: "予約確定" },
    pending: { color: "#F1C40F", text: "確認待ち" },
    cancelled: { color: "#E74C3C", text: "キャンセル済" },
  };

  private static createInfoRow(label: string, value: string) {
    return {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: label,
          size: "sm",
          color: "#555555",
          flex: 2,
        },
        {
          type: "text",
          text: value,
          size: "sm",
          color: "#111111",
          flex: 4,
          wrap: true,
        },
      ],
    };
  }

  static createReservationFlex(reservationData: ReservationData): FlexMessage {
    const status = this.statusConfig[reservationData.status];
    const header = {
      type: "box",
      layout: "vertical",
      backgroundColor: status.color,
      contents: [
        {
          type: "text",
          text: status.text,
          color: "#FFFFFF",
          weight: "bold",
          size: "xl",
          align: "center",
        },
      ],
    };
    const hero = {
      type: "image",
      url: reservationData.shopImage,
      size: "full",
      aspectRatio: "20:13",
      aspectMode: "cover",
    };
    const body = {
      type: "box",
      layout: "vertical",
      spacing: "md",
      contents: [
        this.createInfoRow("予約日時", reservationData.dateTime),
        this.createInfoRow("店舗", reservationData.shopName),
        this.createInfoRow("人数", `${reservationData.numberOfPeople}名`),
        this.createInfoRow("予約番号", reservationData.reservationId),
      ],
    };
    if (reservationData.qrCodeUrl) {
      (body.contents as any[]).push({
        type: "image",
        url: reservationData.qrCodeUrl,
        size: "sm",
        aspectRatio: "1:1",
        margin: "md",
      });
    }
    const footer = {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          action: {
            type: "postback",
            label: "予約をキャンセル",
            data: `action=cancel&reservationId=${reservationData.reservationId}`,
          },
          style: "secondary",
          color: "#E74C3C",
        },
        {
          type: "button",
          action: {
            type: "uri",
            label: "お店の地図を見る",
            uri: reservationData.mapUrl,
          },
        },
      ],
    };

    return {
      type: "flex",
      altText: "予約確認",
      contents: {
        type: "bubble",
        header,
        hero,
        body,
        footer,
        styles: {
          header: {
            backgroundColor: status.color,
          },
          body: {
            separator: true,
          },
          footer: {
            separator: true,
          },
        },
      },
    };
  }
}
