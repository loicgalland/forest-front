import { EquipmentInterface } from "@/app/interface/Equipment.interface";
import { BedInterface } from "@/app/interface/Bed.interface";

export interface HostingInterface {
  _id: string;
  name: string;
  description: string;
  images?: string;
  isSpotlight: boolean;
  visible: boolean;
  capacity: number;
  price: number;
  equipments: EquipmentInterface[];
  beds: { bed: BedInterface; quantity: number }[];
}
