import { AbstractRepository } from "@/app/repository/AbstractRepository";

class BookingRepository extends AbstractRepository {
  async getAllBookingsForHosting(id: string | string[]) {
    const url = "/api/booking/" + id;
    return await this.client.get(url, {
      withCredentials: true,
    });
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
    startDate: Date;
    endDate: Date;
    duration: number;
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

export default new BookingRepository();
