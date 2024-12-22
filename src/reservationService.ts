import { ReservationData } from "./type";

export class ReservationService {
  private static reservations: Map<string, ReservationData> = new Map();

  static async getReservation(userId: string): Promise<ReservationData | null> {
    return {
      status: "confirmed",
      shopImage: 'https://placehold.jp/42/3d4070/ffffff/300x150.png?text=%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%E7%94%BB%E5%83%8F',
      dateTime: "2024年12月25日 18:00",
      shopName: "サンプルレストラン 渋谷店",
      numberOfPeople: 4,
      reservationId: "R2024122501",
      qrCodeUrl: 'https://placehold.jp/42/fff08f/474747/150x150.png?text=QR%0A%E3%82%B3%E3%83%BC%E3%83%89',
      mapUrl: 'https://placehold.jp/42/8fffab/474747/300x300.png?text=%E5%9C%B0%E5%9B%B3',
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
