import axios from "axios";

const url = "http://localhost:8000"!;

export class AbstractRepository {
  client;
  constructor() {
    this.client = axios.create({
      baseURL: url,
    });
  }
}
