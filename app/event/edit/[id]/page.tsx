"use client";
import { useParams, useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { InputComponent } from "@/app/components/form/InputComponent";
import { TextAreaInputComponent } from "@/app/components/form/TextAreaInputComponent";
import { CheckBoxInputComponent } from "@/app/components/form/CheckBoxInputComponent";
import { FileInputComponent } from "@/app/components/form/FileInputComponent";
import { DB_URL_IMAGE } from "@/app/config/database";
import { FileInterface } from "@/app/interface/File.interface";
import EventRepository from "@/app/repository/EventRepository";
import { EventInterface } from "@/app/interface/Event.interface";
import { DatePickerComponent } from "@/app/components/form/DatePickerComponent";
import Image from "next/image";
import { useAuth } from "@/app/services/AuthContext";
import AuthRepository from "@/app/repository/AuthRepository";

const EditEvent = () => {
  const { userRole, setUserRole } = useAuth();
  const [fetchedImages, setFetchedImages] = useState<FileInterface[]>([]);

  const [images, setImages] = useState<File[]>([]);
  const [imageToDelete, setImageToDelete] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [capacity, setCapacity] = useState<number>(0);

  const { id } = useParams();
  const router = useRouter();

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

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
      selectedDate,
      images,
      capacity,
      imageToDelete,
    );

    if (response.data.success) router.push("/event/" + id);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const filesArray = Array.from(files);
      const newFetchedImages = filesArray.map((file) => {
        const extension = file.name.split(".").pop();
        return {
          _id: Date.now().toString(),
          path: URL.createObjectURL(file),
          originalName: file.name,
          extension: extension,
        };
      });

      setImages((prevImages) => [...prevImages, ...filesArray]);

      setFetchedImages((prevFetchedImages) => [
        ...prevFetchedImages,
        ...newFetchedImages,
      ]);
    }
  };

  const deleteImage = (id: string) => {
    setImageToDelete((prevItems) => [...prevItems, id]);
    setFetchedImages((prevImages) =>
      prevImages.filter((image) => image._id !== id),
    );
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

  const getUserRole = async () => {
    const response = await AuthRepository.getUserRole();
    setUserRole(response.data.role);
  };

  useEffect(() => {
    if (!userRole) getUserRole();
  }, []);

  useEffect(() => {
    if (userRole) {
      fetchData().then((response) => {
        if (response && response.data) {
          setName(response.data.data.name);
          setDescription(response.data.data.description);
          setPrice(response.data.data.price);
          setIsVisible(response.data.data.visible);
          setSelectedDate(response.data.data.date);
          setCapacity(response.data.data.capacity);

          const fetchedImagesArray: FileInterface[] =
            response.data.data.images?.map((image) => ({
              _id: image._id,
              path: DB_URL_IMAGE + image.path,
              originalName: image.originalName,
              extension: image.path.split(".").pop(),
            })) || [];

          setFetchedImages(fetchedImagesArray);
        }
      });
    }
  }, [userRole]);
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
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        Modification de l'événement : {name}
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
          <InputComponent
            type="number"
            name="capacity"
            label="Capacité"
            id="eventCapacity"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </div>
        <div className="w-full mb-2">
          <DatePickerComponent
            onDateChange={handleDateChange}
            label="Date"
            olderDate={selectedDate}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
            {fetchedImages && fetchedImages.length
              ? fetchedImages.map((image, index) => {
                  return (
                    <div key={index} className="relative">
                      <button
                        type="button"
                        className="bg-danger text-white p-2 rounded-lg absolute top-[10px] right-[10px]"
                        onClick={() => deleteImage(image._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                      <Image
                        className="object-cover w-full h-[200px] rounded-lg"
                        src={image.path}
                        alt={image.originalName}
                        width={200}
                        height={200}
                      />
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
        <input
          value="Modifier"
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
};

export default EditEvent;
