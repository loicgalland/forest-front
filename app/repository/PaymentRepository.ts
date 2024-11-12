import { AbstractRepository } from "@/app/repository/AbstractRepository";

class PaymentRepository extends AbstractRepository {
  async post(amount: number, currency: string, bookingId: string) {
    return await this.client.post(
      "/api/payment/stripe-session",
      { amount, currency, bookingId },
      {
        withCredentials: true,
      },
    );
  }
}

export default new PaymentRepository();
