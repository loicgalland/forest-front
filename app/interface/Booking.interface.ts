export interface BookingInterface {
  _id: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  userId: string;
  numberOfPerson: number;
  hostingId?: string | string[];
  activities?: { activityId: string; date: Date }[];
  activityDate?: Date | Date[];
  eventId?: string | string[];
  status: string;
  totalPrice: number;
}

export interface BookingFullInterface {
  _id: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  userId: string;
  numberOfPerson: number;
  hostingId?: { _id: string; name: string };
  activities?: { _id: string; name: string }[];
  activityDate?: Date | Date[];
  events?: { _id: string; name: string }[];
  status: string;
  totalPrice: number;
}
