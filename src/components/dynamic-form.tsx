import useFormValidator, { IRule } from "@3dsteam/react-form-validator";
import _ from "lodash";
import { FormEvent, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import DynamicFormContext from "../context/dynamic-form";
import { EConditionRuleOperator, IConditionRule } from "../models/condition";
import { EFieldType, IFieldType } from "../models/field";
import { IFieldGroup } from "../models/group";
import { ISeparatorField } from "../models/separator";
import { flatValuesFromStructured, getStructuredValues } from "./dynamic-form.functions";
import { InputField } from "./input-field";
import { InputFieldGroup } from "./input-field-group";
import { SeparatorField } from "./separator-field";

interface IDynamicFormProps<T> {
    /**
     * Initial values for the form
     * @default undefined
     */
    values?: T;
    /**
     * List of fields to render
     */
    fields: (IFieldType | IFieldGroup | ISeparatorField)[];
    /**
     * Setup buttons
     * @default undefined
     */
    buttons: (args: { onSubmit: () => void; onCancel: () => void }) => ReactElement;

    /**
     * Callback function when form is submitted.
     * The data is a record of field name and value
     */
    onSubmit?: (values: T) => Promise<void> | void;
    /**
     * Callback function when form data changes
     */
    onChanges?: (values: T, isValid: boolean) => void;
    /**
     * Callback function when form is canceled
     * @default undefined
     */
    onCancel?: () => void;

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
     * Custom class name for the form
     * @default undefined
     */
    className?: string;
}

export const DynamicForm = <T extends Record<string, unknown>>(props: IDynamicFormProps<T>) => {
    const [values, setValues] = useState<Record<string, unknown>>(
        props.values ? flatValuesFromStructured(props.values) : {},
    );

    /**
     * Listener for initial values
     * Set values when props values changes
     */
    useEffect(() => {
        setValues(props.values ? flatValuesFromStructured(props.values) : {});
    }, [props.values]);

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
        const mapFields = (fields: (IFieldType | IFieldGroup | ISeparatorField)[]) => {
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
                .filter((field) => field !== null) as (IFieldType | IFieldGroup | ISeparatorField)[];
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
                // Skip separator fields
                if ("type" in field && field.type === EFieldType.SEPARATOR) return acc;
                // Function to set group validations
                const setGroupValidation = (group: IFieldGroup, prefix?: string) => {
                    group.fields.forEach((field) => {
                        // Skip separator fields
                        if ("type" in field && field.type === EFieldType.SEPARATOR) return;
                        // Set prefix for group fields
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

    type IFieldTypeAndGroup = IFieldType | IFieldGroup;

    const initRef = useRef(false);
    useEffect(() => {
        if (!props.validateOnInit || initRef.current) return;
        initRef.current = true;
        // Validate values
        const isValid = validate(values);
        const valueFields = fields.filter(
            (f) => "fields" in f || f.type !== EFieldType.SEPARATOR,
        ) as IFieldTypeAndGroup[];
        // Call onChanges callback with structured values
        props.onChanges?.(getStructuredValues(valueFields, values, props.nullOnUndefined) as T, isValid);
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
        const valueFields = fields.filter(
            (f) => !("type" in f) || f.type !== EFieldType.SEPARATOR,
        ) as IFieldTypeAndGroup[];
        // Call onChanges callback with structured values
        props.onChanges?.(getStructuredValues(valueFields, values, props.nullOnUndefined) as T, validate(values));
    }, [props.values, props.onChanges, fields, values, props.nullOnUndefined]);

    const handleOnSubmit = async (e?: FormEvent<HTMLFormElement>, overrideValues?: Record<string, unknown>) => {
        e?.preventDefault();

        // Avoid submit on other forms
        e?.stopPropagation();

        // Check if callback is undefined
        if (!props.onSubmit) {
            console.warn("onSubmit callback is not defined");
            return;
        }

        // Validate form and callback
        if (validate(overrideValues ?? values)) {
            const valueFields = fields.filter(
                (f) => !("type" in f) || f.type !== EFieldType.SEPARATOR,
            ) as IFieldTypeAndGroup[];
            // Call onSubmit callback with structured values
            await props.onSubmit(
                getStructuredValues(valueFields, overrideValues ?? values, props.nullOnUndefined) as T,
            );
            if (props.clearOnSubmit) handleOnCancel();
        }
    };

    const handleOnCancel = () => {
        setValues({});
        // Check for submit on clear
        if (props.submitOnClear) void handleOnSubmit(undefined, {});
        props.onCancel?.();
    };

    return (
        <form data-testid="dynamic-form" onSubmit={handleOnSubmit} className={props.className}>
            {/* Inputs form */}
            <DynamicFormContext.Provider value={{ values, onChange: handleOnFieldChange, errors }}>
                {/* Fields */}
                {fields.map((field, index) => {
                    // Check if field is a group
                    if ("fields" in field) return <InputFieldGroup key={`group-${index}`} {...field} />;
                    if (field.type === EFieldType.SEPARATOR)
                        return <SeparatorField key={`separator-${index}`} {...field} />;
                    return <InputField key={field.name} {...field} />;
                })}
            </DynamicFormContext.Provider>
            {/* Buttons */}
            {props.buttons({ onSubmit: handleOnSubmit, onCancel: handleOnCancel })}
        </form>
    );
};
