import { AbstractRepository } from "@/app/repository/AbstractRepository";
import { isValidMail } from "@/app/services/authService";
import axios from "axios";

class AuthRepositoryClass extends AbstractRepository {
  async login(mail: string, password: string) {
    const validMail = isValidMail(mail);
    if (!validMail) {
      throw new Error("You should write a valid email");
    }
    try {
      return await this.client.post(
        "/api/auth/login",
        {
          email: mail,
          password: password,
        },
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data?.error?.message || "Something went wrong";
          const errorCode =
            error.response.data?.error?.code || error.response.status;
          throw new Error(errorMessage, errorCode);
        } else if (error.request) {
          throw new Error("No response received from the server.");
        } else {
          throw new Error(`Request Error: ${error.message}`);
        }
      } else {
        throw new Error(`Unexpected Error: ${error}`);
      }
    }
  }

  async register(
    mail: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    const validMail = isValidMail(mail);
    if (!validMail) {
      throw new Error("You should write a valid email");
    }
    try {
      return await this.client.post("/api/auth/register", {
        email: mail,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data?.error?.message || "Something went wrong";
          const errorCode =
            error.response.data?.error?.code || error.response.status;
          throw new Error(errorMessage, errorCode);
        } else if (error.request) {
          throw new Error("No response received from the server.");
        } else {
          throw new Error(`Request Error: ${error.message}`);
        }
      } else {
        throw new Error(`Unexpected Error: ${error}`);
      }
    }
  }

  async logout() {
    try {
      return await this.client.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      throw new Error(`Unexpected Error: ${error}`);
    }
  }

  async getUserRole() {
    try {
      return await this.client.get("/api/auth/user-role", {
        withCredentials: true,
      });
    } catch (error) {
      throw new Error(`Unexpected Error: ${error}`);
    }
  }
}

export const AuthRepository = new AuthRepositoryClass();
