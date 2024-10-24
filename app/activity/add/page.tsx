"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { InputComponent } from "@/app/components/form/InputComponent";
import { CheckBoxInputComponent } from "@/app/components/form/CheckBoxInputComponent";
import { TextAreaInputComponent } from "@/app/components/form/TextAreaInputComponent";
import { FileInputComponent } from "@/app/components/form/FileInputComponent";
import { useRouter } from "next/navigation";
import ActivityRepository from "@/app/repository/ActivityRepository";
import useGetUserRole from "@/app/hooks/useGetUserRole";
import { AddActivityInterface } from "@/app/interface/Activity.interface";

export default function ActivityAdd() {
  const [activity, setActivity] = useState<AddActivityInterface>({
    name: "",
    description: "",
    isSpotlight: false,
    visible: true,
    capacity: 0,
    price: 0,
  });
  const [images, setImages] = useState<File[]>([]);

  const router = useRouter();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await ActivityRepository.post(activity, images);
    if (response.data.success) router.push("/activity");
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

  useGetUserRole();

  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <h2 className="text-2xl font-bold">
        <button
          onClick={router.back}
          className="mr-2"
          aria-label="go back  to previous page"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        Ajouter une activité
      </h2>
      <form className="flex flex-wrap" onSubmit={submit}>
        <div className="w-full mb-2">
          <InputComponent
            type="text"
            name="name"
            label="Nom de l'activité"
            id="activityName"
            value={activity.name}
            onChange={(e) =>
              setActivity((prevActivity) => ({
                ...prevActivity,
                name: e.target.value,
              }))
            }
          />
        </div>
        <div className="w-full mb-2">
          <TextAreaInputComponent
            id="activityDescription"
            name="description"
            label="Description"
            value={activity.description}
            onChange={(e) =>
              setActivity((prevActivity) => ({
                ...prevActivity,
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
              setActivity((prevActivity) => ({
                ...prevActivity,
                visible: e.target.checked,
              }))
            }
          />
          <CheckBoxInputComponent
            id="spotlight"
            name="spotlight"
            label="Mettre en avant"
            onChange={(e) =>
              setActivity((prevActivity) => ({
                ...prevActivity,
                isSpotlight: e.target.checked,
              }))
            }
          />
        </div>
        <div className="w-full mb-2">
          <InputComponent
            type="number"
            name="price"
            label="Prix"
            id="activityPrice"
            onChange={(e) =>
              setActivity((prevActivity) => ({
                ...prevActivity,
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
