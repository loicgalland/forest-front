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

const EditActivity = () => {
  const [fetchedImages, setFetchedImages] = useState<FileInterface[]>([]);

  const [images, setImages] = useState<File[]>([]);
  const [imageToDelete, setImageToDelete] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isSpotlight, setIsSpotlight] = useState<boolean>(false);

  const { id } = useParams();
  const router = useRouter();

  const cancel = () => {
    router.back();
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await ActivityRepository.update(
      id,
      name,
      description,
      isVisible,
      isSpotlight,
      price,
      images,
      imageToDelete,
    );

    if (response.data.success) router.push("/activity");
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
    data: { data: ActivityInterface; success: boolean };
  }> => {
    try {
      return await ActivityRepository.getOne(id);
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
        setIsSpotlight(response.data.data.isSpotlight);

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
            label="Nom de l'activité"
            id="activityName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="w-full mb-2">
          <TextAreaInputComponent
            id="activityDescription"
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

          <CheckBoxInputComponent
            id="spotlight"
            name="spotlight"
            label="Mettre en avant"
            value={isSpotlight}
            onChange={(e) => setIsSpotlight(e.target.checked)}
          />
        </div>
        <div className="w-full mb-2">
          <InputComponent
            type="number"
            name="price"
            label="Prix"
            id="activityPrice"
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
                      <img
                        src={image.path}
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

export default EditActivity;
