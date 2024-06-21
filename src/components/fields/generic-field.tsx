import { IInputFieldProps } from "../input-field";

export const GenericField = (props: Omit<IInputFieldProps, "mode">) => {
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
