import { ReactElement } from "react";

export interface IField {
    name: string;
    type: EFieldType;
    placeholder?: string;
    helpText?: string;
    // Input components properties
    props?: Record<string, unknown>;
    // Field class (container)
    className?: string;
    // Custom render template
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
