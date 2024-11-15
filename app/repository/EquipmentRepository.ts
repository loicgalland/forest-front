import { AbstractRepository } from "@/app/repository/AbstractRepository";

class EquipmentRepositoryClass extends AbstractRepository {
  async getAll() {
    return await this.client.get("/api/equipment");
  }

  async post(name: string, type: string) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      throw new Error("Utilisateur non authentifié");
    }

    return await this.client.post(
      "/api/equipment",
      { name, type },
      {
        withCredentials: true,
      },
    );
  }
}

export const EquipmentRepository = new EquipmentRepositoryClass();
