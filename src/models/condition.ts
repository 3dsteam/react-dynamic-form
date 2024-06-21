export interface ICondition {
    /**
     * Condition to apply
     * @default "and"
     */
    condition?: "and" | "or";
    /**
     * List of rules to compare
     */
    rules: IConditionRule[];
}

export interface IConditionRule {
    /**
     * Field name
     */
    field: string;
    /**
     * Operator
     */
    operator: EConditionRuleOperator;
    /**
     * Value to compare
     *
     * If value is a string and starts with '{{' and ends with '}}' it will be considered a dynamic value:
     * dynamic value will be replaced with the value of the field name inside the brackets
     *
     * @default null
     */
    value: unknown;
}

export enum EConditionRuleOperator {
    EQUAL = "equal",
    NOT_EQUAL = "notequal",
    IS_NULL = "isnull",
    IS_NOT_NULL = "isnotnull",
    IS_EMPTY = "isempty",
    IS_NOT_EMPTY = "isnotempty",
}
