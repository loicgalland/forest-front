import { AbstractRepository } from "@/app/repository/AbstractRepository";

class ActivityRepository extends AbstractRepository {
  async getAll() {
    return await this.client.get("/api/activity");
  }

  async getSpotlight() {
    return await this.client.get("/api/activity/spotlight");
  }

  async getOne(id: string | string[]) {
    return await this.client.get("/api/activity/" + id);
  }

  async delete(id: string) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    return await this.client.delete("/api/activity/" + id, {
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
    isSpotlight,
    images,
  }: {
    name: string;
    description: string;
    price: number;
    visible: boolean;
    isSpotlight: boolean;
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
    formData.append("isSpotlight", isSpotlight.toString());
    images.forEach((image) => {
      formData.append("images", image);
    });

    return await this.client.post("/api/activity", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async update(
    id: string | string[],
    name?: string,
    description?: string,
    visible?: boolean,
    isSpotlight?: boolean,
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
    if (description !== undefined) {
      formData.append("description", description);
    }
    if (visible !== undefined) {
      formData.append("visible", visible.toString());
    }
    if (isSpotlight !== undefined) {
      formData.append("isSpotlight", isSpotlight.toString());
    }
    if (price !== undefined) {
      formData.append("price", price.toString());
    }

    const url = "/api/activity/" + id;
    return await this.client.patch(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new ActivityRepository();
