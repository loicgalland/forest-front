interface Props {
  id: string;
  label: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileInputComponent: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex gap-3">
      <input
        type="file"
        className="rounded-md border-[1px] border-solid border-lightGrey px-2 py-1 shadow-sm"
        id={props.id}
        name={props.name}
        multiple
        onChange={props.onChange}
      />
      <label htmlFor={props.id} className="">
        {props.label}
      </label>
    </div>
  );
};
