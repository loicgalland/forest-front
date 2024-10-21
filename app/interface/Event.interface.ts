import { FileInterface } from "@/app/interface/File.interface";

export interface EventInterface {
  _id: string;
  name: string;
  description: string;
  images?: FileInterface[];
  visible: boolean;
  capacity: number;
  price: number;
  date: Date | null;
  placeAvailable: number;
}
