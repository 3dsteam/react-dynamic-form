import { IField } from "../models/field";
import { SyncfusionField } from "./fields/syncfusion-field";
import { IonicField } from "./fields/ionic-field";
import { useContext, useMemo } from "react";
import DynamicFormContext from "../context/dynamic-form";

export const InputField = (field: IField) => {
    const { mode, values, onChange, errors } = useContext(DynamicFormContext);

    // Check field type
    const inputField = useMemo(() => {
        // Check custom render
        if (field.template) {
            return field.template({
                field: field,
                value: values[field.name],
                onChange: (value) => onChange(field.name, value),
            });
        }
        // Check mode
        else if (!mode || mode === "syncfusion") {
            return (
                <SyncfusionField
                    field={field}
                    value={values[field.name]}
                    onChange={(value) => onChange(field.name, value)}
                />
            );
        } else if (mode === "ionic") {
            return (
                <IonicField
                    field={field}
                    value={values[field.name]}
                    onChange={(value) => onChange(field.name, value)}
                />
            );
        }
    }, [field, mode]);

    return (
        <div data-testid={"field-" + field.name} className={field.className}>
            {/* Label */}
            {field.label && mode !== "ionic" && <label form={field.name + "-field"}>{field.label}</label>}
            {/* Input */}
            {inputField}
            {/* Help Text */}
            {field.helpText && <p style={{ color: "gray", fontSize: "small" }}>{field.helpText}</p>}
            {/* Error */}
            {errors[field.name] && <p style={{ color: "red", fontSize: "small" }}>{errors[field.name]}</p>}
        </div>
    );
};
