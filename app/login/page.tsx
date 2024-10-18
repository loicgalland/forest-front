"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import authRepository from "@/app/repository/AuthRepository";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InputComponent } from "@/app/components/form/InputComponent";

export default function Login() {
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const login = async (
    mail: string,
    password: string,
  ): Promise<{
    data: { data: string; success: boolean; error?: string };
  }> => {
    return authRepository.login(mail, password);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formDataObj = Object.fromEntries(formData.entries());
    const email = formDataObj.email as string; // Assurer que `email` est un string
    const password = formDataObj.password as string;

    try {
      const response = await login(email, password);
      if (response.data.success) {
        const token = response.data.data;
        if (rememberMe) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
        router.back();
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Se connecter </h2>
      <form onSubmit={submit}>
        <InputComponent
          id="loginMail"
          label="Adresse mail"
          name="email"
          type="email"
        />
        <InputComponent
          id="loginPassword"
          label="Mot de passe"
          name="password"
          type="password"
        />

        <div className="flex items-center mb-5">
          <label htmlFor="inputRemember" className="mr-2">
            Se souvenir de moi ?{" "}
          </label>
          <input
            type="checkbox"
            id="inputRemember"
            onChange={handleRememberMeChange}
          />
        </div>
        <input
          type="submit"
          value="Se connecter"
          className="p-2 rounded-lg bg-primary w-full text-white"
        />

        <div className="mt-2 flex justify-center">
          <Link className="text-primary" href={"/register"}>
            Créer un compter
          </Link>
        </div>
        {errorMessage ? (
          <span className="text-danger">{errorMessage}</span>
        ) : (
          ""
        )}
      </form>
    </div>
  );
}
