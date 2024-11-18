import { AbstractRepository } from "@/app/repository/AbstractRepository";

class BookingRepositoryClass extends AbstractRepository {
  async getAllBookingsForHosting(id: string | string[]) {
    const url = "/api/booking/" + id;
    return await this.client.get(url, {
      withCredentials: true,
    });
  }

  async getAllBooking() {
    return await this.client.get("/api/booking", { withCredentials: true });
  }

  async getAllUserBookings(id: string | string[]) {
    const url = "/api/booking/user/" + id;
    return await this.client.get(url, {
      withCredentials: true,
    });
  }

  async update(id: string, status: string) {
    const url = "/api/booking/" + id;
    return await this.client.put(
      url,
      { status },
      {
        withCredentials: true,
      },
    );
  }

  async refundRequest(id: string) {
    const url = "/api/booking/refund/" + id;
    return await this.client.get(url, { withCredentials: true });
  }

  async bookingConfirmation(id: string) {
    const url = "/api/booking/confirmation/" + id;
    return await this.client.get(url, { withCredentials: true });
  }

  async post({
    startDate,
    endDate,
    duration,
    userId,
    numberOfPerson,
    hostingId,
    activities,
    events,
    totalPrice,
  }: {
    startDate?: Date;
    endDate?: Date;
    duration?: number;
    userId: string;
    numberOfPerson: number;
    hostingId?: string | string[];
    activities?: string[];
    events?: string[];
    totalPrice: number;
  }) {
    return await this.client.post(
      "/api/booking",
      {
        startDate,
        endDate,
        duration,
        userId,
        numberOfPerson,
        hostingId,
        activities,
        events,
        totalPrice,
      },
      {
        withCredentials: true,
      },
    );
  }
}

export const BookingRepository = new BookingRepositoryClass();
