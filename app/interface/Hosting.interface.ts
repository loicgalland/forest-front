import { EquipmentInterface } from "@/app/interface/Equipment.interface";
import { BedInterface } from "@/app/interface/Bed.interface";
import { FileInterface } from "@/app/interface/File.interface";

export interface HostingInterface {
  _id: string;
  name: string;
  description: string;
  images?: FileInterface[];
  isSpotlight: boolean;
  visible: boolean;
  capacity: number;
  price: number;
  equipments: EquipmentInterface[];
  beds: { bed: BedInterface; quantity: number }[];
}
