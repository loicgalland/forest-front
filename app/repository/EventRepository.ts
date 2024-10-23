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
    return await this.client.delete("/api/event/" + id, {
      withCredentials: true,
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
    price?: number,
    date?: Date | null,
    images?: File[],
    capacity?: number,
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
    if (price !== undefined) {
      formData.append("price", price.toString());
    }
    if (date !== undefined) {
      formData.append("date", date?.toString() || "");
    }
    if (images) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }
    if (capacity !== undefined) {
      formData.append("capacity", capacity.toString());
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
