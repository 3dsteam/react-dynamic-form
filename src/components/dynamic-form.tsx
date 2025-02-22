import { FormEvent, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { IField } from "../models/field";
import { InputField } from "./input-field";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import useFormValidator, { IRule } from "@3dsteam/react-form-validator";
import { ProgressButtonComponent } from "@syncfusion/ej2-react-splitbuttons";
import { EConditionRuleOperator, IConditionRule } from "../models/condition";
import _ from "lodash";
import { IFieldGroup } from "../models/group";
import { InputFieldGroup } from "./input-field-group";
import DynamicFormContext from "../context/dynamic-form";
import { flatValuesFromStructured, getStructuredValues } from "./dynamic-form.functions";

interface IDynamicFormProps {
    /**
     * Initial values for the form
     * @default undefined
     */
    values?: Record<string, unknown>;
    /**
     * List of fields to render
     */
    fields: (IField | IFieldGroup)[];
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
    mode?: "syncfusion";
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
     * If true, form will be submitted when user clicks on clear button
     * @default false
     */
    submitOnClear?: boolean;
    /**
     * If true, form will be validated on init
     * @default false
     */
    validateOnInit?: boolean;

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
    const [values, setValues] = useState<Record<string, unknown>>(
        props.values ? flatValuesFromStructured(props.values) : {},
    );
    const btnSubmit = useRef<ProgressButtonComponent | null>(null);

    /**
     * Listener for initial values
     * Set values when props values changes
     */
    useEffect(() => {
        setValues(props.values ? flatValuesFromStructured(props.values) : {});
    }, [props.values]);

    const mode = useMemo(() => props.mode ?? "syncfusion", [props.mode]);

    /**
     * Render conditions
     * Filter fields based on conditions
     */
    const fields = useMemo(() => {
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
        // Map fields
        const mapFields = (fields: (IField | IFieldGroup)[]) => {
            return fields
                .map((field) => {
                    const FIELD = { ...field };
                    // Check field / group condition
                    if (FIELD.conditions) {
                        if (FIELD.conditions.condition === "or" && !FIELD.conditions.rules.some(checkConditions)) {
                            return null;
                        } else if (
                            FIELD.conditions.condition === "and" &&
                            !FIELD.conditions.rules.every(checkConditions)
                        ) {
                            return null;
                        }
                    }
                    // Check group fields
                    if ("fields" in FIELD) FIELD.fields = mapFields(FIELD.fields);
                    return FIELD;
                })
                .filter((field) => field !== null) as (IField | IFieldGroup)[];
        };
        // Return fields
        return mapFields([...props.fields]);
    }, [values, props.fields]);

    /**
     * Form validation
     * Validate form based on fields validations
     */
    const { errors, validate } = useFormValidator({
        data: { ...values },
        rules: fields.reduce(
            (acc, field) => {
                const setGroupValidation = (group: IFieldGroup, prefix?: string) => {
                    group.fields.forEach((field) => {
                        const name = prefix ? (field.name ? prefix + "___" + field.name : prefix) : field.name;
                        if ("fields" in field) setGroupValidation(field, name);
                        else if (field.validations) acc[name!] = field.validations;
                    });
                };
                // Check if field is a group
                if ("fields" in field) setGroupValidation(field, field.name);
                else if (field.validations) acc[field.name] = field.validations;
                return acc;
            },
            {} as Record<string, IRule>,
        ),
    });

    const initRef = useRef(false);
    useEffect(() => {
        if (!props.validateOnInit || initRef.current) return;
        initRef.current = true;
        // Validate values
        const isValid = validate(values);
        props.onChanges?.(getStructuredValues(fields, values, props.nullOnUndefined), isValid);
    }, [props.validateOnInit, fields, values, props.onChanges, props.nullOnUndefined]);

    const handleOnFieldChange = (name: string, value: unknown) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * On changes listener
     * Callback when form data changes
     */
    useEffect(() => {
        // Check if values are the same as props
        if (!props.onChanges || _.isEqual(values, props.values)) return;
        props.onChanges?.(getStructuredValues(fields, values, props.nullOnUndefined), validate(values));
    }, [props.values, props.onChanges, fields, values, props.nullOnUndefined]);

    const handleOnSubmit = async (e?: FormEvent<HTMLFormElement>, overrideValues?: Record<string, unknown>) => {
        e?.preventDefault();

        // Check if callback is undefined
        if (!props.onSubmit) {
            console.warn("onSubmit callback is not defined");
            return;
        }

        // Validate form and callback
        if (validate(overrideValues ?? values)) {
            await props.onSubmit(getStructuredValues(fields, overrideValues ?? values, props.nullOnUndefined));
            if (props.clearOnSubmit) handleOnCancel();
        }

        // Complete progress button
        btnSubmit.current?.progressComplete();
    };

    const handleOnCancel = () => {
        setValues({});
        // Check for submit on clear
        if (props.submitOnClear) void handleOnSubmit(undefined, {});
    };

    return (
        <form data-testid="dynamic-form" onSubmit={handleOnSubmit} className={props.className}>
            <DynamicFormContext.Provider value={{ mode, values, onChange: handleOnFieldChange, errors }}>
                {/* Fields */}
                {fields.map((field, index) => {
                    // Check if field is a group
                    if ("fields" in field) return <InputFieldGroup key={`group-${index}`} {...field} />;
                    return <InputField key={field.name} {...field} />;
                })}
            </DynamicFormContext.Provider>
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
                            ref={btnSubmit}
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
                                    data-testid="btn-cancel"
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
