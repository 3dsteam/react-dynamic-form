import { ReactElement } from "react";
import { IRule } from "@3dsteam/react-form-validator";
import { ICondition } from "./condition";

export interface IField {
    /**
     * Field identifier
     */
    name: string;
    /**
     * Field type
     * @default EFieldType.TEXT
     */
    type?: EFieldType;
    /**
     * Field helper text
     * @default undefined
     */
    helpText?: string;
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
     * Input template
     *
     * Render the input field
     */
    template: (data: {
        value: unknown;
        change: (args: { value: unknown }) => void;
        error: string | null;
    }) => ReactElement;
    /**
     * CSS class for the field container (<div />)
     * @default undefined
     */
    className?: string;
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
    MULTISELECT = "MULTISELECT",
    AUTOCOMPLETE = "AUTOCOMPLETE",
    CHECKBOX = "CHECKBOX",
}
