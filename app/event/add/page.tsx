"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { InputComponent } from "@/app/components/form/InputComponent";
import { CheckBoxInputComponent } from "@/app/components/form/CheckBoxInputComponent";
import { TextAreaInputComponent } from "@/app/components/form/TextAreaInputComponent";
import { FileInputComponent } from "@/app/components/form/FileInputComponent";
import { useRouter } from "next/navigation";
import { EventRepository } from "@/app/repository/EventRepository";
import { DatePickerComponent } from "@/app/components/form/DatePickerComponent";
import useGetUserRole from "@/app/hooks/useGetUserRole";
import { AddEventInterface } from "@/app/interface/Event.interface";

export default function EventAdd() {
  const [event, setEvent] = useState<AddEventInterface>({
    name: "",
    description: "",
    visible: true,
    capacity: 0,
    price: 0,
    date: null,
  });
  const [images, setImages] = useState<File[]>([]);

  const router = useRouter();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await EventRepository.post(event, images);
    if (response.data.success) router.push("/event");
  };

  const cancel = () => {
    router.back();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const filesArray = Array.from(files);
      setImages(filesArray);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setEvent((prevEvent) => ({ ...prevEvent, date: date }));
  };

  useGetUserRole();
  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <h2 className="text-2xl font-bold">
        <button
          aria-label="go back  to previous page"
          type="button"
          onClick={router.back}
          className="mr-2"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        Ajouter un événements
      </h2>
      <form className="flex flex-wrap" onSubmit={submit}>
        <div className="w-full mb-2">
          <InputComponent
            type="text"
            name="name"
            label="Nom de l'événement"
            id="eventName"
            value={event.name}
            onChange={(e) =>
              setEvent((prevEvent) => ({ ...prevEvent, name: e.target.value }))
            }
          />
        </div>
        <div className="w-full mb-2">
          <InputComponent
            type="number"
            name="capacity"
            label="Capacité"
            id="eventCapacity"
            value={event.capacity}
            onChange={(e) =>
              setEvent((prevEvent) => ({
                ...prevEvent,
                capacity: Number(e.target.value),
              }))
            }
          />
        </div>
        <div className="w-full mb-2">
          <DatePickerComponent
            onDateChange={handleDateChange}
            label="Date"
            olderDate={null}
          />
        </div>
        <div className="w-full mb-2">
          <TextAreaInputComponent
            id="eventDescription"
            name="description"
            label="Description"
            value={event.description}
            onChange={(e) =>
              setEvent((prevEvent) => ({
                ...prevEvent,
                description: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex gap-3 w-full mb-2">
          <CheckBoxInputComponent
            id="visible"
            name="visible"
            label="Visible"
            onChange={(e) =>
              setEvent((prevEvent) => ({
                ...prevEvent,
                visible: e.target.checked,
              }))
            }
          />
        </div>
        <div className="w-full mb-2">
          <InputComponent
            type="number"
            name="price"
            label="Prix"
            id="eventPrice"
            // value={price}
            onChange={(e) =>
              setEvent((prevEvent) => ({
                ...prevEvent,
                price: Number(e.target.value),
              }))
            }
          />
        </div>
        <div className="w-full">
          <FileInputComponent
            label="image"
            id="image"
            name="image"
            onChange={handleImageChange}
          />
        </div>
        <input
          value="Ajouter"
          type="submit"
          aria-label="submit"
          className="mt-2 w-full md:w-fit p-2 md:px-5 rounded-lg bg-primary text-white mr-0 md:mr-2"
        />
        <button
          type="button"
          aria-label="cancel"
          className="mt-2 w-full md:w-fit p-2 md:px-5 rounded-lg bg-danger text-white"
          onClick={cancel}
        >
          Annuler
        </button>
      </form>
    </div>
  );
}
