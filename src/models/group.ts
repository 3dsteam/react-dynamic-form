import { ICondition } from "./condition";
import { IField } from "./field";

export interface IFieldGroup {
    /**
     * Group identifier
     */
    name?: string;
    /**
     * Group title
     * @default undefined
     */
    title?: {
        /**
         * Title
         */
        content: string;
        /**
         * CSS class
         * @default undefined
         */
        className?: string;
    };
    /**
     * Group description
     * @default undefined
     */
    description?: {
        /**
         * Description
         */
        content: string;
        /**
         * CSS class
         * @default undefined
         */
        className?: string;
    };
    fields: (IField | IFieldGroup)[];
    /**
     * Render conditions
     * Show/hide the field based on the conditions
     * @default undefined
     */
    conditions?: ICondition;
    /**
     * CSS class
     * @default undefined
     */
    className?: string;
}
