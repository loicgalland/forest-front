import { AbstractRepository } from "@/app/repository/AbstractRepository";

class BedRepository extends AbstractRepository {
  async getAll() {
    return await this.client.get("/api/bed");
  }

  async post(name: string, place: number) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      throw new Error("Utilisateur non authentifié");
    }

    return await this.client.post(
      "/api/bed",
      { name, place },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
}

export default new BedRepository();
