interface Props {
  id: string;
  label: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileInputComponent: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex flex-col gap-3 mb-4">
      <label htmlFor={props.id} className="font-bold mb-2">
        {props.label}
      </label>
      <input
        type="file"
        className="rounded-md bg-beige px-2 py-1 shadow-sm placeholder:text-text placeholder:opacity-50 font-bold"
        id={props.id}
        name={props.name}
        multiple
        onChange={props.onChange}
      />
    </div>
  );
};
