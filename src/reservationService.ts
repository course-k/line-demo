import { ReservationData } from "./type";

export class ReservationService {
  private static reservations: Map<string, ReservationData> = new Map();

  static async getReservation(userId: string): Promise<ReservationData | null> {
    const baseUrl = process.env.BASE_URL || "https://line-demo-1.onrender.com";
    return {
      status: "confirmed",
      shopImage: `${baseUrl}/static/images/shop.jpg`,
      dateTime: "2024年12月25日 18:00",
      shopName: "サンプルレストラン 渋谷店",
      numberOfPeople: 4,
      reservationId: "R2024122501",
      qrCodeUrl: `${baseUrl}/static/images/qr.jpg`,
      mapUrl: `${baseUrl}/static/images/map.jpg`,
      userId,
    };
  }
  static async cancelReservation(
    reservationId: string
  ): Promise<ReservationData | null> {
    const mockReservation = await this.getReservation("dummy-user-id");
    if (mockReservation) {
      mockReservation.status = "cancelled";
      return mockReservation;
    }
    return null;
  }
}
