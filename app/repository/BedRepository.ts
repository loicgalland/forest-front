import { AbstractRepository } from "@/app/repository/AbstractRepository";

class BedRepository extends AbstractRepository {
  async getAll() {
    return await this.client.get("/api/bed");
  }

  async post(name: string, place: number) {
    return await this.client.post(
      "/api/bed",
      { name, place },
      {
        withCredentials: true,
      },
    );
  }
}

export default new BedRepository();
