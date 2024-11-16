import { AbstractRepository } from "@/app/repository/AbstractRepository";

class PaymentRepositoryClass extends AbstractRepository {
  async post(amount: number, currency: string, bookingId: string) {
    return await this.client.post(
      "/api/payment/stripe-session",
      { amount, currency, bookingId },
      {
        withCredentials: true,
      },
    );
  }

  async cashBack(bookingId: string) {
    return await this.client.post(
      "/api/payment/stripe-cash-back/" + bookingId,
      null,
      { withCredentials: true },
    );
  }
}

export const PaymentRepository = new PaymentRepositoryClass();
