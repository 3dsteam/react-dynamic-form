import { IField } from "../../models/field";

interface IGenericFieldProps {
    field: IField;
    value: unknown;
    onChange: (value: unknown) => void;
}

export const GenericField = (props: IGenericFieldProps) => {
    return (
        <input
            id={props.field.name + "-field"}
            data-testid={props.field.name + "-field"}
            // Set ALL other properties
            {...props.field.props}
            // Identifier
            name={props.field.name}
            placeholder={props.field.placeholder}
            // Value
            value={(props.value as string) ?? null}
            onChange={(e) => props.onChange(e.target.value)}
        />
    );
};
