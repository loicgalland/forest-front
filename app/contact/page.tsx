"use client";

import React, { useState } from "react";
import { InputComponent } from "@/app/components/form/InputComponent";
import { TextAreaInputComponent } from "@/app/components/form/TextAreaInputComponent";
import { ContactRepository } from "@/app/repository/ContactRepository";

export default function ContactPage() {
  const [subject, setSubject] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const submitForm = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await ContactRepository.sendContact(
      subject,
      email,
      message,
    );
    if (response.status === 200) {
      setSuccessMessage(
        "Votre message a bien été envoyé nous vous recontacterons au plus vite",
      );
    }
  };

  return (
    <div className="md:px-20 lg:px-40 xl:px-80 py-2 px-4 mb-5 mt-8">
      <h1 className="md:text-5xl text-3xl font-ligth mb-5">Contact</h1>
      <form className="flex flex-wrap w-full" onSubmit={submitForm}>
        <div className="w-full mb-2">
          <InputComponent
            id="subject"
            type="text"
            label="Objet"
            name="objet"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <InputComponent
            id="email"
            type="mail"
            label="Votre mail"
            name="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextAreaInputComponent
            id="text"
            label="Message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {successMessage ? (
            <span className="text-success block mb-2">{successMessage}</span>
          ) : (
            ""
          )}
          <button
            type="submit"
            aria-label="submit"
            className="mt-2 w-full md:w-fit p-2 md:px-5 rounded-lg bg-primary text-white mr-0 md:mr-2"
          >
            Envoyer{" "}
          </button>
        </div>
      </form>
    </div>
  );
}
