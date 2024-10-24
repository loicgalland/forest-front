import { AbstractRepository } from "@/app/repository/AbstractRepository";
import { AddEventInterface } from "@/app/interface/Event.interface";

interface Params {
  fullAccess?: boolean;
  spotlight?: boolean;
}

class EventRepository extends AbstractRepository {
  async getAll(params: Params) {
    return await this.client.get("/api/event", { params: params });
  }

  async getOne(id: string | string[]) {
    return await this.client.get("/api/event/" + id);
  }

  async delete(id: string) {
    return await this.client.delete("/api/event/" + id, {
      withCredentials: true,
    });
  }

  async post(event: AddEventInterface, images: File[]) {
    const formData = new FormData();

    formData.append("name", event.name);
    formData.append("description", event.description);
    formData.append("price", event.price.toString());
    formData.append("visible", event.visible.toString());
    images.forEach((image) => {
      formData.append("images", image);
    });
    if (event.date !== null) {
      formData.append("date", event.date.toISOString());
    }
    formData.append("capacity", event.capacity.toString());

    return await this.client.post("/api/event", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  }

  async update(
    id: string | string[],
    event: AddEventInterface,
    images?: File[],
    imageToDelete?: string[],
  ) {
    const formData = new FormData();
    if (event.name !== undefined) {
      formData.append("name", event.name);
    }
    if (event.description !== undefined) {
      formData.append("description", event.description);
    }
    if (event.visible !== undefined) {
      formData.append("visible", event.visible.toString());
    }
    if (event.price !== undefined) {
      formData.append("price", event.price.toString());
    }
    if (event.date !== undefined) {
      formData.append("date", event.date?.toString() || "");
    }
    if (images) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }
    if (event.capacity !== undefined) {
      formData.append("capacity", event.capacity.toString());
    }
    if (imageToDelete) {
      formData.append("imageToDelete", JSON.stringify(imageToDelete));
    }

    const url = "/api/event/" + id;
    return await this.client.patch(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  }
}

export default new EventRepository();
