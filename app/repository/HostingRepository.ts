import { AbstractRepository } from "@/app/repository/AbstractRepository";
import { AddHostingInterface } from "@/app/interface/Hosting.interface";

interface Params {
  fullAccess?: boolean;
  spotlight?: boolean;
}

class HostingRepository extends AbstractRepository {
  async getAll(params: Params) {
    return await this.client.get("/api/hosting", {
      params: params,
    });
  }

  async getHosting(id: string | string[]) {
    return await this.client.get("/api/hosting/" + id);
  }

  async delete(id: string) {
    return await this.client.delete("/api/hosting/" + id, {
      withCredentials: true,
    });
  }

  async updateHosting(
    id: string | string[],
    hosting: AddHostingInterface,
    beds?: { bedId: string; quantity: number }[],
    equipments?: string[],
    images?: File[],
    imageToDelete?: string[],
  ) {
    const formData = new FormData();

    if (hosting.name !== undefined) {
      formData.append("name", hosting.name);
    }
    if (hosting.description !== undefined) {
      formData.append("description", hosting.description);
    }
    if (hosting.visible !== undefined) {
      formData.append("visible", hosting.visible.toString());
    }
    if (hosting.isSpotlight !== undefined) {
      formData.append("isSpotlight", hosting.isSpotlight.toString());
    }
    if (hosting.price !== undefined) {
      formData.append("price", hosting.price.toString());
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
    hosting,
    equipments,
    beds,
    images,
  }: {
    hosting: AddHostingInterface;
    equipments: string[];
    beds: { bedId: string; quantity: number }[];
    images: File[];
  }) {
    const formData = new FormData();

    formData.append("name", hosting.name);
    formData.append("description", hosting.description);
    formData.append("price", hosting.price.toString());
    formData.append("visible", hosting.visible.toString());
    formData.append("isSpotlight", hosting.isSpotlight.toString());
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
