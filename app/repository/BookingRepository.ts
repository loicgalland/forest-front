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
    activityDate,
    eventId,
    totalPrice,
  }: {
    startDate: Date;
    endDate: Date;
    duration: number;
    userId: string;
    numberOfPerson: number;
    hostingId?: string | string[];
    activities?: { activityId: string; date: Date }[];
    activityDate?: Date | Date[];
    eventId?: string | string[];
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
        activityDate,
        eventId,
        totalPrice,
      },
      {
        withCredentials: true,
      },
    );
  }
}

export default new BookingRepository();
