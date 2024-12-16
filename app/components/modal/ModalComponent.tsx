import React, { FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { InputComponent } from "@/app/components/form/InputComponent";
import { SelectInputComponent } from "@/app/components/form/SelectInputComponent";

interface Props {
  modalType: "bed" | "equipment";
  title: string;
  onSubmit: (name: string, value: number | string) => void;
}

export const ModalComponent: React.FC<Props> = (props: Props) => {
  const [name, setName] = useState<string>("");
  const [place, setPlace] = useState<number>(0);
  const [equipment, setEquipment] = useState<string>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const choices = [
    { name: "", value: "" },
    { name: "Equipement", value: "stuff" },
    { name: "Nourriture", value: "food" },
  ];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (name && place) {
      props.onSubmit(name, place);
      setIsOpen(false);
    }
    if (name && equipment) {
      props.onSubmit(name, equipment);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="text-primary" onClick={() => setIsOpen(true)}>
        <i className="fa-solid fa-plus"></i>
        {props.title}
      </DialogTrigger>
      <DialogContent className="bg-secondary">
        <DialogHeader>
          <DialogTitle className="text-text text-xl mb-2 ">
            {props.title}
          </DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit}>
              <InputComponent
                type="text"
                name="name"
                id="name"
                label="Nom"
                value={name}
                onChange={(e) => setName(String(e.target.value))}
              />
              {props.modalType === "bed" ? (
                <InputComponent
                  type="number"
                  name="place"
                  id="place"
                  label="Nombre de place"
                  onChange={(e) => setPlace(Number(e.target.value))}
                />
              ) : (
                ""
              )}
              {props.modalType === "equipment" ? (
                <SelectInputComponent
                  id="equipment"
                  name="equipment"
                  label="Type d'équipement"
                  value={equipment}
                  choices={choices}
                  onChange={(e) => setEquipment(e.target.value)}
                />
              ) : (
                ""
              )}
              <div className="flex justify-center">
                <input
                  value="Ajouter"
                  type="submit"
                  className="mt-2 w-full md:w-fit p-2 md:px-5 rounded-lg bg-primary text-white mr-0 md:mr-2"
                />
                <DialogClose
                  onClick={() => setIsOpen(true)}
                  className="mt-2 w-full md:w-fit p-2 md:px-5 rounded-lg bg-danger text-white"
                >
                  Annuler
                </DialogClose>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
