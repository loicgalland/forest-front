interface Props {
  id: string;
  label: string;
  name: string;
  choices: { name: string; value: string }[];
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectInputComponent: React.FC<Props> = (props: Props) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label htmlFor={props.id} className="mb-2">
        {props.label}
      </label>{" "}
      {/* Ajout du label */}
      <select
        name={props.name}
        id={props.id}
        value={props.value}
        onChange={props.onChange || (() => {})}
        className="p-2 rounded bg-beige font-bold"
      >
        {props.choices.map((choice) => (
          <option key={choice.value} value={choice.value}>
            {choice.name}
          </option>
        ))}
      </select>
    </div>
  );
};
