import { useContext, useMemo } from "react";
import DynamicFormContext from "../context/dynamic-form";
import { EFieldType, IFieldType } from "../models/field";

export const InputField = (field: IFieldType & { prefix?: string }) => {
    const { values, onChange, errors } = useContext(DynamicFormContext);
    const fieldName = field.prefix ? field.prefix + "___" + field.name : field.name;

    const inputField = useMemo(() => {
        switch (field.type) {
            case EFieldType.TEXT:
            case EFieldType.PASSWORD:
            case EFieldType.EMAIL:
            case EFieldType.TEXTAREA:
                // Render text, password, email, or textarea field
                return field.template({
                    value: values[fieldName] as string,
                    change: ({ value }) => onChange(fieldName, value),
                    values,
                    error: errors[fieldName] || null,
                });
            case EFieldType.NUMBER:
                // Render number field
                return field.template({
                    value: values[fieldName] as number,
                    change: ({ value }) => onChange(fieldName, value),
                    values,
                    error: errors[fieldName] || null,
                });
            case EFieldType.DATE:
            case EFieldType.DATETIME:
                // Render datetime field
                return field.template({
                    value: values[fieldName] as Date,
                    change: ({ value }) => onChange(fieldName, value),
                    values,
                    error: errors[fieldName] || null,
                });
            case EFieldType.DATERANGE:
                // Render date range field
                return field.template({
                    value: values[fieldName] as [Date, Date],
                    change: ({ value }) => onChange(fieldName, value),
                    values,
                    error: errors[fieldName] || null,
                });
            case EFieldType.SELECT:
                // Render select field
                return field.template({
                    value: values[fieldName],
                    change: ({ value }) => onChange(fieldName, value),
                    values,
                    error: errors[fieldName] || null,
                });
            case EFieldType.MULTISELECT:
                // Render multiselect field
                return field.template({
                    value: values[fieldName] as unknown[],
                    change: ({ value }) => onChange(fieldName, value),
                    values,
                    error: errors[fieldName] || null,
                });
            case EFieldType.AUTOCOMPLETE:
                // Render autocomplete field
                return field.template({
                    value: values[fieldName],
                    change: ({ value }) => onChange(fieldName, value),
                    values,
                    error: errors[fieldName] || null,
                });
            case EFieldType.CHECKBOX:
                // Render checkbox field
                return field.template({
                    value: values[fieldName] as boolean,
                    change: ({ value }) => onChange(fieldName, value),
                    values,
                    error: errors[fieldName] || null,
                });
            default:
                // If the field type is not recognized, return null
                console.warn(`Field type is not recognized.`);
                return null;
        }
    }, [field.type, values, errors[fieldName]]);

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
