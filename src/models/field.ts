import { ReactElement } from "react";
import { IRule } from "@3dsteam/react-form-validator";

export interface IField {
    name: string;
    type: EFieldType;
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
    EMAIL = "EMAIL",
    SELECT = "SELECT",
    CHECKBOX = "CHECKBOX",
}
