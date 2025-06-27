import { ReactElement } from "react";
import { ICondition } from "./condition";
import { EFieldType } from "./field";

export interface ISeparatorField {
    /**
     * Cast field type to separator
     * @default EFieldType.SEPARATOR
     */
    type: EFieldType.SEPARATOR;
    /**
     * Render conditions
     *
     * Show/hide the field based on the conditions
     * @default undefined
     */
    conditions?: ICondition;
    /**
     * Render custom separator
     * @default undefined
     */
    template?: () => ReactElement;
    /**
     * Custom CSS class for the separator
     * @default undefined
     */
    className?: string;
}
