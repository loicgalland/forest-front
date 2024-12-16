interface Props {
  id: string;
  label: string;
  value?: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextAreaInputComponent: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={props.id} className="mb-2">
        {props.label}
      </label>
      <textarea
        onChange={props.onChange}
        className="rounded-md bg-beige px-2 py-1 shadow-sm placeholder:text-text placeholder:opacity-50 font-bold"
        name={props.name}
        id={props.id}
        value={props.value}
        rows={5}
      ></textarea>
    </div>
  );
};
