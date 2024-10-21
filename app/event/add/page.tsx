"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { InputComponent } from "@/app/components/form/InputComponent";
import { CheckBoxInputComponent } from "@/app/components/form/CheckBoxInputComponent";
import { TextAreaInputComponent } from "@/app/components/form/TextAreaInputComponent";
import { FileInputComponent } from "@/app/components/form/FileInputComponent";
import { jwtDecodeService } from "@/app/services/jwtDecodeService";
import { useRouter } from "next/navigation";
import EventRepository from "@/app/repository/EventRepository";
import { DatePickerComponent } from "@/app/components/form/DatePickerComponent";

export default function EventAdd() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [images, setImages] = useState<File[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const router = useRouter();

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await EventRepository.post({
      name,
      description,
      price,
      visible: isVisible,
      images,
      date: selectedDate,
    });
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

  useEffect(() => {
    const userToken = jwtDecodeService();
    if (!userToken) router.push("/login");
  }, []);

  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <h2 className="text-2xl font-bold">
        <button onClick={router.back} className="mr-2">
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full mb-2">
          <CheckBoxInputComponent
            id="visible"
            name="visible"
            label="Visible"
            onChange={(e) => setIsVisible(e.target.checked)}
          />
        </div>
        <div className="w-full mb-2">
          <InputComponent
            type="number"
            name="price"
            label="Prix"
            id="eventPrice"
            // value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
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
          className="mt-2 w-full md:w-fit p-2 md:px-5 rounded-lg bg-primary text-white mr-0 md:mr-2"
        />
        <button
          type="button"
          className="mt-2 w-full md:w-fit p-2 md:px-5 rounded-lg bg-danger text-white"
          onClick={cancel}
        >
          Annuler
        </button>
      </form>
    </div>
  );
}
