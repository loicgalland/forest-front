interface Props {
  id: string;
  label: string;
  value?: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextAreaInputComponent: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={props.id} className="">
        {props.label}
      </label>
      <textarea
        onChange={props.onChange}
        className="rounded-md border-[1px] border-solid border-lightGrey px-2 py-1 shadow-sm"
        name={props.name}
        id={props.id}
        value={props.value}
        rows={5}
      ></textarea>
    </div>
  );
};
