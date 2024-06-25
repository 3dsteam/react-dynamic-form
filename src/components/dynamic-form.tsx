import { FormEvent, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { IField } from "../models/field";
import { InputField } from "./input-field";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import useFormValidator, { IRule } from "@3dsteam/react-form-validator";
import { ProgressButtonComponent } from "@syncfusion/ej2-react-splitbuttons";
import { EConditionRuleOperator, IConditionRule } from "../models/condition";

interface IDynamicFormProps {
    /**
     * List of fields to render
     * @type IField[]
     */
    fields: IField[];
    /**
     * Callback function when form is submitted.
     * The data is a record of field name and value
     */
    onSubmit?: (data: Record<string, unknown>) => Promise<void> | void;
    /**
     * Callback function when form data changes
     */
    onChanges?: (data: Record<string, unknown>, isValid: boolean) => void;

    /**
     * Select witch fields to render
     * @default syncfusion
     */
    mode?: "syncfusion" | "ionic";
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
         * Hide buttons
         * @default false
         */
        hidden?: boolean;
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

    const mode = useMemo(() => props.mode ?? "syncfusion", [props.mode]);

    /**
     * Render conditions
     * Filter fields based on conditions
     */
    const fields = useMemo(() => {
        return props.fields.filter((field) => {
            if (!field.conditions) return true;
            // Check value conditions
            const checkConditions = (rule: IConditionRule) => {
                const value = values[rule.field];
                let ruleValue = rule.value;
                // Check if rule value is a dynamic value {{field}}
                if (typeof rule.value === "string") {
                    const match = rule.value.match(/{{([^}]*)}}/);
                    if (match) ruleValue = values[match[1].trim()];
                }
                // Check for different operators
                switch (rule.operator) {
                    case EConditionRuleOperator.EQUAL:
                        return value === ruleValue;
                    case EConditionRuleOperator.NOT_EQUAL:
                        return value !== ruleValue;
                    case EConditionRuleOperator.IS_NULL:
                    case EConditionRuleOperator.IS_EMPTY:
                        return !value;
                    case EConditionRuleOperator.IS_NOT_NULL:
                    case EConditionRuleOperator.IS_NOT_EMPTY:
                        return !!value;
                    default:
                        return true;
                }
            };
            // Check for different conditions
            if (field.conditions.condition === "or") return field.conditions.rules.some(checkConditions);
            return field.conditions.rules.every(checkConditions);
        });
    }, [values, props.fields]);

    /**
     * Form validation
     * Validate form based on fields validations
     */
    const { errors, validate } = useFormValidator({
        data: values,
        rules: fields.reduce(
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

    /**
     * On changes listener
     * Callback when form data changes
     */
    useEffect(() => {
        props.onChanges?.(values, validate(values));
    }, [props.onChanges, values]);

    const handleOnSubmit = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        // Check if callback is undefined
        if (!props.onSubmit) {
            console.warn("onSubmit callback is not defined");
            return;
        }
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
        <form data-testid="dynamic-form" onSubmit={handleOnSubmit} className={props.className}>
            {/* Fields */}
            {fields.map((field) => (
                <div key={field.name} className={field.className}>
                    {/* Label */}
                    {field.label && mode !== "ionic" && <label form={field.name + "-field"}>{field.label}</label>}
                    {/* Input */}
                    <InputField
                        field={field}
                        mode={mode}
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
            {props.buttons?.template?.({ onSubmit: handleOnSubmit, onCancel: handleOnCancel }) ??
                // Check if buttons are hidden
                (!props.buttons?.hidden && (
                    <div
                        data-testid="buttons-container"
                        style={{
                            display: "flex",
                            flexDirection: props.buttons?.layout === "vertical" ? "column" : "row",
                        }}
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
                ))}
        </form>
    );
};
