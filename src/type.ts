export interface WebhookEvent {
    type:string;
    message?:{
        type:string;
        text?:string;
    };
    postback?:{
        data:string;
    };
    replyToken:string;
    source:{
        userId:string;
        type:string;
    };
};

export interface LineMessage {
    type: string;
    text?: string;
    altText?:string;
    contents?: any;
}
export type ReservationStatus = "confirmed" | "pending" | "cancelled";


export interface StatusConfig {
  color: string;
  text: string;
}

export interface ReservationData {
  status: ReservationStatus;
  shopImage: string;
  dateTime: string;
  shopName: string;
  numberOfPeople: number;
  reservationId: string;
  qrCodeUrl?: string;
  mapUrl: string;
  userId: string;
}

export interface FlexMessage {
  type: "flex";
  altText: string;
  contents: {
    type: "bubble";
    header?: object;
    hero?: object;
    body?: object;
    footer?: object;
    styles?: {
      header?: object;
      hero?: object;
      body?: object;
      footer?: object;
    };
  };
}
