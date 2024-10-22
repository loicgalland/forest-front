import { AbstractRepository } from "@/app/repository/AbstractRepository";

class HostingRepository extends AbstractRepository {
  async getAll() {
    return await this.client.get("/api/hosting");
  }

  async getAllVisible() {
    return await this.client.get("/api/hosting/visible");
  }

  async getSpotlight() {
    return await this.client.get("/api/hosting/spotlight");
  }

  async getHosting(id: string | string[]) {
    return await this.client.get("/api/hosting/" + id);
  }

  async delete(id: string) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    return await this.client.delete("/api/hosting/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateHosting(
    id: string | string[],
    name?: string,
    description?: string,
    visible?: boolean,
    isSpotlight?: boolean,
    price?: number,
    beds?: { bedId: string; quantity: number }[],
    equipments?: string[],
    images?: File[],
    imageToDelete?: string[],
  ) {
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
    if (beds && beds.length) {
      beds.forEach((bed, index) => {
        formData.append(`beds[${index}][bedId]`, bed.bedId);
        formData.append(`beds[${index}][quantity]`, bed.quantity.toString());
      });
    }
    if (equipments && equipments.length) {
      equipments.forEach((equipmentId: string) => {
        formData.append("equipments[]", equipmentId);
      });
    }
    if (images) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }
    if (imageToDelete) {
      formData.append("imageToDelete", JSON.stringify(imageToDelete));
    }

    const url = "/api/hosting/" + id;
    return await this.client.patch(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  }

  async postHosting({
    name,
    description,
    price,
    visible,
    isSpotlight,
    equipments,
    beds,
    images,
  }: {
    name: string;
    description: string;
    price: number;
    visible: boolean;
    isSpotlight: boolean;
    equipments: string[];
    beds: { bedId: string; quantity: number }[];
    images: File[];
  }) {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("visible", visible.toString());
    formData.append("isSpotlight", isSpotlight.toString());
    formData.append("beds", JSON.stringify(beds));
    formData.append("equipments", JSON.stringify(equipments));

    images.forEach((image) => {
      formData.append("images", image);
    });

    return await this.client.post("/api/hosting", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  }
}

export default new HostingRepository();
