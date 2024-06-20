import { FormEvent, ReactElement, useRef, useState } from "react";
import { IField } from "../models/field";
import { InputField } from "./input-field";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import useFormValidator, { IRule } from "@3dsteam/react-form-validator";
import { ProgressButtonComponent } from "@syncfusion/ej2-react-splitbuttons";

interface IDynamicFormProps {
    /**
     * List of fields to render
     * @type IField[]
     */
    fields: IField[];
    /**
     * Callback function when form is submitted.
     * The data is a record of field name and value
     * @param data {Record<string, unknown>}
     */
    onSubmit: (data: Record<string, unknown>) => Promise<void> | void;
    /**
     * If true, all fields with undefined value will be set to null
     * @default true
     */
    nullOnUndefined?: boolean;
    /**
     * If true, all fields will be cleared when form is submitted
     * @default false
     */
    clearOnSubmit?: boolean;

    /**
     * Setup buttons
     * @default undefined
     */
    buttons?: {
        /**
         * Text for the submit button
         * @default "Submit"
         */
        btnSubmitText?: string;
        /**
         * Properties for the submit button
         * @default undefined
         */
        btnSubmitProps?: Record<string, unknown>;
        /**
         * Show cancel button
         * @default false
         */
        showBtnCancel?: boolean;
        /**
         * Text for the cancel button
         * @default "Cancel"
         */
        btnCancelText?: string;
        /**
         * Properties for the cancel button
         * @default undefined
         */
        btnCancelProps?: Record<string, unknown>;
        /**
         * Layout for the buttons
         * @default "horizontal"
         */
        layout?: "horizontal" | "vertical";
        /**
         * Classes for buttons container.
         * This property if only used when template is not defined
         * @default undefined
         */
        className?: string;
        /**
         * Custom render for the buttons.
         *
         * Note: all previous properties will be ignored.
         *
         * To submit the form, you can use type="submit" or call onSubmit() function
         * @default undefined
         */
        template?: (data: { onSubmit: () => void; onCancel: () => void }) => ReactElement;
    };

    /**
     * Custom class name for the form
     * @default undefined
     */
    className?: string;
}

export const DynamicForm = (props: IDynamicFormProps) => {
    const [values, setValues] = useState<Record<string, unknown>>({});
    const btnSubmit = useRef<ProgressButtonComponent | null>(null);

    // Form validator
    const { errors, validate } = useFormValidator({
        data: values,
        rules: props.fields.reduce(
            (acc, field) => {
                if (field.validations) acc[field.name] = field.validations;
                return acc;
            },
            {} as Record<string, IRule>,
        ),
    });

    const handleOnFieldChange = (name: string, value: unknown) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleOnSubmit = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        // Check nullOnUndefined
        if (props.nullOnUndefined ?? true) {
            for (const field of props.fields) {
                if (values[field.name] === undefined) {
                    values[field.name] = null;
                }
            }
        }
        // Validate form and callback
        if (validate(values)) {
            await props.onSubmit(values);
            // Clear form
            if (props.clearOnSubmit) {
                handleOnCancel();
            }
        }
        // Complete progress button
        btnSubmit.current?.progressComplete();
    };

    const handleOnCancel = () => {
        setValues({});
    };

    return (
        <form onSubmit={handleOnSubmit} className={props.className}>
            {/* Fields */}
            {props.fields.map((field) => (
                <div key={field.name} className={field.className}>
                    {/* Label */}
                    {field.label && <label form={field.name + "-field"}>{field.label}</label>}
                    {/* Input */}
                    <InputField
                        field={field}
                        value={values[field.name]}
                        onChange={(value) => handleOnFieldChange(field.name, value)}
                    />
                    {/* Help Text */}
                    {field.helpText && <p style={{ color: "gray", fontSize: "small" }}>{field.helpText}</p>}
                    {/* Error */}
                    {errors[field.name] && <p style={{ color: "red", fontSize: "small" }}>{errors[field.name]}</p>}
                </div>
            ))}
            {/* Buttons */}
            {props.buttons?.template?.({ onSubmit: handleOnSubmit, onCancel: handleOnCancel }) ?? (
                <div
                    style={{ display: "flex", flexDirection: props.buttons?.layout === "vertical" ? "column" : "row" }}
                    className={props.buttons?.className}
                >
                    <ProgressButtonComponent
                        ref={(el) => (btnSubmit.current = el)}
                        type="submit"
                        isPrimary
                        content={props.buttons?.btnSubmitText ?? "Submit"}
                        duration={30000} // Default REST API timeout
                        // Set button properties
                        {...props.buttons?.btnSubmitProps}
                    />
                    {
                        // Show cancel button
                        props.buttons?.showBtnCancel && (
                            <ButtonComponent
                                type="reset"
                                content={props.buttons.btnCancelText ?? "Cancel"}
                                // Set button properties
                                {...props.buttons.btnCancelProps}
                                // Callback
                                onClick={handleOnCancel}
                            />
                        )
                    }
                </div>
            )}
        </form>
    );
};
