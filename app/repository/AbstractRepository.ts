import axios from "axios";

export class AbstractRepository {
    client
    constructor() {
        this.client = axios.create({
            baseURL: 'http://localhost:8000'
        });
    }
}