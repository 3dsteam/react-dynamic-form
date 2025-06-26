import { useContext, useMemo } from "react";
import DynamicFormContext from "../context/dynamic-form";
import { IField } from "../models/field";

interface IInputFieldProps extends IField {
    prefix?: string;
}

export const InputField = (field: IInputFieldProps) => {
    const { values, onChange, errors } = useContext(DynamicFormContext);
    const fieldName = field.prefix ? field.prefix + "___" + field.name : field.name;

    // Check field type
    const inputField = useMemo(() => {
        // Render the input field
        return field.template({
            value: values[fieldName],
            change: ({ value }) => onChange(fieldName, value),
            error: errors[fieldName] || null,
        });
    }, [field, values[fieldName], errors[fieldName]]);

    return (
        <div data-testid={"field-" + fieldName} className={field.className}>
            {/* Input */}
            {inputField}
            {/* Help Text */}
            {field.helpText && <p style={{ color: "gray", fontSize: "small" }}>{field.helpText}</p>}
            {/* Error */}
            {errors[fieldName] && (
                <p data-testid={"field-" + fieldName + "-error"} style={{ color: "red", fontSize: "small" }}>
                    {errors[fieldName]}
                </p>
            )}
        </div>
    );
};
