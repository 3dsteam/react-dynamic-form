import { ReactElement } from "react";
import { IRule } from "@3dsteam/react-form-validator";
import { ICondition } from "./condition";

export interface IField {
    name: string;
    /**
     * Field type
     * @default EFieldType.TEXT
     */
    type?: EFieldType;
    label?: string;
    placeholder?: string;
    helpText?: string;
    /**
     * Input properties depending on the type
     *
     * @link Syncfusion https://ej2.syncfusion.com/react/documentation/introduction
     * @default undefined
     */
    props?: Record<string, unknown>;
    /**
     * Form validation rules
     *
     * @see https://github.com/3dsteam/react-form-validator
     * @default undefined
     */
    validations?: IRule;
    /**
     * Render conditions
     *
     * Show/hide the field based on the conditions
     * @default undefined
     */
    conditions?: ICondition;
    /**
     * CSS class
     *
     * @default undefined
     */
    className?: string;
    /**
     * Custom template
     *
     * Use this property to render you custom input field
     * @default undefined
     */
    template?: (data: { field: IField; value: unknown; onChange: (value: unknown) => void }) => ReactElement;
}

export enum EFieldType {
    TEXT = "TEXT",
    TEXTAREA = "TEXTAREA",
    PASSWORD = "PASSWORD",
    NUMBER = "NUMBER",
    DATE = "DATE",
    DATETIME = "DATETIME",
    DATERANGE = "DATERANGE",
    EMAIL = "EMAIL",
    SELECT = "SELECT",
    AUTOCOMPLETE = "AUTOCOMPLETE",
    CHECKBOX = "CHECKBOX",
}
