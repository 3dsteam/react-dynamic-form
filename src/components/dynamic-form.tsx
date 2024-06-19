import { FormEvent, ReactElement, useState } from "react";
import { IField } from "../models/field";
import { InputField } from "./input-field";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

interface IDynamicFormProps {
    /**
     * List of fields to render
     * @type IField[]
     */
    fields: IField[];
    /**
     * Callback function when form is submitted
     * The data is a record of field name and value
     * @param data {Record<string, unknown>}
     */
    onSubmit: (data: Record<string, unknown>) => void;
    /**
     * If true, all fields with undefined value will be set to null
     * @default true
     */
    nullOnUndefined?: boolean;

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
         * Custom render for the buttons
         * Note: all previous properties will be ignored
         * For the submit button, you can use type="submit" or call onSubmit() function
         * @param data { onSubmit: () => void; onCancel: () => void }
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

    const handleOnFieldChange = (name: string, value: unknown) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleOnSubmit = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        // Check nullOnUndefined
        if (props.nullOnUndefined ?? true) {
            for (const field of props.fields) {
                if (values[field.name] === undefined) {
                    values[field.name] = null;
                }
            }
        }
        // Callback
        props.onSubmit(values);
    };

    const handleOnCancel = () => {
        setValues({});
    };

    return (
        <form onSubmit={handleOnSubmit} className={props.className}>
            {/* Fields */}
            {props.fields.map((field) => (
                <div key={field.name} className={field.className}>
                    {/* Input */}
                    <InputField
                        field={field}
                        value={values[field.name]}
                        onChange={(value) => handleOnFieldChange(field.name, value)}
                    />
                    {/* Help Text */}
                    {field.helpText && <p style={{ fontSize: "small" }}>{field.helpText}</p>}
                </div>
            ))}
            {/* Buttons */}
            {props.buttons?.template?.({ onSubmit: handleOnSubmit, onCancel: handleOnCancel }) ?? (
                <>
                    <ButtonComponent
                        type="submit"
                        isPrimary
                        content={props.buttons?.btnSubmitText ?? "Submit"}
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
                </>
            )}
        </form>
    );
};
