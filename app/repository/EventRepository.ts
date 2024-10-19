import { AbstractRepository } from "@/app/repository/AbstractRepository";

class EventRepository extends AbstractRepository {
  async getAll() {
    return await this.client.get("/api/event");
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
  }: {
    name: string;
    description: string;
    price: number;
    visible: boolean;
    images: File[];
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

    return await this.client.post("/api/event", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async update(
    id: string | string[],
    name?: string,
    descrption?: string,
    visible?: boolean,
    price?: number,
  ) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      throw new Error("Utilisateur non authentifié");
    }
    const formData = new FormData();

    if (name !== undefined) {
      formData.append("name", name);
    }
    if (descrption !== undefined) {
      formData.append("descrption", descrption);
    }
    if (visible !== undefined) {
      formData.append("visible", visible.toString());
    }
    if (price !== undefined) {
      formData.append("price", price.toString());
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
