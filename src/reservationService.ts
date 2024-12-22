import { ReservationData } from "./type";

export class ReservationService {
  private static reservations: Map<string, ReservationData> = new Map();

  static async getReservation(userId: string): Promise<ReservationData | null> {
    return {
      status: "confirmed",
      shopImage: "https://example.com/shop-image.jpg",
      dateTime: "2024年12月25日 18:00",
      shopName: "サンプルレストラン 渋谷店",
      numberOfPeople: 4,
      reservationId: "R2024122501",
      qrCodeUrl: "https://example.com/qr-code.png",
      mapUrl: "https://example.com/map",
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
