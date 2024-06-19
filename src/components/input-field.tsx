import { EFieldType, IField } from "../models/field";
import { NumericTextBoxComponent, TextAreaComponent, TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { CheckBoxComponent } from "@syncfusion/ej2-react-buttons";

interface IInputFieldProps {
    field: IField;
    value: unknown;
    onChange: (value: unknown) => void;
}

export const InputField = (props: IInputFieldProps) => {
    // Check custom render
    if (props.field.template) {
        return props.field.template(props);
    }

    if (
        props.field.type === EFieldType.TEXT ||
        props.field.type === EFieldType.EMAIL ||
        props.field.type === EFieldType.PASSWORD
    ) {
        let inputType = "text";
        if (props.field.type === EFieldType.PASSWORD) inputType = "password";
        else if (props.field.type === EFieldType.EMAIL) inputType = "email";

        return (
            <TextBoxComponent
                // Set ALL other properties
                {...props.field.props}
                // Identifier
                type={inputType}
                name={props.field.name}
                placeholder={props.field.placeholder}
                // Value
                value={(props.value as string) ?? null}
                change={(args) => props.onChange(args.value)}
            />
        );
    } else if (props.field.type === EFieldType.TEXTAREA) {
        return (
            <TextAreaComponent
                // Set ALL other properties
                {...props.field.props}
                // Identifier
                name={props.field.name}
                placeholder={props.field.placeholder}
                // Value
                value={(props.value as string) ?? null}
                change={(args) => props.onChange(args.value)}
            />
        );
    } else if (props.field.type === EFieldType.NUMBER) {
        return (
            <NumericTextBoxComponent
                // Set ALL other properties
                {...props.field.props}
                // Identifier
                name={props.field.name}
                placeholder={props.field.placeholder}
                // Value
                value={(props.value as number) ?? null}
                change={(args) => props.onChange(args.value)}
            />
        );
    } else if (props.field.type === EFieldType.DATE) {
        return (
            <DatePickerComponent
                // Set ALL other properties
                {...props.field.props}
                // Identifier
                name={props.field.name}
                placeholder={props.field.placeholder}
                // Value
                value={(props.value as Date) ?? null}
                change={(args) => props.onChange(args.value)}
            />
        );
    } else if (props.field.type === EFieldType.SELECT) {
        return (
            <DropDownListComponent
                // Set ALL other properties
                {...props.field.props}
                // Identifier
                name={props.field.name}
                placeholder={props.field.placeholder}
                // Value
                value={(props.value as string) ?? null}
                change={(args) => props.onChange(args.value)}
            />
        );
    } else if (props.field.type === EFieldType.CHECKBOX) {
        return (
            <CheckBoxComponent
                // Set ALL other properties
                {...props.field.props}
                // Identifier
                name={props.field.name}
                label={props.field.placeholder}
                // Value
                checked={(props.value as boolean) ?? null}
                change={(args: { checked: boolean }) => props.onChange(args.checked)}
            />
        );
    }

    return (
        <input
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