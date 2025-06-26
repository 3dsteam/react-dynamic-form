import { IField } from "../models/field";
import { SyncfusionField } from "./fields/syncfusion-field";
import { useContext, useMemo } from "react";
import DynamicFormContext from "../context/dynamic-form";

interface IInputFieldProps extends IField {
    prefix?: string;
}

export const InputField = (field: IInputFieldProps) => {
    const { eventMode, values, onChange, errors } = useContext(DynamicFormContext);
    const fieldName = field.prefix ? field.prefix + "___" + field.name : field.name;

    // Check field type
    const inputField = useMemo(() => {
        // Check custom render
        if (field.template) {
            return field.template({
                field: { ...field, name: fieldName },
                value: values[fieldName],
                onChange: (value) => onChange(fieldName, value),
            });
        } else {
            return (
                <SyncfusionField
                    field={{ ...field, name: fieldName }}
                    value={values[fieldName]}
                    eventMode={eventMode}
                    onChange={(value) => onChange(fieldName, value)}
                />
            );
        }
    }, [field]);

    return (
        <div data-testid={"field-" + fieldName} className={field.className}>
            {/* Label */}
            {field.label && <label form={fieldName + "-field"}>{field.label}</label>}
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
