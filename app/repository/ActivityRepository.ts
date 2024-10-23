import { AbstractRepository } from "@/app/repository/AbstractRepository";

class ActivityRepository extends AbstractRepository {
  async getAll() {
    return await this.client.get("/api/activity");
  }

  async getAllVisible() {
    return await this.client.get("/api/activity/visible");
  }

  async getSpotlight() {
    return await this.client.get("/api/activity/spotlight");
  }

  async getOne(id: string | string[]) {
    return await this.client.get("/api/activity/" + id);
  }

  async delete(id: string) {
    return await this.client.delete("/api/activity/" + id, {
      withCredentials: true,
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
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  }

  async update(
    id: string | string[],
    name?: string,
    description?: string,
    visible?: boolean,
    isSpotlight?: boolean,
    price?: number,
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
    if (images) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }
    if (imageToDelete) {
      formData.append("imageToDelete", JSON.stringify(imageToDelete));
    }

    const url = "/api/activity/" + id;
    return await this.client.patch(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  }
}

export default new ActivityRepository();
