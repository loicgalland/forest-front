import { AbstractRepository } from "@/app/repository/AbstractRepository";
import { AddActivityInterface } from "@/app/interface/Activity.interface";

interface Params {
  fullAccess?: boolean;
  spotlight?: boolean;
}

class ActivityRepository extends AbstractRepository {
  async getAll(params: Params) {
    return await this.client.get("/api/activity", { params: params });
  }

  async getOne(id: string | string[]) {
    return await this.client.get("/api/activity/" + id);
  }

  async delete(id: string) {
    return await this.client.delete("/api/activity/" + id, {
      withCredentials: true,
    });
  }

  async post(activity: AddActivityInterface, images: File[]) {
    const formData = new FormData();

    formData.append("name", activity.name);
    formData.append("description", activity.description);
    formData.append("price", activity.price.toString());
    formData.append("visible", activity.visible.toString());
    formData.append("isSpotlight", activity.isSpotlight.toString());
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
    activity: AddActivityInterface,
    images?: File[],
    imageToDelete?: string[],
  ) {
    const formData = new FormData();

    if (activity.name !== undefined) {
      formData.append("name", activity.name);
    }
    if (activity.description !== undefined) {
      formData.append("description", activity.description);
    }
    if (activity.visible !== undefined) {
      formData.append("visible", activity.visible.toString());
    }
    if (activity.isSpotlight !== undefined) {
      formData.append("isSpotlight", activity.isSpotlight.toString());
    }
    if (activity.price !== undefined) {
      formData.append("price", activity.price.toString());
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
