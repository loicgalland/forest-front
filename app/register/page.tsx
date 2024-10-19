"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import authRepository from "@/app/repository/AuthRepository";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InputComponent } from "@/app/components/form/InputComponent";

export default function Home() {
  const [firstName, setFirstName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const handleStringItem =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<{
    data: { data: string; success: boolean; error?: string };
  }> => {
    if (password === passwordConfirmation) {
      setErrorMessage("Password confirmation is required");
    }

    return authRepository.register(email, password, firstName, lastName);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formDataObj = Object.fromEntries(formData.entries());
    const firstName = formDataObj.firstName as string;
    const lastName = formDataObj.lastName as string;
    const email = formDataObj.email as string;
    const password = formDataObj.password as string;

    try {
      const response = await register(email, password, firstName, lastName);
      if (response.data.success) {
        router.push("/login");
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
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <h2 className="text-xl font-bold mb-2">Créer un compte </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <InputComponent
            id="registerFirstName"
            label="Prénom"
            type="text"
            name="firstName"
            value={firstName}
            onChange={handleStringItem(setFirstName)}
          />
          <InputComponent
            id="registerLastName"
            label="Nom"
            type="text"
            name="lastName"
          />
        </div>
        <div className="mb-4">
          <InputComponent
            id="registerMail"
            label="Adresse mail"
            type="email"
            name="email"
          />
        </div>
        <div className="mb-6">
          <InputComponent
            id="registerPassword"
            label="Mot de passe"
            type="password"
            name="password"
            value={password}
            onChange={handleStringItem(setPassword)}
          />
          <InputComponent
            id="regissetPasswordConfirmation"
            label="Confirmation de mot de passe"
            type="password"
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={handleStringItem(setPasswordConfirmation)}
          />
          {passwordConfirmation && passwordConfirmation !== password ? (
            <div className="text-danger">
              Les mots de passe doivent être identiques
            </div>
          ) : (
            ""
          )}
        </div>

        <input
          type="submit"
          value="Créer un compte"
          className="p-2 rounded-lg bg-primary w-full text-white"
          disabled={passwordConfirmation !== password}
        />
        <div className="flex justify-center mt-2">
          <Link className="text-primary" href={"/login"}>
            Se connecter
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
