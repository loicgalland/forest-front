import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;

export class AbstractRepository {
  client;
  constructor() {
    this.client = axios.create({
      baseURL: url,
    });
  }
}
