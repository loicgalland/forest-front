"use client";
import { ModalComponent } from "@/app/components/modal/ModalComponent";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BedInterface } from "@/app/interface/Bed.interface";
import BedRepository from "@/app/repository/BedRepository";
import { EquipmentInterface } from "@/app/interface/Equipment.interface";
import EquipmentRepository from "@/app/repository/EquipmentRepository";
import { InputComponent } from "@/app/components/form/InputComponent";
import { CheckBoxInputComponent } from "@/app/components/form/CheckBoxInputComponent";
import { TextAreaInputComponent } from "@/app/components/form/TextAreaInputComponent";
import { FileInputComponent } from "@/app/components/form/FileInputComponent";
import hostingRepository from "@/app/repository/HostingRepository";
import { jwtDecodeService } from "@/app/services/jwtDecodeService";
import { useRouter } from "next/navigation";

export default function HostingAdd() {
  const [bedList, setBedList] = useState<BedInterface[]>([]);
  const [equipmentList, setEquipmentList] = useState<EquipmentInterface[]>([]);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [equipments, setEquipments] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isSpotlight, setIsSpotlight] = useState<boolean>(false);
  const [beds, setBeds] = useState<{ bedId: string; quantity: number }[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const router = useRouter();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await hostingRepository.postHosting({
      name,
      description,
      price,
      visible: isVisible,
      isSpotlight,
      equipments: equipments,
      beds,
      images,
    });
    if (response.data.success) router.push("/hosting");
  };

  const cancel = () => {
    router.back();
  };

  const handleEquipmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;

    if (checked) {
      setEquipments((prevEquipment) => [...prevEquipment, id]);
    } else {
      setEquipments((prevEquipment) =>
        prevEquipment.filter((equipmentId) => equipmentId !== id),
      );
    }
  };

  const handleBeds = (bedId: string, quantity: number) => {
    setBeds((prevBeds) => {
      const existingBed = prevBeds.find((bed) => bed.bedId === bedId);

      if (existingBed) {
        return prevBeds.map((bed) =>
          bed.bedId === bedId ? { ...bed, quantity } : bed,
        );
      } else {
        return [...prevBeds, { bedId, quantity }];
      }
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const filesArray = Array.from(files);
      setImages(filesArray);
    }
  };

  const fetchBedsList = async (): Promise<{
    data: { data: BedInterface[]; success: boolean };
  }> => {
    try {
      return await BedRepository.getAll();
    } catch (error) {
      throw error;
    }
  };

  const fetchEquipmentsList = async (): Promise<{
    data: { data: EquipmentInterface[]; success: boolean };
  }> => {
    try {
      return await EquipmentRepository.getAll();
    } catch (error) {
      throw error;
    }
  };

  const handleBedModalSubmit = async (name: string, value: number | string) => {
    if (typeof value === "number") {
      try {
        const response = await BedRepository.post(name, value);
        if (response.data.success) {
          fetchBedsList().then((response) => {
            if (response && response.data) {
              setBedList(response.data.data);
            }
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du lit", error);
      }
    }
  };

  const handleEquipmentModalSubmit = async (
    name: string,
    type: number | string,
  ) => {
    if (typeof type === "string") {
      try {
        const response = await EquipmentRepository.post(name, type);
        if (response.data.success) {
          fetchEquipmentsList().then((response) => {
            if (response && response.data) {
              setEquipmentList(response.data.data);
            }
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'équipement", error);
      }
    }
  };

  useEffect(() => {
    const userToken = jwtDecodeService();
    if (!userToken) router.push("/login");

    fetchBedsList().then((response) => {
      if (response && response.data) {
        setBedList(response.data.data);
      }
    });
    fetchEquipmentsList().then((response) => {
      if (response && response.data) {
        setEquipmentList(response.data.data);
      }
    });
  }, []);

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
        Ajouter un hébergement
      </h2>
      <form className="flex flex-wrap" onSubmit={submit}>
        <div className="w-full mb-2">
          <InputComponent
            type="text"
            name="name"
            label="Nom de l'hébergement"
            id="hostingName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="w-full mb-2">
          <TextAreaInputComponent
            id="hostingDescription"
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
          <CheckBoxInputComponent
            id="spotlight"
            name="spotlight"
            label="Mettre en avant"
            onChange={(e) => setIsSpotlight(e.target.checked)}
          />
        </div>
        <div className="w-full mb-2">
          <InputComponent
            type="number"
            name="price"
            label="Prix par nuit"
            id="hostingPrice"
            // value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div className="w-full md:w-[50%] mb-4">
          <h3 className="font-bold">Lits</h3>
          {bedList && bedList.length
            ? bedList.map((bed: BedInterface) => (
                <div key={bed._id} className="flex items-start mb-2 gap-3">
                  <InputComponent
                    type="number"
                    name="quantity"
                    label={"Nombre de " + bed.name}
                    id={"bedQuantity-" + bed._id}
                    onChange={(e) =>
                      handleBeds(bed._id, Number(e.target.value))
                    }
                  />
                </div>
              ))
            : ""}
          <ModalComponent
            title="Ajouter un lit"
            onSubmit={handleBedModalSubmit}
            modalType="bed"
          />
        </div>
        <div className="w-full md:w-[50%] pl-0 md:pl-2">
          <h3 className="font-bold">Equipement</h3>
          {equipmentList && equipmentList.length
            ? equipmentList.map((equipment: EquipmentInterface) => (
                <div
                  key={equipment._id}
                  className="flex items-start mb-2 gap-3"
                >
                  <CheckBoxInputComponent
                    id={equipment._id}
                    name={equipment._id}
                    label={equipment.name}
                    onChange={handleEquipmentChange}
                  />
                </div>
              ))
            : ""}
          <ModalComponent
            title="Ajouter un équipement"
            onSubmit={handleEquipmentModalSubmit}
            modalType="equipment"
          />
        </div>
        <div className="w-full">
          <FileInputComponent
            label="Images"
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
