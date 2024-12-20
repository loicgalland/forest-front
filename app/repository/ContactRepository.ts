import { AbstractRepository } from "@/app/repository/AbstractRepository";

class ContactRepositoryClass extends AbstractRepository {
  async sendContact(subject: string, sender: string, message: string) {
    return await this.client.post("/api/contact", {
      subject: subject,
      sender: sender,
      message: message,
    });
  }
}

export const ContactRepository = new ContactRepositoryClass();
