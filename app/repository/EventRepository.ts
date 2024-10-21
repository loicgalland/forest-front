import { AbstractRepository } from "@/app/repository/AbstractRepository";

class EventRepository extends AbstractRepository {
  async getAll() {
    return await this.client.get("/api/event");
  }

  async getAllVisible() {
    return await this.client.get("/api/event/visible");
  }

  async getOne(id: string | string[]) {
    return await this.client.get("/api/event/" + id);
  }

  async delete(id: string) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    return await this.client.delete("/api/event/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async post({
    name,
    description,
    price,
    visible,
    images,
    date,
    capacity,
  }: {
    name: string;
    description: string;
    price: number;
    visible: boolean;
    images: File[];
    date: Date | null;
    capacity: number;
  }) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      throw new Error("Utilisateur non authentifié");
    }
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("visible", visible.toString());
    images.forEach((image) => {
      formData.append("images", image);
    });
    if (date !== null) {
      formData.append("date", date.toISOString());
    }
    formData.append("capacity", capacity.toString());

    return await this.client.post("/api/event", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async update(id: string | string[], formData: FormData) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      throw new Error("Utilisateur non authentifié");
    }

    const url = "/api/event/" + id;
    return await this.client.patch(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new EventRepository();
