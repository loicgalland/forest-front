"use client";
import { useParams, useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { jwtDecodeService } from "@/app/services/jwtDecodeService";
import { InputComponent } from "@/app/components/form/InputComponent";
import { TextAreaInputComponent } from "@/app/components/form/TextAreaInputComponent";
import { CheckBoxInputComponent } from "@/app/components/form/CheckBoxInputComponent";
import { FileInputComponent } from "@/app/components/form/FileInputComponent";
import { DB_URL_IMAGE } from "@/app/config/database";
import ActivityRepository from "@/app/repository/ActivityRepository";
import { ActivityInterface } from "@/app/interface/Activity.interface";
import { FileInterface } from "@/app/interface/File.interface";
import EventRepository from "@/app/repository/EventRepository";
import { EventInterface } from "@/app/interface/Event.interface";

const EditEvent = () => {
  const [fetchedImages, setFetchedImages] = useState<FileInterface[]>([]);

  const [images, setImages] = useState<File[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const { id } = useParams();
  const router = useRouter();

  const cancel = () => {
    router.back();
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await EventRepository.update(
      id,
      name,
      description,
      isVisible,
      price,
    );

    if (response.data.success) router.push("/event");
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const filesArray = Array.from(files);
      setImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const fetchData = async (): Promise<{
    data: { data: EventInterface; success: boolean };
  }> => {
    try {
      return await EventRepository.getOne(id);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  useEffect(() => {
    const userToken = jwtDecodeService();
    if (!userToken) router.push("/login");

    fetchData().then((response) => {
      if (response && response.data) {
        setName(response.data.data.name);
        setDescription(response.data.data.description);
        setPrice(response.data.data.price);
        setIsVisible(response.data.data.visible);

        const fetchedImagesArray: FileInterface[] = [];
        response.data.data.images?.forEach((image) => {
          fetchedImagesArray.push(image);
        });
        setFetchedImages(fetchedImagesArray);
      }
    });
  }, []);
  return (
    <div className="md:px-20 lg:px-40 xl:px-60 py-2 px-4 mb-5">
      <h2 className="text-2xl font-bold">
        <button onClick={router.back} className="mr-2">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Modification de l'activité : {name}
      </h2>
      <form className="flex flex-wrap" onSubmit={submit}>
        <div className="w-full mb-2">
          <InputComponent
            type="text"
            name="name"
            label="Nom de l'événement'"
            id="eventName"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
          />
        </div>
        <div className="w-full mb-2">
          <InputComponent
            type="number"
            name="price"
            label="Prix"
            id="eventPrice"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div className="w-full">
          <FileInputComponent
            label="Images"
            id="image"
            name="image"
            onChange={handleImageChange}
          />
          <div className="grid grid-cols-4 gap-4 mt-2">
            {fetchedImages && fetchedImages.length
              ? fetchedImages.map((image, index) => {
                  return (
                    <div key={index} className="relative">
                      <button
                        type="button"
                        className="bg-danger text-white p-2 rounded-lg absolute top-[10px] right-[10px]"
                        onClick={() => console.log("Image supprimée")}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                      <img
                        src={DB_URL_IMAGE + image.path}
                        alt="image"
                        className="object-cover w-full h-[200px] rounded-xl"
                      />
                    </div>
                  );
                })
              : ""}
          </div>
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
};

export default EditEvent;
