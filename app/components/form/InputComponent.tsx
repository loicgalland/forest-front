import React, { useEffect, useState } from "react";

interface Props {
  id: string;
  type: string;
  label: string;
  value?: string | number;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputComponent: React.FC<Props> = (props: Props) => {
  const [inputType, setInputType] = useState("text");

  useEffect(() => {
    setInputType(props.type);
  }, []);

  const handleInputType = () => {
    if (inputType === "password") setInputType("text");
    else setInputType("password");
  };

  return (
    <div className="flex flex-col ">
      <label htmlFor={props.id} className="">
        {props.label}
      </label>
      <div className="relative w-full">
        <input
          type={inputType}
          className="w-full rounded-md border-[1px] border-solid border-lightGrey px-2 py-1 shadow-sm"
          id={props.id}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
        />
        {props.type === "password" && (
          <span
            className="absolute top-[50%] right-2 transform translate-y-[-50%] text-lightGrey"
            onClick={handleInputType}
          >
            {inputType === "password" ? (
              <i className="fa-solid fa-eye"></i>
            ) : (
              <i className="fa-solid fa-eye-slash"></i>
            )}
          </span>
        )}
      </div>
    </div>
  );
};
