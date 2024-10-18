import { AbstractRepository } from "@/app/repository/AbstractRepository";

class ActivityRepository extends AbstractRepository {
  async getAll() {
    return await this.client.get("/api/activity");
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
}

export default new ActivityRepository();
