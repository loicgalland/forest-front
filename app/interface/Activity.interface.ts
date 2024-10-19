export interface ActivityInterface {
  _id: string;
  name: string;
  description: string;
  images?: string[];
  isSpotlight: boolean;
  visible: boolean;
  capacity: number;
  price: number;
}
