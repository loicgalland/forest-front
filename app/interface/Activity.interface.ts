import { FileInterface } from "@/app/interface/File.interface";

export interface ActivityInterface {
  _id: string;
  name: string;
  description: string;
  images?: FileInterface[];
  isSpotlight: boolean;
  visible: boolean;
  capacity: number;
  price: number;
  date?: Date | null;
}

export interface AddActivityInterface {
  name: string;
  description: string;
  images?: FileInterface[];
  isSpotlight: boolean;
  visible: boolean;
  capacity: number;
  price: number;
  date?: Date | null;
}
