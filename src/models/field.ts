import { ReactElement } from "react";
import { IRule } from "@3dsteam/react-form-validator";
import { ICondition } from "./condition";

interface IField<T = unknown> {
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
     */
    template: (data: { value: T; change: (args: { value: T }) => void; error: string | null }) => ReactElement;
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

export interface ITextField extends IField<string> {
    /**
     * Cast field type to text
     * @default EFieldType.TEXT
     */
    type: EFieldType.TEXT | EFieldType.PASSWORD | EFieldType.EMAIL;
}

export interface ITextAreaField extends IField<string> {
    /**
     * Cast field type to textarea
     * @default EFieldType.TEXTAREA
     */
    type: EFieldType.TEXTAREA;
}

export interface INumberField extends IField<number> {
    /**
     * Cast field type to number
     * @default EFieldType.NUMBER
     */
    type: EFieldType.NUMBER;
}

export interface IDateField extends IField<Date> {
    /**
     * Cast field type to date
     * @default EFieldType.DATE
     */
    type: EFieldType.DATE | EFieldType.DATETIME;
}

export interface IDateRangeField extends IField<[Date, Date]> {
    /**
     * Cast field type to date range
     * @default EFieldType.DATERANGE
     */
    type: EFieldType.DATERANGE;
}

export interface ISelectField extends IField {
    /**
     * Cast field type to date range
     * @default EFieldType.SELECT
     */
    type: EFieldType.SELECT;
}

export interface IMultiSelectField extends IField<unknown[]> {
    /**
     * Cast field type to multi select
     * @default EFieldType.MULTISELECT
     */
    type: EFieldType.MULTISELECT;
}

export interface IAutoCompleteField extends IField<unknown> {
    /**
     * Cast field type to auto complete
     * @default EFieldType.AUTOCOMPLETE
     */
    type: EFieldType.AUTOCOMPLETE;
}

export interface ICheckboxField extends IField<boolean> {
    /**
     * Cast field type to checkbox
     * @default EFieldType.CHECKBOX
     */
    type: EFieldType.CHECKBOX;
}

export type IFieldType =
    | ITextField
    | ITextAreaField
    | INumberField
    | IDateField
    | IDateRangeField
    | ISelectField
    | IMultiSelectField
    | IAutoCompleteField
    | ICheckboxField;
