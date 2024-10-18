interface Props {
  id: string;
  label: string;
  value?: boolean;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CheckBoxInputComponent: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex gap-3 w-full">
      <input
        type="checkbox"
        className="rounded-md border-[1px] border-solid border-lightGrey px-2 py-1 shadow-sm"
        id={props.id}
        name={props.name}
        checked={props.value}
        onChange={props.onChange}
      />

      <label htmlFor={props.id} className="w-full">
        {props.label}
      </label>
    </div>
  );
};
